<?php

class Assets_model extends CI_Model
{
	public function __construct()
	{
		//$this->db->cache_on();
		// récupération du modèle
		$this->load->model('db_model');

		//require(APPPATH.'models/models/menuModel.php');
		$this->database = array(
			'assets_images' => $this->db_model->database_model('assets_images'),
			);
	}

	public function AssetsByParent($parent_id, $parent_identity)
	{
		$lang = $this->lang->lang();
		$this->db->select('id, src, title_'.$lang.' as title, alt_'.$lang.' as alt, weight');

		$this->db->where(array('parent_id' => $parent_id, 'parent_identity' => $parent_identity));

		$this->db->order_by('weight');

		$query = $this->db->get('assets_images');	
		$result = $query->result_array();

		// test de changements

		return $result;
	}

	public function AssetDetails($id)
	{
		$this->db->where('id', $id);
		$this->db->get('assets_images');
	}

	public function  CreateAsset($data)
	{
		$this->db->trans_start();

		$data['weight'] = $this->itemGroupReordering($data, 'assets_images');

		$updata = array(
			'created_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['assets_images']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('created_on', 'NOW()', FALSE);

		$this->db->insert('assets_images', $updata);

		$this->db->select_max('id');
		$query = $this->db->get('assets_images');

		$result = $query->result_array();
		$result = $result[0]['id'];

		$this->db->trans_complete();

		return $result;
	}

	public function EditAsset($data)
	{
		$this->db->trans_start();

		$data['weight'] = $this->itemGroupReordering($data, 'assets_images');

		$updata = array(
			'modified_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['assets_images']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}	

		$this->db->set('modified_on', 'NOW()', FALSE);

		$this->db->where('id', $data['id']);
		$this->db->update('assets_images', $updata);

		$this->db->trans_complete();
	}

	public function DeleteAsset($id)
	{
		$this->db->trans_start();

		$this->db->start_cache();
		$this->db->where('id', $id);
		$this->db->stop_cache();

		$this->db->select('parent_identity, parent_id');
		$query = $this->db->get('assets_images');
		$query = $query->result_array();
		$data = $query[0];

		$this->db->delete('assets_images');

		$this->db->flush_cache();

		$this->itemGroupReordering($data, 'assets_images');

		$this->db->trans_complete();
	}

	private function itemGroupReordering($data, $table)
	{
		// reorder a page group except the current page

		$this->db->select('id, weight');
		//$this->db->where('parent_id', $data['parent_id']);

		if (isset($data['id'])) 
		{
			$this->db->where('id !=', $data['id']);
		}

		if (isset($data['parent_id'])) {
			$this->db->where('parent_id', $data['parent_id']);
		}

		if (isset($data['parent_identity'])) {
			$this->db->where('parent_identity', $data['parent_identity']);
		}
	
		$this->db->order_by('weight');
		$query = $this->db->get($table);

		$pages = $query->result_array();


		$order_max = count($pages) + 1;

		if (!isset($data['weight']) || $data['weight'] > $order_max) {
			$data['weight'] = $order_max;
		}

		$i = 0;
		$j = 1;

		while($j <= $order_max)
		{
			if ($data['weight'] == $j) {
				# code...
			}
			else
			{
				if ($pages[$i]['weight'] != $j) {
					$this->db->set('weight', $j);
					$this->db->where('id', $pages[$i]['id']);
					$this->db->update($table);
				}
				$i++;
			}

			$j++;
		}

	 	return $data['weight'];
	}

}