<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/** 
 * affiche la carte de restaurant
 *
 * @access	public
 * @param	$self
 * @return	string
 */

if ( ! function_exists('print_news_Item'))
{
	function print_carte($self) {
		//controler
		$self->load->model('carte_model');

		$data = $self->carte_model->ordered_categories_list();
		
		$self->load->view('carte/widgets/carte_tabs', $data);

	}
}