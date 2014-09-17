<?php 
/**
 * 
 */
 class Admin_contact extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->model('contact_model');
		$this->load->library('session');

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

 	public function messages_list($is_spam, $limit, $offset)
{		
		
		$data = $this->contact_model->get_messages($is_spam, $limit, $offset);	

		$this->output->set_output($data);
}

 	public function message($id)
{		
		
		$data = array(
			'content_items' => $this->contact_model->get_message($id)
		);

		$this->output->set_output($data);

}

	public function delete_message($id)
{
	$this->contact_model->delete_message($id);

	$data = array(
		'error' => 0
		);

	$this->output->set_output($data);
}

	public function get_contact_info($parent_id = 0)
	{
		
			$data = $this->general_model->get_sub_item('contact_infos', $parent_id);

			$this->output->set_output($data);
	}


	public function create_contact_info()
{	
	$this->load->helper('file');	



			$item = json_decode(file_get_contents('php://input'));
			$item = get_object_vars($item);
			$this_id = $this->general_model->create_item('contact_infos');
			$item['id'] = $this_id[0]->id;

			$this->general_model->update_item('contact_infos', $item);

			$this->output->set_output($item);

			delete_files(APPPATH.'cache/');

}

	public function edit_contact_info()
{
	$this->load->helper('file');


		$item = json_decode(file_get_contents('php://input'));
		$item = get_object_vars($item);


		$this->general_model->update_item('contact_infos', $item);

		$this->output->set_output($item);


		delete_files(APPPATH.'cache/');

}

	public function delete_contact_info()
{
	$this->load->helper('file');



		$item = json_decode(file_get_contents('php://input'));
		$item = get_object_vars($item);

		if ($this->general_model->delete_item('contact_infos', $item['id'])) {
			$data['message'] = 'Element supprimé.';
			$data['error'] = 0;

			delete_files(APPPATH.'cache/');
		}
		else
		{
			$data['message'] = 'Une erreur est survenue.';
			$data['error'] = 1;
		}

		$this->output->set_output($data);
}

// widgets

	public function unread_messages_nbr()
	{
		$data['count'] = $this->contact_model->unread_messages_nbr();

		$this->output->set_output($data);
	}

	public function last_messages()
	{

	}

 } 

 ?>