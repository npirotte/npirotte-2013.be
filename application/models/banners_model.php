<?php

class Banners_model extends CI_Model
{
	public function __construct()
	{
		// récupération du modèle
		$this->load->model('db_model');

		//require(APPPATH.'models/models/menuModel.php');
		$this->database = array(
			'banners_zones' => $this->db_model->database_model('banners_zones'),
			'banners_banners' => $this->db_model->database_model('banners_banners')
			);
	}

	public function admin_zones_list($limit, $offset)
	{
		$this->load->library('List_query_filters', array('table' => 'banners_zones', 'filtered_cols' => array('banners_zones.name', 'banners_zones.id')));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();

		$this->db->stop_cache();

		$count = $this->db->count_all_results('banners_zones');

		$this->db->select('id, name');
		$query = $this->db->get('banners_zones', $limit, $offset);

		$result = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		$this->db->flush_cache();

		$i = 0;

		foreach ($result['items'] as $item) {
			$this->db->where(array('parent_id' => $item['id']));

			$result['items'][$i++]['childs_count'] = $this->db->count_all_results('banners_banners');
		}

		return $result;
	}

	public function admin_BannerZoneDetails($id)
	{

		$this->db->where('id', $id);
		$query = $this->db->get('banners_zones');
		$result = $query->result_array();
		$result = $result[0];

		return $result;
	}

	public function BannerZoneByName($name)
	{
		$this->db->where('name', $name);
		$query = $this->db->get('banners_zones');
		$result = $query->result_array();
		$result = $result[0];

		return $result;
	}

	public function bannerZoneCreate($data)
	{

		$updata = array(
			'created_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['banners_zones']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('created_on', 'NOW()', FALSE);

		$this->db->insert('banners_zones', $updata);

		$this->db->select_max('id');
		$query = $this->db->get('banners_zones');

		$result = $query->result_array();
		$result = $result[0]['id'];

		return $result;
	}

	public function bannerZoneUpdate($data)
	{

		$updata = array(
			'modified_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['banners_zones']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('modified_on', 'NOW()', FALSE);

		$this->db->where('id', $data['id']);
		$this->db->update('banners_zones', $updata);
	}

	public function bannerZoneDelete($id)
	{
		$this->load->helper('directory');

		$this->db->trans_start();

		$this->db->where('id', $id);
		$this->db->delete('banners_zones');

		$this->db->where('parent_id', $id);
		$this->db->delete('banners_banners');

		$this->db->trans_complete();

		delete_dir(APPPATH.'assets/images/banners/'.$id);
	}

	public function BannerByZone($parent_id)
	{
		$lang = $this->lang->lang();

		$this->db->where('parent_id', $parent_id);

		$this->db->select(
			'img_title_'.$lang.' as img_title, 
			alt_'.$lang.' as alt,
			link_'.$lang.' as link,
			content_'.$lang.' as content,
			src, id');

		$this->db->order_by('weight', 'asc');

		$query = $this->db->get('banners_banners');

		return $query->result_array();
	}

	public function bannerCreate($data)
	{
		$data['weight'] = $this->itemGroupReordering($data, 'banners_banners');

		$updata = array(
			'created_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['banners_banners']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('created_on', 'NOW()', FALSE);

		$this->db->insert('banners_banners', $updata);

		$this->db->select_max('id');
		$query = $this->db->get('banners_banners');

		$result = $query->result_array();
		$result = $result[0]['id'];

		return $result;
	}

	public function bannerUpdate($data)
	{
		$data['weight'] = $this->itemGroupReordering($data, 'banners_banners');

		$updata = array(
			'modified_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['banners_banners']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('modified_on', 'NOW()', FALSE);

		$this->db->where('id', $data['id']);
		$this->db->update('banners_banners', $updata);
	}

	public function bannerDelete($id)
	{

		$this->db->trans_start();

			$this->db->start_cache();

				$this->db->where('id', $id);

			$this->db->stop_cache();

			$this->db->select('parent_id, src');
			$query = $this->db->get('banners_banners');
			$banner = $query->result_array();
			$banner = $banner[0];

			$this->db->delete('banners_banners');

			$this->db->flush_cache();

			$this->itemGroupReordering($banner, 'banners_banners');

		$this->db->trans_complete();

		print_r(APPPATH.'assets/images/banners/'.$banner['parent_id'].'/'.$banner['src']);
		unlink(APPPATH.'assets/images/banners/'.$banner['parent_id'].'/'.$banner['src']);
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