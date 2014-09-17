<?php 
/**
 * 
 */
 class Admin extends CI_Controller
 {
 	
 	public function view()
{
	$this->auth = new stdClass;
	$this->load->library('flexi_auth_lite');
	$this->load->model('users_model');
	$this->load->helper('view');
	$this->load->helper('html');

	$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");

	$data = array();

	$data['site_name'] = $this->config->item('site_name');

	if (!$this->flexi_auth_lite->is_logged_in()) {

		$data['client_users'] = $this->users_model->UsersByIp($this->input->ip_address());
		$this->load->view('admin/pages/login', $data);
	}
	else if (!$this->flexi_auth_lite->is_admin())
	{
		header('location: /');
	}
	else
	{

		$user_id = $this->flexi_auth_lite->get_user_id();

		//$user_data = $this->general_model->get_item('user_accounts', 'user_id', $user_id);
		//$user_data = $this->users_model->admin_user_details($user_id);

		$data['user_name'] = '';//$user_data[0]['first_name'].' '.$user_data[0]['last_name'];//$user_name,
		$data['user_id']	= $user_id;//$user_id,
		$data['siteLanguages'] = json_encode($this->lang->languages);
		$data['bodyClass'] = 'desktop';
		

		/*require_once SYSDIR.'/third_party/Mobile_Detect.php';

		$detect = new Mobile_Detect;
		if ($detect->isMobile() || $detect->isTablet()) {
			$data['bodyClass'] = 'mobile';
		}*/

		$this->load->view('admin/templates/layout', $data);
	}
}
	
	public function notifications()
	{
		$this->load->model('contact_model');

		$items = $this->contact_model->get_messages(false, 5, 0);
		$data = array();
		//$data['content_items'] = array();

		// view model
		foreach ($items['items'] as $item) {
			$temp = array();
			$item['read_on'] === null ? $temp['is_unread'] = 1  : $temp['is_unread'] = 0;
			$temp['id'] = $item['id'];

			$have_sender = false;
			foreach ($item['fields'] as $field) {
				if ($field['field_name'] === 'Email') {
					$temp['text'] = 'Message de <br/>'.$field['field_value'];
					$have_sender = true;
				}
			}
			if (!$have_sender) {
				$temp['text'] = 'Nouveau message !';
			}
			$temp['url'] = 'contacts/messages/message/'.$temp['id'];

			$data[] = $temp;
 		};

		// $no1 = array('id' => 1, 'text' => 'notifications 1', 'url' => '#/1', 'statut' => 'unread' );
		// $no2 = array('id' => 2, 'text' => 'notifications 2', 'url' => '#/2', 'statut' => 'unread' );
		// $notifications = array($no1, $no2);

		$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");	
		$this->output->set_content_type('application/json')->set_output(json_encode($data));
	}

	public function view_loader($device, $module, $element, $function)
	{
		$this->load->library('smartcache');
		$this->load->config('smartcache');

		$this->config->set_item('cache_dir', APPPATH . 'cache/admin/');

		$filename = $device.'_'.$module.'_'.$element.'_'.$function;
		$expiry = 123456;

		$cache = $this->smartcache->get_data($filename);
		if ($cache && ENVIRONMENT != 'development') {
			$this->output->set_output($cache);
		}
		else
		{
			$this->load->model('db_model');
			$this->load->helper('admin/form_helper');
			$this->load->helper('form');

			$data = array(
			'self' => $this
			);
			$this->load->view('admin/views/'.$device.'/'.$module.'/'.$element.'/'.$function, $data, FALSE);

			$this->smartcache->save_output($filename);
		}
	}
 } 

 ?>