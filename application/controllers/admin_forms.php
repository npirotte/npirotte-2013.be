<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Admin_forms extends CI_Controller {

	public function __construct()
	{
		parent::__construct();
		$this->load->model('forms_model');
		$this->load->library('session');
		$this->load->library('Cache_manager', array());

		$this->auth = new stdClass;
		$this->load->library('Flexi_auth');

		// Authentification
		if ($this->flexi_auth->is_logged_in()) 
		{
			if ($this->flexi_auth->is_admin())
			{

			}
			else
			{
				exit('Access denied');
			}
		}
		else
		{
			exit('Access denied');
		}
	}

	public function _output($output)
	{
	    $this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
		echo json_encode($output);
	}

	/* formulaires
*******************************/

	public function forms_list($limit, $offset)
	{		
		$output = $this->forms_model->forms_list($limit, $offset);		
		$this->output->set_output($output);
	}

	public function form_details($id)
	{
		$output['items'] = $this->forms_model->form_details($id);
		$this->output->set_output($output);
	}

	public function form_edit()
	{

		$this->load->library('form_validation');
		$this->load->model('db_model');

		$_POST = $item = json_decode(file_get_contents('php://input'), true);

		$this->db_model->set_validation_rules('contact_forms', $item['id']);
		$errors = array();

		if (!$this->form_validation->run()) 
		{
			$this->form_validation->set_error_delimiters('', '');
			$errors = $this->form_validation->error_array();
			$message = "Le formulaire contient des erreurs";
		}
		else
		{

			if (!array_key_exists('id', $item)) {
				
				$output['id'] = $this->forms_model->form_create($item);
			}
			else
			{
				//$this->general_model->update_item('contact_forms', $item);
				$this->forms_model->form_update($item);
			}

			$message = 'Modifications enregistrées';
			$this->cache_manager->DeletePagesCache();
			$this->cache_manager->DeleteDbCache();

		}

		$output['error'] = count($errors);
		$output['errors'] = $errors;
		$output['message'] = $message;

		$this->output->set_output($output);
	}

	public function form_delete($id)
	{
		$this->forms_model->form_delete($id);

		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();
	}

	/* champs de formulaire
*******************************/

	public function fields_list($parent_id)
	{
		$output['items'] = $this->forms_model->fields_list($parent_id);

		$this->output->set_output($output);
	}

	public function field_edit()
	{

		$item = json_decode(file_get_contents('php://input'));
		$item = get_object_vars($item);

		$output = array();

		if (!array_key_exists('id', $item)) {
			$output['item'] = $item;
			$output['item']['id'] = $this->forms_model->field_create($item);
		}
		else
		{
			$this->forms_model->field_update($item);
		}

		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();

		$this->output->set_output($output);
	}

	public function field_delete($id)
	{

		$this->general_model->delete_item('contact_forms_fields', $id);

		$output = array();
		$output['error'] = 0;
		$output['message'] = 'Element supprimé';

		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();

		$this->output->set_output($output);
	}

}

/* End of file admin_forms.php */
/* Location: ./application/controllers/admin_forms.php */