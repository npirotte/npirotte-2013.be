<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/** 
 * affiche un  menu
 *
 * @access	public
 * @param	$menuID
 * @return	string
 */

if ( ! function_exists('print_menu'))
{
	function print_menu($menuId, $baseLink = false) {

		$CI =& get_instance();

		$CI->load->library('url_service');

		$data = array();
		//controler

		$CI->load->model('menus_model');

		$menuData = $CI->menus_model->menuGet($menuId, $baseLink);	

		$view = $CI->load->view('pages/widgets/menu', $menuData, true);	

		return $view;
	}
}

/** 
 * affiche un  element de menu
 *
 * @access	private
 * @param	$item
 * @return	string
 */

if ( ! function_exists('print_menu_item'))
{
	function print_menu_item($item)
	{
		$CI =& get_instance();

		$item['url'] = $CI->url_service->GetUrl($item['module'], $item['function'], $item['element']);

		$view = $CI->load->view('pages/widgets/menu_item', $item, true);	
		return $view;
	}
}
