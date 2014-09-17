<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
* affiche une zone de bannière
* 
* @access public
* @param $self
* @return string
*/

if ( ! function_exists('banner_zone')) 
{
	function banner_zone($name)
	{
		$CI =& get_instance();

		$CI->load->model('banners_model');

		$banner_zone = $CI->banners_model->BannerZoneByName($name);
		$banners = $CI->banners_model->BannerByZone($banner_zone['id']);

		$data = array(
			'banner_zone' => $banner_zone, 
			'banners' => $banners,
			'unique_id' => 'banner_zone_'.$name
			);

		$view = $CI->load->view('banners/banners', $data, TRUE);

		return $view;
	}
}



 ?>
