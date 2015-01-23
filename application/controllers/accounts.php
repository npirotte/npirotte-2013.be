<?php

class Accounts extends CI_Controller
{
	private $isAjax;
	private $users_model;

	public function __construct()
	{
		parent::__construct();

		$this->output->enable_profiler(false);

		$this->isAjax = $this->input->is_ajax_request();

		$this->users_model = new Users_model();
	}

	public function Register()
	{
		$this->load->helper('html');
		$this->load->helper('view');
		$this->load->helper('form_model_helper');
		$this->load->helper('form');
		$this->load->model('db_model');
		$this->load->library('form_validation');

		/*==========  handle post  ==========*/

		/*==========  data  ==========*/

		$groupsList = $this->users_model->PublicGroupsList();

		$data = array(
			'groupsList' => $groupsList
			);
		

		/*==========  View  ==========*/
		
		$page_title = 'Enregistrement';

		if ($this->isAjax) {
			$this->load->view('accounts/register_step1', $data);
		}
		else
		{

			$layout = array( 'page' => $this->load->view('accounts/register_step1', $data, true));

			// traitement des metas
			$meta_data = array();
			$meta_data['lang'] = $this->lang->lang();
			$meta_data['meta_keywords'] = [];
			$meta_data['meta_title'] = $page_title;
			$meta_data['meta_description'] = '';

			require_once(APPPATH.'viewModels/global/HeaderViewModel.php');
			$header_viewmodel['header_viewmodel'] = new HeaderViewModel($meta_data, 'page');

			$this->load->view('templates/meta_head', $header_viewmodel);
			$this->load->view('templates/layout', $layout);
			$this->load->view('templates/meta_foot');
		}
	}

	public function RegisterProfile()
	{
		$this->load->helper('html');
		$this->load->helper('view');
		$this->load->helper('form_model_helper');
		$this->load->helper('form');
		$this->load->model('db_model');
		$this->load->library('form_validation');

		/*==========  model validation  ==========*/

		$this->form_validation->set_rules('username', 'Nom d\'utilisateur', 'required');
		$this->form_validation->set_rules('email', 'Emailr', 'required');
		$this->form_validation->set_rules('userGroup', 'Type de compte', 'required');
		$this->form_validation->set_rules('pwd', 'Mot de passe', 'required');

		if (!$this->form_validation->run()) {
			$this->output->set_status_header("417");
			$this->output->set_output(validation_errors());
			return;
		}

	
		/*==========  data  ==========*/

		$groupsList = $this->users_model->PublicGroupsList();
		$groupName = '';

		foreach ($groupsList as $group) {
			if ($group['id'] === $this->input->post('userGroup')) {
				$groupName = $group['ugrp_name'];
			}
		}

		$data = array(
			'accountData' => $_POST,
			'groupName' => $groupName
			);
		

		/*==========  View  ==========*/
		
		$this->load->view('accounts/register_step2', $data);
		
	}

	public function Create()
	{
		$this->load->helper('html');
		$this->load->helper('view');
		$this->load->helper('form_model_helper');
		$this->load->helper('form');
		$this->load->model('db_model');

		/*==========  data  ==========*/

		print_r($_POST);
		

		/*==========  View  ==========*/
		
		$page_title = 'Profil créé !';

		if ($this->isAjax) {
			$this->load->view('accounts/register_step3', $data);
		}
		else
		{

			$layout = array( 'page' => $this->load->view('accounts/register_step3', $data, true));

			// traitement des metas
			$meta_data = array();
			$meta_data['lang'] = $this->lang->lang();
			$meta_data['meta_keywords'] = [];
			$meta_data['meta_title'] = $page_title;
			$meta_data['meta_description'] = '';

			require_once(APPPATH.'viewModels/global/HeaderViewModel.php');
			$header_viewmodel['header_viewmodel'] = new HeaderViewModel($meta_data, 'page');

			$this->load->view('templates/meta_head', $header_viewmodel);
			$this->load->view('templates/layout', $layout);
			$this->load->view('templates/meta_foot');
		}
	}
}