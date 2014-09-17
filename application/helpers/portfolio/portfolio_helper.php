<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/** 
 * affiche une liste de catégories
 *
 * @access	public
 * @param	int
 * @return	string
 */

if ( ! function_exists('portfolio_categories_list'))
{
	function portfolio_categories_list($currentCategoryId = false) {

		$CI =& get_instance();
		$lang = $CI->lang->lang();

		$data = array();
		//controler

		$CI->load->model('portfolio_model');

		$content_items = $CI->portfolio_model->simple_categories_list();

		require_once(APPPATH.'viewModels/portfolio/PortfolioCategoriesListViewModel.php');

		//view
		$output = '<ul class="porfolio_categories_list">';
		$output .= '<li><a href="'.site_url('portfolio').'">Tout</a></li>';
		foreach ($content_items as $item) {
			$item = new PortfolioCategoriesListViewModel($item);
			$output .= '<li '.($currentCategoryId === $item->id ? 'class="active"' : '').' ><a data-id="'.$item->id.'" href="'.$item->Slug().'">'.$item->name.'</a></li>';
		}
		$output .= "</ul>";

		return $output;

	}
}

/** 
 * affiche une liste de thmbs
 *
 * @access	public
 * @param	int
 * @return	string
 */

if ( ! function_exists('portfolio_thumb_list'))
{
	function portfolio_thumb_list($category = false) {

		$CI =& get_instance();

		$data = array();
		//controler

		$CI->load->model('portfolio_model');

		//print_r($category);
		$options = array();
		if ($category) {
			$category_id = explode('-', $category);
			$category_id = $category_id[0];
			$options['category'] = $category_id;
		}

		$content_items = $CI->portfolio_model->simple_portfolio_list($options);

		require_once(APPPATH.'viewModels/portfolio/ThumbListWidgetViewModel.php');

		$data['porfolio_items'] = array();

		foreach ($content_items as $item) {
			$data['porfolio_items'][] = new ThumbListWidgetViewModel($item, $category);
		}

		//view
		
		$output = $CI->load->view('portfolio/widgets/thumbs_list', $data, true);

		return $output;

	}
}