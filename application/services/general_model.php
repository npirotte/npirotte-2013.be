<?php
class General_model extends CI_Model {

	public function __construct()
	{
		$this->load->database();
	}

	//admin

	public function get_all($table)
	{		
			$query = $this->db->get($table);
			return $query->result_array();
	}

	public function get_item($table, $clause, $value)
	{
			$query = $this->db->get_where($table, array($clause => $value));
			return $query->result_array();
	}

	public function delete_item($table, $id)
	{
		$this->db->delete($table , array('id' => $id)); 
		return TRUE;
	}


	// public function update_item($table, $id, $param, $value)
	// {
	// 	$this->db->where('id', $id);
	// 	$this->db->update($table, array($param => $value));
	// }

	public function update_item($table, $data)
	{
		$this->db->where('id', $data['id']);
		$this->db->update($table, $data);
	}

	public function create_item($table)
	{
		$data = array(
			'id' => ''
			);

		$this->db->insert($table, $data);

		$this->db->select_max('id');

		$query = $this->db->get($table);

		return $query->result();
	}

	public function insert_item($table, $item)
	{
		$this->db->insert($table, $item);
	}

	// cas spéciaux

	public function ordered_items($table)
	{

			$this->db->order_by('weight', 'asc');
			$query = $this->db->get($table);
			return $query->result_array();
	}

	public function category_items($table, $categoryId)
	{

			$where = 'FIND_IN_SET('.$categoryId.', category) > 0';

			$this->db->where($where);
			$this->db->order_by('weight');
			$query = $this->db->get($table);

			return $query->result_array();
	}

	public function get_sub_item($table, $parent_id)
	{

			$this->db->where('parent_id', $parent_id);
			$this->db->order_by('weight', 'asc');
			$query = $this->db->get($table);

			return $query->result_array();
	}

	public function get_prev($table, $id)
	{

		$this->db->select('id, db_title_default');
		$this->db->where('id >', $id);
		$this->db->order_by('id', 'asc');
		$query = $this->db->get($table, 1);

		return $query->result_array();
	}

	public function get_next($table, $id)
	{

		$this->db->select('id, db_title_default');
		$this->db->where('id <', $id);
		$this->db->order_by('id', 'desc');
		$query = $this->db->get($table, 1);

		return $query->result_array();
	}

	public function element_exist($table, $key, $value)
	{

		$this->db->select($key);
		$this->db->where($key, $value);
		$query = $this->db->get($table);
		return $query->result_array();
	}



}