<?php 
/**
 * 
 */
 class Admin_news extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->model('news_model');
		$this->load->model('db_model');
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

 	public function categories_list($limit = null, $offset = 0)
 {
 	$data = $this->news_model->admin_categories_list($limit, $offset);

 	$this->output->set_output($data);
 }

 	public function get_category($id)
 {
 	$data = array(
 		'content_items' => $this->news_model->admin_category_details($id)
 		);

 	$this->output->set_output($data);
 }

 	public function category_childs($id, $limit, $offset)

{
	$data = $this->news_model->admin_news_list($limit, $offset, $id);
	$this->output->set_output($data);

}

	public function category_edit()
{
	$this->load->library('form_validation');
	$this->load->model('db_model');

	$_POST = $item = json_decode(file_get_contents('php://input'), true);

	$this->db_model->set_validation_rules('news_categories', $item['id']);
	$errors = array();

	if (!$this->form_validation->run()) 
	{
		$this->form_validation->set_error_delimiters('', '');
		$errors = $this->form_validation->error_array();
		$message = "Le formulaire contient des erreurs";
	}
	else
	{
		if (!array_key_exists('id', $item)) 
		{
				
			$output['id'] = $this->news_model->category_create($item);
		}
		else
		{
			$this->news_model->category_update($item);
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

	public function category_delete($id)
{
	$this->news_model->category_delete($id);

	$this->cache_manager->DeletePagesCache();
	$this->cache_manager->DeleteDbCache();

	$this->output->set_output('ok');
}

 	public function news_list($limit = null, $offset = 0)
{		
		
		$data = $this->news_model->admin_news_list($limit, $offset);

		$this->output->set_output($data);
}

 	public function get_news($id)
{	
		
		$this->load->model('tags_model');	

		$data = $this->news_model->admin_news_details($id);

		$data['content_items']['meta_keywords'] = $this->tags_model->get_meta_by_parent($id, 'news_item', 'meta_keyword');
		$data['content_items']['tags'] = $this->tags_model->get_meta_by_parent($id, 'news_item', 'tags');

		$this->output->set_output($data);
}


 	public function news_edit()
{	
	$this->load->library('form_validation');
	$this->load->model('db_model');	
	$this->load->model('tags_model');
	$this->load->helper('directory');

	$_POST = $item = json_decode(file_get_contents('php://input'), true);

	$this->db_model->set_validation_rules('news_items', $item['id']);

	$errors = array();

	if (!$this->form_validation->run())
	{
		$this->form_validation->set_error_delimiters('', '');
		$errors = $this->form_validation->error_array();
		$message = "Le formulaire contient des erreurs";
	}
	else
	{
		if (!array_key_exists('id', $item)) 
		{	
			$output['id'] = $this->news_model->item_create($item);
			$_POST['id'] = $output['id'];

			// on déplace le thumb dans le bon répertoire
			if (file_exists(APPPATH.'assets/images/news/new/thumbs/'.$_POST['src'])) 
			{	
				$dossier = check_dir(APPPATH.'assets/images/news/'.$_POST['id'].'/thumbs/');
				rename(APPPATH.'assets/images/news/new/thumbs/'.$_POST['src'] , $dossier.$_POST['src']);
			}
		}
		else
		{
			$this->news_model->news_update($item);
		}

		try 
		{
			$this->tags_model->save_meta($_POST['meta_keywords'], $_POST['id'], 'news_item', 'meta_keyword');
		}
		catch(Exception $e)
		{
			
		}

		$message = "Modifications enregistrées";
		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();
	}



	$output['error'] = count($errors);
	$output['errors'] = $errors;
	$output['message'] = $message;

	$this->output->set_output($output);

}

	public function delete_news($id)
{				
	$this->load->model('tags_model');

	$this->tags_model->delete_tag_links_by_parent($id, 'news_item');
	$this->news_model->delete_news($id);
	$this->cache_manager->DeletePagesCache();
	$this->cache_manager->DeleteDbCache();
}

	public function push_online($id)
{


		$time = time();
		$data = array('id' => $id, 'published_on' => date('y-m-d'));
		$this->general_model->update_item('news_items', $data);
		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();
}

public function push_offline($id)
{
		$time = time();
		$data = array('id' => $id, 'archived_on' => date('y-m-d'));
		$this->general_model->update_item('news_items', $data);
		$this->cache_manager->DeletePagesCache();
		$this->cache_manager->DeleteDbCache();

}



 } 

 ?>