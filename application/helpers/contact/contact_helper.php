<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

	// ------------------------------------------------------------------------

/** 
 * affiche un formulaire de contact
 *
 * @access	public
 * @param	$self
 * @return	string
 */

if ( ! function_exists('print_form'))
{
	function print_form($form_id, $cssClass = '') {

		$CI =& get_instance();

		$lang = $CI->lang->lang();

		$CI->load->model('forms_model');
		$CI->load->helper('form');
		$CI->load->helper('url');
		$CI->load->helper('language');
		$CI->lang->load('forms', $lang);
	
		$form_data['form_config'] = array(
			'class' => 'ajax-form', 
			'id' => 'form_'.$form_id
			);

		$form_data['hidden'] = array(
			'culture' => $lang
			);

		/*if ($cssClass) {
			$form_data['form_config']['class'] .= ' '.$cssClass;	
		}*/

		$form_data['form_id'] = $form_id;
		$form_data['icon_regexp'] = '/^fa/';
		$form_data['form_fields'] = array();

		// récupère le form

		$form_fields = $CI->forms_model->fields_list($form_id);

		$i = 0;

		foreach($form_fields as $field) {

			$data = array(
				'name' => $field['name'], 
				'id' => 'form'.$form_id.'_input'.$field['name'],
				'placeholder' => $field['placeholder']
				);

			if ($field['is_mandatory'] == TRUE) {
				$data['data-required'] = 'true';
			}

			if ($field['validation'] != null) {
				$data['data-format'] = $field['validation'];
			}
			
			switch ($field['field_type'])
			{
				case 'text':
					$input = form_input($data);
					break;
				case 'textarea':
					$input = form_textarea($data);
					break;
				case 'select':
					$options = array('' => $field['placeholder']);

					foreach ($field['field_values'] as $value) {
						$options[$value->field_value] = $value->field_display_value;
					}

					$attributes = '';

					foreach ($data as $key => $value) {
						if ($key != 'name') {
							$attributes .= $key.'="'.$value.'" ';
						}
					}
					$input = form_dropdown($field['name'], $options, '', $attributes);
					break;
				case 'checkbox':
					$input = form_checkbox($data);
					break;
				case 'checkbox_list':
					$input = '';
					$i = 0;
					foreach ($field['field_values'] as $value) {
						$input .= '<label class="checkbox">'.$value->field_display_value.form_checkbox($field['name'], $value->field_value).'</label>';
					}
					break;
				case 'radio_list':
					$input = '';
					$i = 0;
					foreach ($field['field_values'] as $value) {
						$input .= '<label class="radio">'.$value->field_display_value.form_radio($field['name'], $value->field_value).'</label>';
					}
					break;
				case 'title':
				case 'help_text':
					$input = "";
					break;
			}

			$form_data['form_fields'][] = array(
				'display_name' => $field['display_name'],
				'type' => $field['field_type'],
				'field' => $input,
				'id' => $data['id']
				);	

		}

		//view
		$view = $CI->load->view('contact/forms/form', $form_data, TRUE);

		return $view;
	}
}

/**
* affiche les informations et lien de contact
* 
* @access public
* @param $self
* @return string
*/

if ( ! function_exists('print_contact_info_list')) 
{
	function print_contact_info_list($user = 0)
	{

		$CI =& get_instance();
		$view = '';

		$contact_info_list = $CI->general_model->get_sub_item('contact_infos', $user);

		foreach ($contact_info_list as $contact_info) {
			if ($contact_info['target']) {

				if (preg_match('/\b[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}\b/', $contact_info['target'])) {
					$contact_info['value'] = mailto($contact_info['target'], $contact_info['value']);
				}
				else
				{
					$contact_info['value'] = anchor($contact_info['target'], $contact_info['value'], 'target="blank"');
				}
			}
			$data['contact_info'] = $contact_info;
			$view .= $CI->load->view('contact/contact_info_item', $data, true);
		}

		return $view;
	}
}



 ?>
