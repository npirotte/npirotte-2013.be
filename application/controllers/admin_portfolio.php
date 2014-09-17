<?php 
/**
 * 
 */
 class Admin_portfolio extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->helper('file');
		$this->load->model('portfolio_model');
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

 	public function portfolio_list( $limit = null, $offset = 0 )
{		
		
		$data = $this->portfolio_model->portfolio_list( $limit, $offset);

		$this->output->set_output($data);

}

 	public function item_details($id)
{
	$this->load->model('tags_model');		

	$data = $this->portfolio_model->PorfolioDetails($id);

	foreach($this->lang->languages as $lang)
	{
		$data['meta_keywords_'.$lang] = $this->tags_model->get_meta_by_parent($id, 'portfolio_item_'.$lang, 'meta_keyword');
	}

	$this->output->set_output($data);

}

 	public function item_edit()
{				

	$this->load->library('form_validation');
	$this->load->model('db_model');
	$this->load->model('tags_model');
	$this->load->helper('directory');

	$item = json_decode(file_get_contents('php://input'), true);
	$_POST = $item;

	$this->db_model->set_validation_rules('portfolio_categories', $_POST['id']);
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
			$_POST['id'] = $this->portfolio_model->PortfolioCreate($_POST);

			// on déplace le thumb dans le bon répertoire
			if (file_exists(APPPATH.'assets/images/portfolio/new/thumbs/'.$_POST['src'])) 
			{	
				$dossier = check_dir(APPPATH.'assets/images/portfolio/'.$_POST['id'].'/thumbs/');
				rename(APPPATH.'assets/images/portfolio/new/thumbs/'.$_POST['src'] , $dossier.$_POST['src']);
			}
		}
		else
		{
			$this->portfolio_model->PortfolioUpdate($_POST);
		}

		try 
		{
			foreach($this->lang->languages as $lang)
			{
				$this->tags_model->save_meta($_POST['meta_keywords_'.$lang], $_POST['id'], 'portfolio_item_'.$lang, 'meta_keyword');
			}
		}
		catch(Exception $e)
		{
			
		}

		$message = "Portfolio enregitrée avec succès !";
		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();
	}

	$output = array(
		'id' => $_POST['id'],
		'error' => count($errors),
		'errors' => $errors,
		'message' => $message
		);

	$this->output->set_output($output);

	// on supprime le cache
	//delete_files(APPPATH.'cache/');

}


 



	public function delete($id)
{				

	$this->portfolio_model->PortfolioDelete($id);

	echo 'Page supprimé';

	$this->cache_manager->DeletePagesCache();
	$this->cache_manager->DeleteDbCache();
		
}

	
	public function categories_list($limit = null, $offset = 0)
{

		
		$data = $this->portfolio_model->categories_list($limit, $offset);

		$this->output->set_output($data);

}

 	public function category_details($id)
{		
	$this->load->model('tags_model');

	$data = $this->portfolio_model->CategoryDetails($id);

	foreach($this->lang->languages as $lang)
	{
		$data['meta_keywords_'.$lang] = $this->tags_model->get_meta_by_parent($id, 'portfolio_categories_'.$lang, 'meta_keyword');
	}

	$this->output->set_output($data);
}

	public function category_edit()
{		

	$this->load->library('form_validation');
	$this->load->model('db_model');
	$this->load->model('tags_model');

	$item = json_decode(file_get_contents('php://input'), true);
	$_POST = $item;

	$this->db_model->set_validation_rules('portfolio_categories', $_POST['id']);
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
			$_POST['id'] = $this->portfolio_model->CategoryCreate($_POST);
		}
		else
		{
			$this->portfolio_model->CategoryUpdate($_POST);
		}

		try 
		{
			foreach($this->lang->languages as $lang)
			{
				$this->tags_model->save_meta($_POST['meta_keywords_'.$lang], $_POST['id'], 'portfolio_categories_'.$lang, 'meta_keyword');
			}
		}
		catch(Exception $e)
		{
			
		}

		$message = "Catégories enregitrée avec succès !";
		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();
	}

	$output = array(
		'id' => $_POST['id'],
		'name' => $_POST['name'],
		'error' => count($errors),
		'errors' => $errors,
		'message' => $message
		);

	$this->output->set_output($output);

}


	public function category_delete($id)
{				
	$this->portfolio_model->categoryDelete($id);
	$this->cache_manager->DeletePagesCache();
	$this->cache_manager->DeleteDbCache();
}


 } 

 ?>