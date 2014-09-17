<?php 
/**
 * 
 */
 class Portfolio extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->library('smartcache');
		$this->load->model('portfolio_model');
		$this->data = new stdClass;

		$this->data->ajax = $this->input->is_ajax_request();
	}

	public function thumb_list($lang = 'fr', $category = false)
{
	$this->load->helper('portfolio/portfolio');

	$filename = 'porfolio_tumb_list_'.$lang;

	$filename = $this->smartcache->CacheName('porfolio_tumb_list', array('lang' => $lang, 'category' => $category));

	// get category data 
	if ($category) {
		$filename .= 'c'.$category;
		$category_data = $this->portfolio_model->CategoryDetails($category);
		$category_slug = $category_data['id'].'-'.url_title($category_data['name']);
	}

	$cache = $this->smartcache->get_data($filename);
	if ($cache && ENVIRONMENT  != 'development') {
		$this->output->set_output($cache);
	}
	else
	{
		$data = portfolio_thumb_list($category? $category_slug : false);
		$this->output->set_output($data);
		$this->smartcache->save_output($filename);
	}
}

	public function porfolio_list($lang = 'fr', $category = false)
{
	$this->load->helper(array('html', 'view'));
	$this->load->model('tags_model');


	$filename = $this->smartcache->CacheName('porfolio_list', array('lang' => $lang, 'ajax' => $this->data->ajax, 'category' => $category));

	$cache = $this->smartcache->get_data($filename);
	if ($cache && ENVIRONMENT  != 'development') {
		$this->output->set_output($cache);
	}
	else
	{
		$this->load->helper('portfolio/portfolio');
		$data = array();

		//gestion des catégories

		//calcul de l'id
		if ($category) {
			$category_id = explode('-', $category);
			$category_id = $category_id[0];
			$category_data = $this->portfolio_model->CategoryDetails($category_id, true);

			// redirection si le nom de la news n'est pas bon
			if($category != $category_id.'-'.url_title($category_data['name'], '-'))
			{
				redirect( site_url(array('portfolio', 'c'.$category_id.'-'.url_title($category_data['name'], '-'))), 'location', 301 );
			}
		}


		$data['list'] = portfolio_thumb_list($category? $category : false);

		$data['bodyclass'] = 'portfolio';
		$data['lang'] = $lang; 
		$data['title'] = 'Portfolio'. ($category ? '<br/><small>'.$category_data['name'].'</small>'  : '');
		$data['category_id'] = $category ? $category_id : false;

		$page_title = $this->config->item('site_name').' | '. ($category ? ($category_data['meta_title'] != '' ? $category_data['meta_title'] : $category_data['name'])  : 'Portfolio');

		//chargement de la page
		if ( $this->data->ajax ) {
			$meta = array(
				'bodyclass' => $data['bodyclass'],
				'title' => $page_title
				);

			$this->load->view('portfolio/item/list', $data);
			$this->load->view('templates/ajax_callback', $meta);
		}
		else {

			//chargement de du template
			$layout['page'] = $this->load->view('portfolio/item/list', $data, true);

			// traitement des metas
			$meta_data = array();
			$meta_data['lang'] = $lang;

			if ($category) 
			{
				$meta_data['meta_keywords'] = $this->tags_model->get_meta_by_parent($category_id, 'portfolio_categories_'.$this->lang->lang(), 'meta_keyword');
				$meta_data['meta_title'] = $page_title;
				$meta_data['meta_description'] = $category_data['meta_description'];
			}
			else
			{
				$meta_data['meta_keywords'] = array();//$this->tags_model->get_meta_by_parent($id, 'portfolio_item', 'meta_keyword');
				$meta_data['meta_title'] = $page_title;
				$meta_data['meta_description'] = '';
			}

			require_once(APPPATH.'viewModels/global/HeaderViewModel.php');
			$header_viewmodel['header_viewmodel'] = new HeaderViewModel($meta_data, 'portfolio');

			$this->load->view('templates/meta_head', $header_viewmodel);
			$this->load->view('templates/layout', $layout);
			$this->load->view('templates/meta_foot');
		}

		$this->smartcache->save_output($filename);
	}

}
 	
 	public function view($lang = 'fr', $slug, $category = false)
{

	$this->load->helper(array('html', 'view'));
	$this->load->model(array('tags_model', 'assets_model'));

	$filename = $this->smartcache->CacheName('porfolio_view', array('lang' => $lang, 'ajax' => $this->data->ajax, 'category' => $category));

	$cache = $this->smartcache->get_data($filename);

	if ($cache && ENVIRONMENT  != 'development') {
		$this->output->set_output($cache);
	}
	else
	{
		// code !

		//calcul de l'id
		$id = explode('-', $slug);
		$id = $id[0];

		// récupération des data
		$item = $this->portfolio_model->PorfolioDetails($id, true);

		if ( !array_key_exists('name', $item) )
		{
			// Whoops, we don't have a page for that!
			show_404();
		}

		//gestion des catégories
		$category_id = false;
		if ($category) {
			$category_id = explode('-', $category);
			$category_id = $category_id[0];
			$category_data = $this->portfolio_model->CategoryDetails($category_id, true);

			// on regarde si la catégorie existe pour l'élément
			$exist = false;
			foreach ($item['categories'] as $itemCategory) {
				if($itemCategory['parent_id'] === $category_id)  $exist = true;
			}

			if ( !array_key_exists('name', $category_data) || !$exist )
			{
				// Whoops, we don't have a page for that!
				show_404();
			}
		}

		//gestion des redirections
		
		if ($slug != $id.'-'.url_title($item['name'], '-') || ($category && $category != $category_id.'-'.url_title($category_data['name'], '-')))
		{

			if ($category) 
			{
				$url = site_url(array('portfolio', 'c'.$category_id.'-'.url_title($category_data['name'], '-'), $id.'-'.url_title($item['name'])));
			}
			else
			{
				$url = site_url(array('portfolio', $id.'-'.url_title($item['name'])));
			}	

			redirect( $url, 'location', 301 );
		}


		$images = $this->assets_model->AssetsByParent($id, 'portfolio_item');

		$navigation = $this->portfolio_model->PorfolioNavigation($item, $category_id);

		// création des view model

		$data = array();

		//item
		$data['itemViewModel'] = $item;

		//images
		$imagesDirectory = 'portfolio~'.$id;
		$data['imagesViewModel'] = array();
		require_once(APPPATH.'viewModels/assets/AssetImageViewModel.php');
		
		foreach ($images as $image) {
			$data['imagesViewModel'][] = new AssetImageViewModel($image, $imagesDirectory);
		}

		// navigation
		$data['navigationViewModel'] = array();
		require_once(APPPATH.'viewModels/portfolio/ThumbListWidgetViewModel.php');

		if (count($navigation['prev']) > 0) {
			$data['navigationViewModel']['prev'] = new ThumbListWidgetViewModel($navigation['prev'], $category);
		}

		if (count($navigation['next']) > 0) {
			$data['navigationViewModel']['next'] = new ThumbListWidgetViewModel($navigation['next'], $category);
		}


		// divers
		$data['bodyclass'] = 'portfolio';
		$data['lang'] = $lang; 
		$data['category'] = $category ? 'c'.$category : false;

		$page_title = $this->config->item('site_name').' | '.($item['meta_title'] != '' ? $item['meta_title'] : $data['itemViewModel']['name']);


		//chargement de la page
		if ( $this->data->ajax ) {
			$meta = array(
				'bodyclass' => $data['bodyclass'],
				'title' => $page_title
				);

			$this->load->view('portfolio/item/view', $data);
			$this->load->view('templates/ajax_callback', $meta);
		}
		else {

			//chargement de du template
			$layout['page'] = $this->load->view('portfolio/item/view', $data, true);

			// traitement des metas
			$meta_data = array();
			$meta_data['lang'] = $lang;
			$meta_data['meta_keywords'] = $this->tags_model->get_meta_by_parent($id, 'portfolio_item_'.$this->lang->lang(), 'meta_keyword');
			$meta_data['meta_title'] = $page_title;
			$meta_data['meta_description'] = $data['itemViewModel']['meta_description'] != '' ? $data['itemViewModel']['meta_description'] : $data['itemViewModel']['resume'];

			require_once(APPPATH.'viewModels/global/HeaderViewModel.php');
			$header_viewmodel['header_viewmodel'] = new HeaderViewModel($meta_data, 'portfolio');

			$this->load->view('templates/meta_head', $header_viewmodel);
			$this->load->view('templates/layout', $layout);
			$this->load->view('templates/meta_foot');
		}

		$this->smartcache->save_output($filename);
	}

}

 } 

 ?>