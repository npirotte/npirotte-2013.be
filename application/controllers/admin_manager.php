<?php 

/**
 * 
 */
 class Admin_manager extends CI_Controller
 {

 	public function __construct()
	{
		parent::__construct();
		$this->load->model('users_model');
		$this->load->helper('file');
		$this->load->library('Cache_manager', array());
		$this->load->library('session');

		$this->auth = new stdClass;
		$this->load->library('Flexi_auth');

		// headers pour app mobile //

		/*$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
		$this->output->set_header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, user_id, login_session_token');
		$this->output->set_header('Access-Control-Allow-Origin: *');*/

		// Authentification
		if ($this->flexi_auth->is_logged_in()) 
		{
			if ($this->flexi_auth->is_admin())
			{

			}
			else
			{
				$this->output->set_status_header("401");
				exit();
			}
		}
		else
		{
			$this->output->set_status_header("401");
			exit();
		}
	}

	public function _output($output)
	{
	    $this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
		echo json_encode($output);
	}


// controlers

	public function users_list($limit = null, $offset = 0)
{				
	$this->data = $this->users_model->admin_users_list();
	$this->output->set_output($this->data);
}

	public function user_details($id)
{
	$this->data = $this->users_model->admin_user_details($id);
	$this->output->set_output($this->data);
}

	public function user_infos($id)
{
	$this->data = $this->users_model->user_infos($id);
	$this->output->set_output($this->data);
}

	public function insert_default_user()
{

	$activate = TRUE;

	$user = array(
		'email' => 'nicolaspirotte.31@gmail.com',
		'username' => 'npirotte',
		'pwd1' => 'jqueryhtml'
		);

	$id = $this->users_model->insert_user($user);

	$errors = $this->flexi_auth->error_messages();

	print_r($errors);

}

	public function update_user()
{
	$user = json_decode(file_get_contents('php://input'));
	$user = get_object_vars($user);

	if (!array_key_exists('user_id', $user)) 
	{

		$id = $this->users_model->insert_user($user);
		$this->data['user_id'] = $id;

		/*// on déplace le thumb dans le bon répertoire
		if (file_exists(APPPATH.'assets/images/users/new/thumbs/'.$_POST['src'])) 
		{	
			$dossier = check_dir(APPPATH.'assets/images/users/'.$_POST['id'].'/thumbs/');
			rename(APPPATH.'assets/images/news/users/thumbs/'.$_POST['src'] , $dossier.$_POST['src']);
		}*/
	}

	else
	{
		$this->users_model->update_user($user['user_id'], $user);
	}

	$this->data['message'] = $this->flexi_auth->error_messages();

	count($this->data['message']) === 0 ? $this->data['error'] = 0 : $this->data['error'] = 1;

	if ($this->data['error'] === 0) {
		$this->data['message'] = $this->flexi_auth->status_messages();
	}

	$this->cache_manager->DeletePagesCache();
	$this->cache_manager->DeleteDbCache();

	$this->output->set_output($this->data);
}

	public function activate_user($user_id)
{
	$this->flexi_auth->update_user($user_id, array('active' => 1));
	$this->data['message'] = 'Utilisateur activé';
	delete_files(APPPATH.'cache/');
	$this->output->set_output($this->data);
}


	public function delete_user($user_id)
{				

	$this->data['message'] = $this->users_model->delete_user($user_id);
	delete_files(APPPATH.'cache/');
	$this->output->set_output($this->data);
	
}

	public function user_group_details($id)
{
	$this->data = $this->users_model->user_group_details($id);
	$this->output->set_output($this->data);
}

	public function user_group_edit()
{
	$data = json_decode(file_get_contents('php://input'));
	$data = get_object_vars($data);

	if (!array_key_exists('id', $data)) 
	{
		$data['id'] = $this->users_model->insert_user_group($data);
	}
	else
	{
		$this->users_model->update_user_group($data);
	}

	$this->data['message'] = $this->flexi_auth->error_messages();

	count($this->data['message']) === 0 ? $this->data['error'] = 0 : $this->data['error'] = 1;

	if ($this->data['error'] === 0) {
		$this->data['message'] = $this->flexi_auth->status_messages();
		$this->data['id'];
	}

	$this->cache_manager->DeletePagesCache();
	$this->cache_manager->DeleteDbCache();

	$this->output->set_output($this->data);
}

	public function user_groups_list($limit, $offset)
{
	$data = $this->users_model->user_groups_list($limit, $offset);

 	$this->output->set_output($data);
}
	
	public function user_group_delete($id)
{
	$this->flexi_auth->delete_group($id);
}

	public function day_visits()
	{
		$a = getdate();
		$dayTime = mktime(0, 0, 0, $a['mon'], $a['mday'], $a['year']);


		$visits = $this->users_model->visits($dayTime);

		$this->output->set_output($visits);

	}

	public function server_charge()
	{
		$this->load->helper('file');
		$allFiles = get_dir_file_info('./');

		function dirSize($directory) {
		    $size = 0;
		    foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory)) as $file){
		        //$size+= get_file_info($file, 'size');
		        $file_size = (get_file_info($file, 'size'));
		        $size += $file_size['size'];
		    }
		    return $size;
		} 

		$this->data['assetsSize'] = dirSize(APPPATH.'assets');
		$this->data['cacheSize'] = dirSize(APPPATH.'cache');
		$this->data['appSize'] = 70000000;//dirSize('./') - $this->data['assetsSize'] - $this->data['cacheSize'];
		$this->data['serverSize'] = 1000000000;

		$this->output->set_output($this->data);
	}

	// logs

	public function logs_list($limit = null, $offset = 0)
	{
		$this->load->helper('directory');

		$data = array();

		$file_list = directory_map(APPPATH.'logs');

		$file_list = array_reverse($file_list);

		$data['total_items'] = count($file_list) - 1;

		$data['items'] = array();

		$i = 0;

		$limit = $limit + $offset;

		while ($offset <= $limit && $file_list[$offset])
		{
			if($file_list[$offset] != 'index.html')
			{
				$data['items']['log-'.$offset] = preg_replace('/.php/', '', $file_list[$offset++]);
			}
			else
			{
				$offset++;
				$limit++;
			}
		}

		$this->output->set_output($data);	
	}

	public function log_details($name)
	{
		$this->load->helper('file');

		$data = array();

		$file_content = read_file(APPPATH.'logs/'.$name.'.php');

		$file_content = str_replace(array("\r\n","\n"), '<br/><br/>', $file_content);

		$this->output->set_output(array('content' => $file_content));
	}

	public function delete_logs()
	{
		$this->load->helper('file');

		delete_files(APPPATH.'cache/');
	}

 } 

 ?>