<?php 
/**
 * 
 */
 class Session extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->auth = new stdClass;
		//$this->load->library('flexi_auth');
	}
 	
 	public function login()
{
	$this->load->library('flexi_auth');
	$this->load->model('users_model');

	//récupération des données POST
	$name = $this->input->post('name');
	$pwd = $this->input->post('pwd');
	$remember = $this->input->post('remember');
	$user_ip = $this->input->ip_address();

	//$remember == 'true' ? $remember = TRUE : $remember = FALSE;
	$response = array();

	if ($this->flexi_auth->login($name, $pwd, $remember)) {
		$response['error'] = 0;

		if ($remember == true) {
			$this->users_model->RememberUserId($this->input->ip_address(), $this->flexi_auth->get_user_id());
		}
	}
	else
	{
		//echo "<div class='alert alert-danger'><span>Nom d'utilisateur ou mot de passe inconnu.</span></div>";
		//echo "<script>$(\"#alert\").hide(0).fadeIn(1000);errorEffect();$('#container').addClass('error')</script>";
		$response['error'] = 1;
		$response['message'] = "Nom d'utilisateur ou mot de passe inconnu.";
		$response['remember'] = $remember; 
		$response['user_ip'] = $user_ip;
	}

	$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
	$this->output->set_output(json_encode($response));
}

	public function login_for_api()
{
	$this->load->library('flexi_auth');
	$item = json_decode(file_get_contents('php://input'), true);

	//$item['remember'] == true ? $remember = TRUE : $remember = FALSE;

	if ($this->flexi_auth->login($item['username'], $item['password'], TRUE)) {
		$response = array(
			'success' => true,
			'user_id' => $this->auth->session_data['user_id'],
			'login_session_token' => $this->auth->session_data['login_session_token']
		);
	}
	else
	{
		$response = array(
			'success' => false
			);
	}

	$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
	$this->output->set_header('Access-Control-Allow-Origin: *');
	$this->output->set_header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, user_id, login_session_token');
	$this->output->set_output(json_encode($response));
}

 	public function logout()
{

	$this->flexi_auth->logout(FALSE);
	header('location: /');
}
	
	public function is_connected_api()
{
	$this->load->library('flexi_auth_lite');
	$data = array();

	// Authentification
	if ($this->flexi_auth->is_logged_in()) 
	{
		if ($this->flexi_auth->is_admin())
		{
			$response = 1;
		}
		else
		{
			$response = 0;
		}
	}
	else
	{
		$response = 0;
	}

	$response = $this->auth->session_data;

	$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
	$this->output->set_header('Access-Control-Allow-Origin: *');
	$this->output->set_header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, user_id, login_session_token');
	$this->output->set_output(json_encode($response));
}

	public function is_connected()
{
	$this->load->library('flexi_auth');
	$data = array();

	// Authentification
	if ($this->flexi_auth->is_logged_in()) 
	{
		if ($this->flexi_auth->is_admin())
		{
			$data['response'] = 1;
		}
		else
		{
			$data['response'] = 0;
		}
	}
	else
	{
		$data['response'] = 0;
	}

	$this->output->set_header('Access-Control-Allow-Origin: http://localhost:8100');
	$this->output->set_header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
	$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");	
	$this->output->set_output($data['response']);
}

	public function log()
{
	$this->load->library('session');

	$data = array('ip' => $_SERVER['REMOTE_ADDR'],'page_url' => 'post', 'time' => time() );

	$this_id = $this->general_model->create_item('global_log');
	$data['id'] = $this_id[0]->id;
	$this->general_model->update_item('global_log', $data);
}

 } 

 ?>