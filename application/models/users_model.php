<?php
class Users_model extends CI_Model {

	public function __construct()
	{
		$this->load->database();
		$this->db->cache_on();
		$this->load->model('db_model');
	}

	public function RememberUserId($clientIp, $userId)
	{
		$this->db->cache_off();

		$this->db->where(array('ip_address' => $clientIp, 'user_id' => $userId));
		$results = $this->db->count_all_results('user_ips');

		if ($results === 0) {
			$data = array(
				'user_id' => $userId,
				'ip_address' => $clientIp
				);
			$this->db->insert('user_ips', $data);

			$this->db->cache_delete('admin', 'index');
		}
	}

	public function UsersByIp($clientIp)
	{
		$this->db->where('user_ips.ip_address', $clientIp);

		$this->db->select('user_ips.user_id, user_profiles.first_name, user_profiles.last_name, user_profiles.src, user_accounts.username');
		$this->db->join('user_profiles', 'user_profiles.user_account_id = user_ips.user_id', 'left');
		$this->db->join('user_accounts', 'user_accounts.user_id = user_ips.user_id', 'left');

		$query = $this->db->get('user_ips', 3, 0);

		$results = $query->result_array();
		return $results;
	}

	public function admin_users_list()
	{
		$this->load->library(
			'List_query_filters', 
			array(
				'table' => 'user_accounts', 
				'filtered_cols' => array('user_accounts.username', 'user_accounts.user_id', 'user_accounts.email'),
				'transform' => array('user_accounts.id' => 'user_accounts.user_id')
				));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();

		$this->db->stop_cache();

		$count = $this->db->count_all_results('user_accounts');

		$this->db->select('user_accounts.user_id as id, user_accounts.email, user_accounts.username, user_accounts.active, user_accounts.suspend, user_profiles.src');
		$this->db->join('user_profiles', 'user_profiles.user_account_id = user_accounts.user_id', 'left');
		$query = $this->db->get('user_accounts');

		$data = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		$this->db->flush_cache();

		return $data;
	}

	public function admin_user_details($id)
	{
		$database_config = $this->db_model->database_model('user_profiles');
		$custom_data = $database_config['fields'];

		$profile_fields = '';
		$i = 0;

		foreach ($custom_data as $item => $config)
		{
			if($item != 'user_account_id')// exeptions
			{
				$profile_fields .= ', user_profiles.'.$item;
			}
		}

		$this->db->select('user_accounts.user_id, user_accounts.email, user_accounts.username, user_accounts.active, user_accounts.group_fk,'.$profile_fields);
		$this->db->join('user_profiles', 'user_profiles.user_account_id = user_accounts.user_id', 'left');
		$this->db->where('user_id', $id);
		$query = $this->db->get('user_accounts');
		$return = $query->result_array();

		return $return;
	}

	public function insert_user($user)
	{

		$database_config = $this->db_model->database_model('user_profiles');
		$custom_data = $database_config['fields'];

		$user_data = array(
			'username' => $user['username'],
			'email' => $user['email'],
			'custom_data' => array(),
			'group_id' => 1,
			'activate' => FALSE,
			'password' => $user['pwd1']	
		);

		foreach ($custom_data as $item => $config) {
			if (array_key_exists($item, $user))
			{
				$user_data['profile_data'][$item] = $user[$item];
			}
		}

		$id = $this->flexi_auth->insert_user(
			$user_data['email'], 
			$user_data['username'], 
			$user_data['password'], 
			array(),
			$user_data['group_id'], 
			$user_data['activate']
		);

		if ($id) {
			$user_data['profile_data']['user_account_id'] = $id;
			$this->general_model->insert_item('user_profiles', $user_data['profile_data']);
		}

		return $id;
	}

	public function update_user($user_id, $user)
	{

		$database_config = $this->db_model->database_model('user_profiles');
		$custom_data = $database_config['fields'];
		$user_data = array(
			'account_data' => array(
				'username' => $user['username'],
				'email' => $user['email'],
				'group_fk' => $user['group_fk']
				),
			'profile_data' => array()
			);

		if (isset($user['pwd1'])) {
			if ($user['pwd1'] != '') {
				$user_data['account_data']['password'] = $user['pwd1'];
			}
		}

		foreach ($custom_data as $item => $config) {
			if (array_key_exists($item, $user))
			{
				$user_data['profile_data'][$item] = $user[$item];
			}
		}

		// update du compte
		$this->flexi_auth->update_user($user_id, $user_data['account_data']);

		// update du profil
		$this->db->where('user_account_id', $user_id);
		$this->db->update('user_profiles', $user_data['profile_data']);
	}

	public function delete_user($user_id)
	{
		$this->load->helper('directory');

		// vérification que ce n'est pas le dernier utilisateur

		$this->db->join('user_groups', 'user_accounts.group_fk = user_groups.ugrp_id AND ugrp_admin = 1');
		$accounts_nbr = $this->db->count_all_results('user_accounts');


		if ($accounts_nbr > 1)
		{
			//Start SQL transaction.
			$this->db->trans_start();

			$this->db->delete('user_accounts', array('user_id' => $user_id));
			$this->db->delete('user_profiles', array('user_account_id' => $user_id));

			// Complete SQL transaction.
			$this->db->trans_complete();

			delete_dir(APPPATH.'assets/images/users/'.$user_id);

			return 'Utilisateur supprimé';
		}
		else
		{
			return 'Cet utilisateur est le seul administrateur du site !';
		}
	}

	public function user_infos($id)
	{
	 	$this->db->select('last_name, first_name');
	 	$this->db->where('user_account_id', $id);
	 	$query = $this->db->get('user_profiles');

	 	$data = $query->result_array();

	 	return $data[0];
	}

	// user groups

	public function user_groups_list($limit, $offset)
	{
		$this->load->library(
			'List_query_filters', 
			array(
				'table' => 'user_groups', 
				'filtered_cols' => array('user_groups.ugrp_name', 'user_groups.ugrp_admin'),
				'transform' => array('user_groups.id' => 'user_groups.ugrp_id')
				));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();

		$this->db->stop_cache();

		$count = $this->db->count_all_results('user_groups');

		$this->db->select('ugrp_id as id, ugrp_name, ugrp_admin');
		$query = $this->db->get('user_groups', $limit, $offset);

		$result = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		return $result;
	}

	public function user_group_details($id)
	{
		$this->db->where('ugrp_id', $id);
		$query = $this->db->get('user_groups');
		$result = $query->result_array();
		$result = $result[0];
		$result['id'] = $result['ugrp_id'];

		$result['ugrp_admin'] = $result['ugrp_admin'] == 1;

		return $result;
	}

	public function insert_user_group($data)
	{
		$id = $this->flexi_auth->insert_group($data['ugrp_name'], $data['ugrp_description'], $data['ugrp_admin']);
		return $id;
	}

	public function update_user_group($data)
	{
		$this->flexi_auth->update_group($data['id'], array('ugrp_name' => $data['ugrp_name'], 'ugrp_desc' => $data['ugrp_desc'], 'ugrp_admin' => $data['ugrp_admin']));
	}

	public function visits($time)
	{
		$this->db->select('id');
		$this->db->distinct();
		$this->db->where('time >=', $time);
		$this->db->from('global_log');
		
		return $this->db->count_all_results();
	}

}