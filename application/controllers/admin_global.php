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

 } 
