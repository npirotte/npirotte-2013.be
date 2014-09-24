<?php 
/**
 * 
 */
 class Pages extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->library(array('smartcache'));

		$this->data = new stdClass;

		$this->data->ajax = $this->input->is_ajax_request();

		$this->load->library('flexi_auth');

	}
 	
 	public function view($lang = 'fr', $page = 'home')
{

	$this->load->helper('html');
	$this->load->helper('view');
	$this->load->library('parser');
	$this->load->model('pages_model');
	$this->load->model('tags_model');

	$lang = $this->lang->lang();

	// si home -> redirection
	if (uri_string() == $lang.'/pages/home') {
		redirect('/'.$lang);
	}

	$filename = $this->smartcache->CacheName($page, array('lang' => $lang, 'ajax' => $this->data->ajax, 'user_groups' => $this->flexi_auth->get_user_group()));

	$cache = $this->smartcache->get_data($filename);

	if ($cache && ENVIRONMENT != 'development') {
		$this->output->set_output($cache);
	}
	else
	{
		// get data	

		$page_data = $this->pages_model->get_page_by_slug($page, $lang);
		$page_data['lang'] = $lang;

		// 404 page //

		if ( count($page_data) === 0 )
		{
			// todo -> redirection si changement de slug
			// Whoops, we don't have a page for that!
			show_404();
		}

		// auth
		if ($page_data['user_groups'] && $page_data['user_groups'] != '') {
			$user_groups = explode(',', $page_data['user_groups']);
			if (!$this->flexi_auth->in_group($user_groups)) {
				exit();
			}
		}

		// template

		if ($page_data['type'] === 'template') 
		{
			$template = $this->pages_model->get_template($page_data['template']);
			$template_values = $this->pages_model->template_values_list($page_data['id'], $page_data['version']);
			$page_content = $this->parser->parse_template($template['content'], $template_values);

			$page_content = $this->parser->parse_string($page_content, array(), TRUE);
		}
		else
		{
			$page_content = $this->load->view('pages/'.$page_data['template'], array(), true);
		}

		

		//
		$page_data['meta_title'] = $this->config->item('site_name').' | '.$page_data['meta_title'];
		
		//chargement de la vue
		if ( $this->data->ajax ) {

				$meta = array(
					'bodyclass' => $data['bodyclass'],
					'title' => $page_data['meta_title']
					);

				$page_content .= $this->load->view('templates/ajax_callback', $meta, true);
				$this->output->set_output($page_content);
		}
		else {

			// meta keywords
			$page_data['meta_keywords'] = $this->tags_model->get_meta_by_parent($page_data['id'], 'pages_page', 'meta_keyword');

			// header view_model
			require_once(APPPATH.'viewModels/global/HeaderViewModel.php');
			$header_viewmodel['header_viewmodel'] = new HeaderViewModel($page_data, 'page');

			$this->load->view('templates/meta_head', $header_viewmodel);

			$layout['page'] = $page_content;

			$this->load->view('templates/layout', $layout);

			$this->load->view('templates/meta_foot');

		}

		$this->smartcache->save_output($filename);
	}
}
 } 

 ?>