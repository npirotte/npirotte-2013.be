<?php 
/**
 * 
 */
 class Contact extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		
	}

	public function send($form_id)
{
	$this->load->model('forms_model');
	$this->load->model('contact_model');
	$this->load->library('form_validation');
	$this->load->library('email');
	$this->load->helper('language');

	// culture

	$lang = $this->input->post('culture');

	$this->lang->load('form_validation', $lang);

	// honnez pot 

	$this->form_validation->set_rules('honeypot', 'exact_length[0]');


	// on récupère l'info du formulaire

	$form_data = $this->forms_model->public_form_details($form_id);

	//print_r($form_data);

	$errors = array();
	$fiels_values = array();

	function errorModel($field_name, $message)
	{
		return array('field_name' => $field_name, 'message' => $message);
	}

	// récupération et vérifications des données

	foreach ($form_data['fields'] as $index => $field) {
		
		if ($field['field_type'] != 'title' && $field['field_type'] != 'help_text') {
			# code...
			$rules = '';

			// on regarde s'il est requis
			if ($field['is_mandatory']) {
				$rules .= 'required';
			}

			if (!empty($field['validation'])) {

				switch ($field['validation'])
				{
					case 'email':
						$rules .= '|valid_email'; 
						break;
					case 'int': 
						$rules .= '|integer'; 
						break;
					case 'float':
						$rules .= '|numeric';
						break;
					case 'url':
						$rules .= '|alpha_dash';
						break;
					case 'phone':
						break;
					case 'regexp':
						$rules .= '|regex_match['.$field['validation_regexp'].']';
						break;
				}

			}

			$this->form_validation->set_rules($field['name'], '"'.$field['name'].'"', $rules);

			// on stoque la valeur dans un tableau

			$fields_values[$field['name']] = $this->input->post($field['name']);

		}

	}

	// réponses

	$response = array();

	if ($this->form_validation->run() == FALSE)
	{
		//echo validation_errors();
		$response['error'] = 1;
		$response['error_list'] = array();
		$response['message'] = lang('error_message');

		$this->form_validation->set_error_delimiters('<span class="label label-important">', '</span>');

		foreach ($form_data['fields'] as $index => $field) {
			$error = form_error($field['name'], '', '');
			if (!empty($error)) {
				$response['error_list'][] = errorModel($field['name'], $error);
			}
		}
	}
	else
	{
		$response['error'] = 0;
		$response['message'] = $form_data['form']['success_message'];

		// on enregistre les données

		$contact_id = $this->contact_model->create_contact($form_id, $fields_values);

		$this->contact_model->send_mail($form_data['form']['mailto'], $fields_values, $contact_id);
	}

	$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
	$this->output->set_output(json_encode($response));

}

 } 

 ?>