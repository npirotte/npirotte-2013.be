<?php 
/**
 * 
 */
 class Admin_banners extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->model('banners_model');
		$this->load->library('session');
		$this->load->helper('file');
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

// controlers

 	public function bannerzone_list( $limit, $offset )
{		

		
		$data = $this->banners_model->admin_zones_list( $limit, $offset );

		$this->output->set_output($data);
}

 	public function get_item($id)
{		
	$this->load->helper('directory');
		
		$data = array(
		'content_items' => $this->banners_model->admin_BannerZoneDetails($id)
		);

		$this->output->set_output($data);
}

 	public function update_bannerzone()
{				

	$this->load->library('form_validation');
	$this->load->model('db_model');	

	$item = json_decode(file_get_contents('php://input'), true);
	$_POST = $item;

	$this->db_model->set_validation_rules('banners_zones', $_POST['id']);
	$errors = array();

	if (!$this->form_validation->run()) 
	{
		$this->form_validation->set_error_delimiters('', '');
		$errors = $this->form_validation->error_array();
		$message = "Le formulaire contiend des erreurs";
	}
	else
	{
		// on créé si l'élément n'a pas d'id
		if(!array_key_exists('id', $item))
		{
			$_POST['id'] = $this->banners_model->bannerZoneCreate($_POST);
		}
		else
		{
			$this->banners_model->bannerZoneUpdate($_POST);
		}

		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();

		$message = 'Modifications enregistrées';
	}

	$response = array(
		'error' => count($errors),
		'message' => $message,
		'id' => $_POST['id'],
		'errors' => $errors
		);

	$this->output->set_output($response);


}


	public function delete_bannerzone($id)
{				


		$this->banners_model->bannerZoneDelete($id);

		echo 'Page supprimé';

		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();
	
}

//medias

 	public function banner_list($id)
{		

		
		$data = array(
		'content_items' => $this->general_model->get_sub_item('banners_banners', $id)
		);

		//echo json_encode($data['content_items']);
		$this->output->set_output($data['content_items']);

}

 	public function get_banner($id)
{		
	$this->load->helper('directory');

		
		$data = array(
		'content_items' => $this->general_model->get_item('banners_banners', 'id', $id)
		);
		$this->output->set_output($data);

}


 	public function update_banner()
{	
	$this->load->helper('url');
	$this->load->library('form_validation');
	$this->load->model('db_model');	


	//$item = $_POST;
	$item = json_decode(file_get_contents('php://input'), true);
	$_POST = $item;

	$this->db_model->set_validation_rules('banners_banners', $_POST['id']);
	$errors = array();

	if (!$this->form_validation->run()) 
	{
		$this->form_validation->set_error_delimiters('', '');
		$errors = $this->form_validation->error_array();
		$message = "Le formulaire contiend des erreurs";
	}
	else
	{
		// on créé si l'élément n'a pas d'id
		if(!array_key_exists('id', $item))
		{
			$_POST['id'] = $this->banners_model->bannerCreate($_POST);
		}
		else
		{
			$this->banners_model->bannerUpdate($_POST);
		}

		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();

		$message = 'Modifications enregistrées';
	}

	$response = array(
		'error' => count($errors),
		'message' => $message,
		'id' => $_POST['id'],
		'errors' => $errors
		);

	$this->output->set_output($response);
}


	public function delete_banner($id)
{				


		$this->banners_model->bannerDelete($id);

		echo 'Page supprimé';

		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();
	
}

 } 

 ?>