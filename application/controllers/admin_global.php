<?php 
/**
 * 
 */
 class Admin_global extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->library('session');
		$this->load->library('Cache_manager', array());
		//$this->load->helper('file');

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

	public function tag_name_list()
	{
		$this->load->model('tags_model');

		$tags = $this->tags_model->get_meta_taxonomy();

		$output = array();

		foreach ($tags as $tag) {
			$output[] = $tag['name'];
		}

		$this->output->set_output($output);
	}

	// stylesheets

	public function stylesheets_list($limit, $offset)
	{
		$this->load->model('Stylesheets_model');

		$stylesheets = $this->Stylesheets_model->StyleSheetsList($limit, $offset);

		$this->output->set_output($stylesheets);
	}

	public function stylesheet_details($id)
	{
		$this->load->model('stylesheets_model');

		$data = $this->stylesheets_model->StylesheetDetails($id);

		$this->output->set_output($data);
	}


	public function stylesheets_edit()
	{
		$this->load->library('form_validation');
		$this->load->model('db_model');
		$this->load->model('stylesheets_model');

		$item = json_decode(file_get_contents('php://input'), true);

		$_POST = $item['item'];

		$this->db_model->set_validation_rules('global_stylesheets', $_POST['id']);
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
				$_POST['id'] = $this->stylesheets_model->StyleSheetCreate($_POST);
				// enregistrement du 1er version
				$item['childs'][0]['stylesheet_id'] = $_POST['id'];	
				$this->stylesheets_model->ContentCreate($item['childs'][0]);
			}
			else
			{
				// enregistrement des versiosn
				$hasAnOnline = false;
				foreach ($item['childs'] as $version) {
					if ($version['id'] === 'new' && $version['content'] && $version['content'] != '') {
						// mise à jour du compteur de version
						$_POST['versions'] = $version['version'];

						$this->stylesheets_model->ContentCreate($version);

						$hasAnOnline = $version['statut'] === 'online';
					}
					else
					{
						$currentStatut = $version['statut'];

						if (!$hasAnOnline)
						{
							//$hasAnOnline = $version['statut'] === 'online';
						}
						else
						{
							//$version['statut'] = 'offline';
						}

						if (($version['content'] && $version['content'] != '') || ($version['statut'] != $currentStatut)) {
							//$version['statut'] = $iAmCurrent ? 'online' : 'offline';
							$this->stylesheets_model->ContentUpdate($version);
						}
					}
				}

				$this->stylesheets_model->StyleSheetUpdate($_POST);
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

	public function stylesheets_content_details($id)
	{
		$this->load->model('stylesheets_model');

		$data = $this->stylesheets_model->ContentDetails($id);

		$this->output->set_output($data);
	}

/*	public function stylesheet_content_edit()
	{
		$this->load->library('form_validation');
		$this->load->model('db_model');
		$this->load->model('stylesheets_model');

		$_POST = $item = json_decode(file_get_contents('php://input'), true);

		$this->db_model->set_validation_rules('global_stylesheets_content', $_POST['id']);
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
				$_POST['id'] = $this->Menus_model->ContentCreate($_POST);
			}
			else
			{

				$this->stylesheets_model->ContentUpdate($_POST);
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
	}*/

 } 
