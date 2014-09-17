<?php 
/**
 * 
 */
 class Admin_menus extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->model('Menus_model');
		$this->load->helper('file');
		$this->load->library('Cache_manager', array());

		$this->auth = new stdClass;
		$this->load->library('Flexi_auth');

		$this->data = null;

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

public function menus_list($limit, $offset)
{
	$data = $this->Menus_model->menusList($limit, $offset);

 	$this->output->set_output($data);
}

public function menu_details($id)
{
	$data = $this->Menus_model->menuDetails($id);

	$this->output->set_output($data);
}

public function menu_edit()
{
	$this->load->library('form_validation');
	$this->load->model('db_model');

	$_POST = $item = json_decode(file_get_contents('php://input'), true);

	$this->db_model->set_validation_rules('menus_menus', $_POST['id']);
	$errors = array();

	if (!$this->form_validation->run()) 
	{
		$this->form_validation->set_error_delimiters('', '');
		$errors = $this->form_validation->error_array();
		$message = "Le formulaire contiend des erreurs";
	}
	else
	{
		// création de l'elements
		if (!isset($_POST['id'])) {
			$_POST['id'] = $this->Menus_model->menuCreate($_POST);
		}
		else
		{
			$this->Menus_model->menuUpdate($_POST);
		}

		$message = 'Modifications enregistrées';

		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();
	}

	$response = array(
		'error' => count($errors),
		'message' => $message,
		'id' => $_POST['id'],
		'errors' => $errors
		);

	$this->output->set_output($response);

}

public function menu_delete($id)
{
	$this->Menus_model->menuDelete($id);

	$this->cache_manager->DeletePagesCache();
	$this->cache_manager->DeleteDbCache();
}

// items

public function items_list($menuId)
{
	$data = $this->Menus_model->itemsTree($menuId);

	$this->output->set_output($data);
}

public function item_details($id)
{
	$data = $this->Menus_model->itemDetails($id);

	$this->output->set_output($data);
}

public function item_edit()
{
	$this->load->library('form_validation');
	$this->load->model('db_model');
	$this->load->helper('file');

	$_POST =$item = json_decode(file_get_contents('php://input'), true);

	$this->db_model->set_validation_rules('menus_items', $_POST['id']);
	$errors = array();

	if (!$this->form_validation->run()) 
	{
		$this->form_validation->set_error_delimiters('', '');
		$errors = $this->form_validation->error_array();
		$message = "Le formulaire contiend des erreurs";
	}
	else
	{
		// création de l'elements
		if (!isset($_POST['id'])) {
			$_POST['id'] = $this->Menus_model->itemCreate($_POST);
		}
		else
		{
			$this->Menus_model->itemUpdate($_POST);
		}

		$message = 'Modifications enregistrées';

		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();
	}

	$response = array(
		'error' => count($errors),
		'message' => $message,
		'id' => $_POST['id'],
		'errors' => $errors
		);

	$this->output->set_output($response);
}

public function item_reorder()
{
	$_POST =$item = json_decode(file_get_contents('php://input'), true);
	
	$this->Menus_model->itemUpdate($_POST);
	
	$this->cache_manager->DeletePagesCache();
	$this->cache_manager->DeleteDbCache();

	$response = array(
		'error' => 0,
		'message' => 'Elément modifié !',
		'id' => $_POST['id'],
		'errors' => array()
		);

	$this->output->set_output($response);
}

public function item_Delete($id)
{
	$this->Menus_model->itemDelete($id);

	$this->cache_manager->DeletePagesCache();
	$this->cache_manager->DeleteDbCache();

}


 } 

 ?>