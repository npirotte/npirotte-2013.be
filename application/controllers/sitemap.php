<?php 
/**
 * 
 */
 class Sitemap extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->model('general_model');
		$this->load->helper('url');
	}
 	
 	public function sitemap_view()
{

	function construct_url_news($object) {
		$url_name = strtolower($object['title']);
		$url_name = preg_replace('/[^a-z0-9 ]/', '', $url_name);
		$url_name = preg_replace('/ $/', '', $url_name);
		$url_name = str_replace(' ', '-', $url_name);
		$object['slug'] = $object['id'].'-'.$url_name;

		return  $object['slug'];
	}

	function construct_url_portfolio($object) {
		$url_name = strtolower($object['db_title_default']);
		$url_name = preg_replace('/[^a-z0-9 ]/', '', $url_name);
		$url_name = preg_replace('/ $/', '', $url_name);
		$url_name = str_replace(' ', '-', $url_name);
		$object['slug'] = $object['id'].'-'.$url_name;

		return  $object['slug'];
	}

	$urls = array();

	$pages = $this->general_model->get_all('pages');

	foreach ($pages as $page) {
		$urls[] = 'pages/'.$page['lang'].'/'.$page['name'];
	}

	$news_items = $this->general_model->get_all('news_items');

	$urls[] = 'news';

	foreach ($news_items as $news) {
		$urls[] = 'news/'.construct_url_news($news);
	}

	$portfolio_items = $this->general_model->get_all('portfolio');

	foreach ($portfolio_items as $portfolio) {
		$urls[] = 'portfolio/'.construct_url_portfolio($portfolio);
	}

	$data['urls'] = $urls;

	$this->load->view("sitemap",$data);

}
 } 

 ?>