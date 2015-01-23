<?php 
/**
 * 
 */
 class News extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->library('smartcache');
		$this->load->model('news_model');

		$this->output->enable_profiler(false);

		$this->data = new stdClass;

		$this->data->ajax = $this->input->is_ajax_request();

	}

 	public function get_news_ajax($id)
{
	
	$news_model = $this->news_model->news_details($id);
	$news_model['id'] = $id;		

	require_once(APPPATH.'viewModels/news/NewsItemViewModel.php');
	$news['news_item'] = new NewsItemViewModel($news_model);

	$this->load->view('news/widgets/item_full', $news);


}

	public function news_list($category = false)
{
	$this->load->helper('html');
	$this->load->helper('view');
	$this->load->model('tags_model');

	$lang = $this->lang->lang();

	$filename = $this->smartcache->CacheName('news_list_'.$category, array('lang' => $lang, 'ajax' => $this->data->ajax));

	// récupération du cache

	$cache = $this->smartcache->get_data($filename);

	if ($cache && ENVIRONMENT  != 'development') {
		$this->output->set_output($cache);
	}
	else
	{

		// récupération du modèle

		$data = $this->news_model->news_list($category, 20, 0);

		// application du view model
		require_once(APPPATH.'viewModels/news/NewsListViewModel.php');

		$newsViewModel = array();

		foreach ($data['news_list'] as $news) {
			$newsViewModel[] = new NewsListViewModel($news);
		}

		$data['news_list'] = $newsViewModel;

		$data['bodyclass'] = 'news';
		$data['lang'] = $lang; 

		$page_title = $this->config->item('site_name').' | '.$data['category']['name'];
		
		//chargement de la page
		if ( $this->data->ajax ) {
			$meta = array(
				'bodyclass' => 'news',
				'title' => $page_title
				);

			$this->load->view('news/news/list', $data);
			$this->load->view('templates/ajax_callback', $meta);
		}
		else {

			//chargement de du template
			$layout['page'] = $this->load->view('news/news/list', $data, true);

			// traitement des metas
			$meta_data = array();
			$meta_data['lang'] = $lang;
			$meta_data['meta_keywords'] = $this->tags_model->get_meta_by_parent($data['category']['id'], 'news_categories', 'meta_keyword');
			$meta_data['meta_title'] = $page_title;
			$meta_data['meta_description'] = "";

			require_once(APPPATH.'viewModels/global/HeaderViewModel.php');
			$header_viewmodel['header_viewmodel'] = new HeaderViewModel($meta_data, 'page');

			$this->load->view('templates/meta_head', $header_viewmodel);
			$this->load->view('templates/layout', $layout);
			$this->load->view('templates/meta_foot');
		}

		$this->smartcache->save_output($filename);
	}

}

	public function View ($slug) 
{
	$this->load->helper('html');
	$this->load->helper('view');
	$this->load->model(array('tags_model', 'assets_model'));

	$lang = $this->lang->lang();

	$filename = $this->smartcache->CacheName('news_'.$slug, array('lang' => $lang, 'ajax' => $this->data->ajax));

	$cache = $this->smartcache->get_data($filename);
	
	if ($cache && ENVIRONMENT  != 'development') {
		$this->output->set_output($cache);
	}
	else
	{

		//calcul de l'id
		$id = explode('-', $slug);
		$id = $id[0];


		// récupération de la news

		$data = array();

		$news = $this->news_model->news_details($id);
		$news['id'] = $id;


		if ( !array_key_exists('title', $news) )
		{
			// Whoops, we don't have a page for that!
			show_404();
		}

		// redirection si le nom de la news n'est pas bon

		if($slug != $id.'-'.url_title($news['title'], '-'))
		{
			redirect( $lang.'/news/post/'.$id.'-'.url_title($news['title'], '-'), 'location', 301 );
		}

		//$data['prev_next'] = '';//$this->news_model->get_prev_next($data['news']['parent_id'], $id, 1);

		// data supplémentaire

		$images = $this->assets_model->AssetsByParent($id, 'news_item');

		$navigation = $this->news_model->NewsNavigation($news, $news['parent_id']);

		// view model

		//images
		$imagesDirectory = 'news~'.$id;
		$data['imagesViewModel'] = array();
		require_once(APPPATH.'viewModels/assets/AssetImageViewModel.php');
		
		foreach ($images as $image) {
			$data['imagesViewModel'][] = new AssetImageViewModel($image, $imagesDirectory);
		}

		//news
		require_once(APPPATH.'viewModels/news/NewsItemViewModel.php');
		$data['news'] = new NewsItemViewModel($news);

		// navigation
		$data['navigationViewModel'] = array();
		//require_once(APPPATH.'viewModels/portfolio/ThumbListWidgetViewModel.php');

		if (count($navigation['prev']) > 0) {
			//$data['navigationViewModel']['prev'] = new ThumbListWidgetViewModel($navigation['prev'], $category);
		}

		if (count($navigation['next']) > 0) {
			//$data['navigationViewModel']['next'] = new ThumbListWidgetViewModel($navigation['next'], $category);
		}

		// divers
		$data['lang'] = $lang;
		$data['bodyclass'] = 'news';

		$page_title = $this->config->item('site_name').' | '.$news['title'];
		
		//chargement de la page
		if ( $this->data->ajax ) {

			$meta = array(
				'bodyclass' => 'news',
				'title' => $page_title
				);

			$this->load->view('news/news/view', $data);
			$this->load->view('templates/ajax_callback', $meta);
		}
		else {
			//chargement de du template
			$layout['page'] = $this->load->view('news/news/view', $data, true);	

			// traitement des metas
			$meta_data = array();
			$meta_data['lang'] = $lang;
			$meta_data['meta_keywords'] = $this->tags_model->get_meta_by_parent($id, 'news_item', 'meta_keyword');
			$meta_data['meta_title'] = $page_title;
			$meta_data['meta_description'] = $news['resume'];

			require_once(APPPATH.'viewModels/global/HeaderViewModel.php');
			$header_viewmodel['header_viewmodel'] = new HeaderViewModel($meta_data, 'page');

			$this->load->view('templates/meta_head', $header_viewmodel);
			$this->load->view('templates/layout', $layout);
			$this->load->view('templates/meta_foot');
		}

		$this->smartcache->save_output($filename);

	}
	
}

 	


 } 

 ?>