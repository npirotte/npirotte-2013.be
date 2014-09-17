<?php 
/**
 * 
 */
 class Admin_helpers extends CI_Controller
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

	public function icons_list()
	{
		$this->load->helper('file');
		$iconRegex = '/(@{fa-css-prefix}){1}([a-z\-])*([^:])/';
		$iconPrefix = 'fa';

		$iconsSheet = read_file(APPPATH.'front/framework/font-awesome/less/icons.less');

		preg_match_all($iconRegex, $iconsSheet, $resultTree);

		foreach ($resultTree[0] as $icon) {
			$output[] = str_replace('@{fa-css-prefix}', $iconPrefix, $icon);
		}

		$this->output->set_output($output);
	}

 } 
