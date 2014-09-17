<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/** 
 * affiche un element de news
 *
 * @access	public
 * @param	$self
 * @param	int
 * @return	string
 */

if ( ! function_exists('print_news_Item'))
{
	function last_news_item($category) {

		$CI =& get_instance();

		$data = array();
		//controler

		$CI->load->model('news_model');

		$content_items = $CI->news_model->news_list($category, 1, 0, true);

		//$data['news_item'] = $content_items['news_list'][0];
		//$data['news_item']['date'] = date('d/m/Y', $data['news_item']['date']);

		require_once(APPPATH.'viewModels/news/LastNewsWidgetViewModel.php');

		$data['news_item'] = new LastNewsWidgetViewModel($content_items['news_list'][0]);

		$view = $CI->load->view('news/widgets/item_full', $data, TRUE);

		return $view;

	}
}

/** 
 * affiche la liste des news online
 *
 * @access	public
 * @param	$self
 * @param	$int
 * @return	string
 */

if ( ! function_exists('news_list'))
{
	function news_list($category, $nbr) {

		$CI =& get_instance();
		$data = array(
			'category' => $category
			);

		$CI->load->model('news_model');
		$CI->load->helper('url');

		$content_items = $CI->news_model->news_list($category, $nbr, 0, false);

		$data['items'] = array();
		$i = 0;

		require_once(APPPATH.'viewModels/news/NewsListWidgetViewModel.php');

		foreach ($content_items['news_list'] as $item) {
			$data['items'][] = new NewsListWidgetViewModel($item, $i++);
		}

		$view = $CI->load->view('news/widgets/news_list', $data, TRUE);

		return $view;
		
	}
}


?>
