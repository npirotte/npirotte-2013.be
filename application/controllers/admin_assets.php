<?php 
/**
 * 
 */
 class Admin_assets extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->helper('file');
		$this->load->helper('directory');

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

// controlers ofr assets manager

 	public function assets_list()
{		


		$folder = file_get_contents('php://input');
		
		$data = array(
		'content_items' => directory_map(APPPATH.'assets/'.$folder, TRUE)
		);

		$this->output->set_output($data);

}

	public function create_folder()
{

		$dirname = file_get_contents('php://input');

		$response = array(
			'error' => 0,
			'message' => ''
			);

		if (!file_exists(APPPATH.$dirname)) {
		    mkdir(APPPATH.$dirname, 0777);
		    $response['message'] = "Le dossier $dirname a été crée.";
		} else {
		    $response['message'] = "Le dossier $dirname exite déjà.";
		    $response['error'] = 1;
		};

		$this->output->set_output($response);

}

	public function rename()
{
	$data = file_get_contents('php://input');
	$data = json_decode($data);

	if ($data->file_type == 'folder') {
		$new_name = url_title($data->new_file_name, 'underscore', TRUE);
	}
	else
	{
		// on enleve l'extention si elle existe
	    $trouve_moi = ".";
	    // cherche la postion du '.'  
	    $position = strpos($data->new_file_name, $trouve_moi);
	    // enleve l'extention, tout ce qui se trouve apres le '.' 
	    $new_name = substr($data->new_file_name, 0, $position);
	    
	    $extension = strrchr($data->new_file_name, '.');

	    $new_name = url_title($new_name, 'underscore', TRUE);
	    $new_name = $new_name.$extension;
	}

	$response = array();

	if(rename(APPPATH.$data->path, APPPATH.$data->new_path.$new_name))
	{
		$response['error'] = 0;
		$response['message'] = 'Dossier renommé avec succès !';
		$response['new_file_name'] = $new_name;
	}
	else
	{
		$response['error'] = 1;
		$response['message'] = 'Ce nom de dossier n’est pas disponible';
		$response['extention'] = $extension;
	}

	$this->output->set_output($response);
}


 	public function delete_file()
{		



		$file = file_get_contents('php://input');

		$error = 1;

		$is_file  = strpos($file, '.');

		if ($is_file) {
			if (unlink(APPPATH.'assets/'.$file)) {
				$error = 0;
			}
		}
		else
		{
			if (delete_dir(APPPATH.'assets/'.$file)) {
				$error = 0;
			}
		}
		
		
		$data = array(
		'error' => $error,
		);

		$this->output->set_output($data);

}

	// controllers for assets images 

	public function assets_images_by_parent($parent_id, $parent_identity)
	{
		$this->load->model('assets_model');

		$response = $this->assets_model->AssetsByParent($parent_id, $parent_identity);

		$this->output->set_output($response);
	}

	public function asset_details($id)
	{

	}

	public function asset_edit()
	{
		$this->load->model('assets_model');
		$this->load->model('db_model');
		$this->load->library('form_validation');
		$this->load->library('Cache_manager', array());

		$item = json_decode(file_get_contents('php://input'), true);
		$_POST = $item;

		$this->db_model->set_validation_rules('assets_images', $_POST['id']);
		$errors = array();

		if (!$this->form_validation->run()) 
		{
			$this->form_validation->set_error_delimiters('', '');
			$errors = $this->form_validation->error_array();
			$message = "Le formulaire contiend des erreurs";
		}
		else
		{
			if(!array_key_exists('id', $item))
			{
				$_POST['id'] = $this->assets_model->CreateAsset($item);
			}
			else
			{
				$this->assets_model->EditAsset($item);
			}

			$this->cache_manager->DeletePagesCache();
			$this->cache_manager->DeleteDbCache();
		}

		$response = array(
			'errors' => $errors,
			'error' => count($errors),
			'id' => $_POST['id']
			);

		$this->output->set_output($response);
	}

	public function asset_delete($id)
	{

	}


 } 

 ?>