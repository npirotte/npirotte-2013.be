<?php 
/**
 * 
 */
 class Admin_pages extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->model('pages_model');
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

 	public function pages_list( $limit, $offset, $lang = false )
{		
		if ($limit == 0) {
			$limit = false;
		}
		
		$data = $this->pages_model->pages_list($limit, $offset, $lang);

		$this->output->set_output($data);

}

	public function site_map($lang = 'fr')
{
	$site_map = $this->pages_model->site_map($lang);

	$this->output->set_output($site_map);

}

 	public function pages_details($id)
{		
	$this->load->model('tags_model');
	$data = $this->pages_model->pages_details($id);

	$data['page_data']['meta_keywords'] = $this->tags_model->get_meta_by_parent($id, 'pages_page', 'meta_keyword');

	$this->output->set_output($data);

}

public function page_reorder()
{
	$this->load->helper('file');

	$item = json_decode(file_get_contents('php://input'), true);

	//print_r($item);

	$this->pages_model->simpleReorder($item);

	$this->cache_manager->DeletePagesCache();
	$this->cache_manager->DeleteDbCache();

	$this->output->set_output($item);
}	

public function get_page_order($id)
{
	$data = $this->pages_model->getPageOrder($id);

	$this->output->set_output($data);
}

public function page_edit()
{
	$this->load->library('form_validation');
	$this->load->library('parser');
	$this->load->model('db_model');
	$this->load->model('tags_model');
	$this->load->helper('file');

	$item = json_decode(file_get_contents('php://input'), true);

	$_POST = $item['page_data'];
	$template_values = $item['template_values'];

	//print_r($item);

	$this->db_model->set_validation_rules('pages', $_POST['id'] ? $_POST['id'] : 0, $_POST['lang']);
	$errors = array();

	if (!$this->form_validation->run()) 
	{
		$this->form_validation->set_error_delimiters('', '');
		$errors = $this->form_validation->error_array();
		$message = "Le formulaire contiend des erreurs";
	};

	// gestion des erreurs template
	if ($_POST['type'] === 'template') {
		foreach ($template_values as $template_value) {
			if ($template_value['is_required'] == 1 && ( !isset($template_value['fieldValue']) || $template_value['fieldValue'] == '')) {
				$errors[] = 'Le champ '.$template_value['name'].' est requis.';
			}
		}
	}

	if(count($errors) === 0)
	{
		// versioning
		if (!isset($_POST['version'])) {
			$_POST['version'] = 1;
		}
		else
		{
			$_POST['version']++;
		}

		// création de la page
		if (!isset($_POST['id'])) {
			$_POST['id'] = $this->pages_model->pages_create($_POST);
		}
		else
		{
			$this->pages_model->pages_update($_POST);
		}
		//enregistrement des métas keywords

		try 
		{
			$this->tags_model->save_meta($_POST['meta_keywords'], $_POST['id'], 'pages_page', 'meta_keyword');
		}
		catch(Exception $e)
		{
			
		}
		

		// création des templates
		if ($_POST['type'] === 'template') {
			$this->pages_model->save_template_values($template_values, $_POST['version'], $_POST['id'], $_POST['template']);
		}
		
		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();
		
		$message = "Page enregitrée avec succès !";
	}

	$output['id'] = $_POST['id'];
	$output['error'] = count($errors);
	$output['errors'] = $errors;
	$output['message'] = $message;
	$output['version'] = $_POST['version'];

	$this->output->set_output($output);

}


	public function pages_delete($id)
{				
	$this->pages_model->pagesDelete($id);

	$this->cache_manager->DeletePagesCache();
	$this->cache_manager->DeleteDbCache();
}


// templates

	public function templates_list($limit = null, $offset = 0)
	{
		$this->data = $this->pages_model->templates_list($limit, $offset);

		$this->output->set_output($this->data);
	}

	public function templates_details($id)
	{
		$output = $this->pages_model->templates_details($id);

		$this->output->set_output($output);
	}

	public function template_files_list()
	{
		$output = array();
		$dirname = './application/views/pages/'; 
		$dir = opendir($dirname);
		while($file = readdir($dir)) { 
			if($file != '.' && $file != '..' && !is_dir($dirname.$file)) 
			{ 
				$extension = strrchr($file,'.');
				$extension = substr($extension,1);
				if ( $extension == 'php' or $extension == 'html') {
				  	$output[] = $file;
				  }  
			} 
		}

		$this->output->set_output($output);
	}

	public function templates_fields_list($id, $page_id = false)
	{
		$data = $this->pages_model->templates_fields_list($id, $page_id);

		$this->output->set_output($data);
	}

	public function templates_edit()
	{
		$this->load->library('form_validation');
		$this->load->library('parser');
		$this->load->model('db_model');
		$this->load->helper('file');

		$_POST = $item = json_decode(file_get_contents('php://input'), true);

		$this->db_model->set_validation_rules('pages_templates', $item['id']);
		$errors = array();

		if (!$this->form_validation->run()) 
		{
			$this->form_validation->set_error_delimiters('', '');
			$errors = $this->form_validation->error_array();
			$message = "Le formulaire contiend des erreurs";
		}
		else
		{
			if (!isset($item['id'])) 
			{
				$item['id'] = $this->pages_model->template_create($item);
			}
			else
			{
				$this->pages_model->template_edit($item);
			}

			////// traitement du template ////////

				// récupération des champs existants
			$current_fields = $this->pages_model->templates_fields_list($item['id']);

				// parse du template
			if ($item['type'] === 'file') {
				// on over write item content
				$item['content'] = read_file(APPPATH.'views/pages/'.$item['content']);
			}

			$new_fields = $this->parser->record_templatefields($item['content']);

			// on compare
			foreach ($current_fields as $current_field) {
				if (isset($new_fields[$current_field['name']])) {
					$new_fields[$current_field['name']]['id'] = $current_field['id'];
					$new_fields[$current_field['name']]['old_name'] = $current_field['full_name'];
				}
				else
				{
					$this->pages_model->templates_fields_delete($current_field['id']);
				}
			}

			// on enregistre
			foreach ($new_fields as $new_field) {
				$new_field['parent_id'] = $item['id'];
				$this->pages_model->templates_fields_edit($new_field);
			}


			$this->cache_manager->DeletePagesCache();
			$this->cache_manager->DeleteDbCache();
			$message = 'Template enregistré avec succes !';
		}

		$output['id'] = $item['id'];
		$output['error'] = count($errors);
		$output['errors'] = $errors;
		$output['message'] = $message;

		$this->output->set_output($output);
	}

	public function templates_delete($id)
	{
		$this->pages_model->templates_delete($id);
		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();
	}

 } 

 ?>