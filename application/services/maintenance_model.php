<?php
class Maintenance_model extends CI_Model {

	public function __construct()
	{
		$this->load->database();
		$this->db->cache_off();
	}

	public function image_is_used($table, $name)
	{	
			$sql= "SELECT src FROM $table WHERE src='$name'";
			$query = $this->db->query($sql);
			return $query->result_array();
	}

}