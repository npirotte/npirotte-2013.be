<?php
class Menus_model extends CI_Model {

	public function __construct()
	{
		//$this->db->cache_on(); 
		// récupération du modèle
		$this->load->model('db_model');

		//require(APPPATH.'models/models/menuModel.php');
		$this->database = array(
			'menus_menus' => $this->db_model->database_model('menus_menus'),
			'menus_items' => $this->db_model->database_model('menus_items')
			);
	}

	// front

	public function menuGet($menuId, $baseLink)
	{
		$result = array();
		// menu
		$this->db->select('id, cssclass');
		$this->db->where('name', $menuId);
		$query = $this->db->get('menus_menus');
		$result['menu'] = $query->result_array();
		$result['menu'] = $result['menu'][0];

		// links
		$result['links'] = $this->itemsTree($result['menu']['id'], $baseLink, true);

		return $result;
	}

	// menu

	public function menuCreate($data)
	{
		$updata = array(
			'created_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['menus_menus']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('created_on', 'NOW()', FALSE);

		$this->db->insert('menus_menus', $updata);

		$this->db->select_max('id');
		$query = $this->db->get('menus_menus');

		$result = $query->result_array();
		$result = $result[0]['id'];

		return $result;
	}

	public function menuUpdate($data)
	{
		$updata = array(
			'modified_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['menus_menus']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('modified_on', 'NOW()', FALSE);
		$this->db->where('id', $data['id']);
		$this->db->update('menus_menus', $updata);

		return true;
	}


	public function menusList($limit, $offset)
	{
		$this->load->library('List_query_filters', array('table' => 'menus_menus', 'filtered_cols' => array('menus_menus.name', 'menus_menus.id')));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();

		$this->db->stop_cache();

		$count = $this->db->count_all_results('menus_menus');

		$this->db->select('id, name');
		$query = $this->db->get('menus_menus', $limit, $offset);

		$result = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		$this->db->flush_cache();

		return $result;
	}

	public function menuDetails($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get('menus_menus');
		$result = $query->result_array();
		$result = $result[0];

		return $result;
	}

	public function menuDelete($id)
	{
		$this->db->trans_start();

		$this->db
			->where('id', $id)
			->delete('menus_menus');

		$this->db
			->where('menu_id', $id)
			->delete('menus_items');

		$this->db->trans_complete();

		return true;
	}

	// links

	public function itemCreate($data)
	{
		$data['weight'] = $this->itemGroupReordering($data, 'menus_items');

		$updata = array();

		foreach ($this->database['menus_items']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->insert('menus_items', $updata);

		$this->db->select_max('id');
		$query = $this->db->get('menus_items');

		$result = $query->result_array();
		$result = $result[0]['id'];

		return $result;
	}

	public function itemUpdate($data)
	{
		$data['weight'] = $this->itemGroupReordering($data, 'menus_items');

		$updata = array();

		foreach ($this->database['menus_items']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->where('id', $data['id']);

		$this->db->update('menus_items', $updata);

		return TRUE;
	}

	public function itemsList($parentId)
	{

		$count = $this->db->count_all_results('menus_items');

		$this->db->select('id, name');
		$query = $this->db->get('menus_items');

		$result = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		$this->db->flush_cache();

		return $result;
	}

	public function itemsTree($menuId, $baseLink = false, $allData = false)
	{
		$map_id_list = array();
		$map_elements_list = array();

		$this->db->start_cache();
			if (!$allData) {
				$this->db->select('id, name, parent_id');
			}
			$this->db->order_by('weight');
		$this->db->stop_cache();

		$total_count = $this->db->count_all('menus_items');

		// on récupère le 1er niveau
		if ($baseLink) {
			$this->db->where('id', $baseLink);
		}
		else
		{
			$this->db->where('parent_id', 0);	
		}
		
		$this->db->where('menu_id', $menuId);

		$query = $this->db->get('menus_items');
		$map_elements_list[] = $query->result_array();
		$result_count = count($map_elements_list[0]);

		$j = 0;
		while ($j < $result_count) {
			$map_elements_list[0][$j++]['nodes'] = array();
		}

		$total_count = $total_count - $result_count;

		// on erécupère les enfants
		$i = 0;
		$run = true;

		while($total_count > 0 && $run)
		{
			$map_id_list = array();

			foreach ($map_elements_list[$i++] as $node) {
				$map_id_list[] = $node['id'];
			}

			$this->db->where_in('parent_id', $map_id_list);
			$this->db->where('menu_id', $menuId);

			$query = $this->db->get('menus_items');

			$this_element = $query->result_array();

			$count = count($this_element);

			$j = 0;
			while ($j < $count) {
				$this_element[$j++]['nodes'] = array();
			}

			$map_elements_list[$i] = $this_element;

			$total_count = $total_count - $count;

			$run = $count > 0 ? TRUE : FALSE;
		}

		$this->db->flush_cache();

		// on construit l'arbre
		while ($i >= 0) {
			foreach ($map_elements_list[$i--] as $node) {
				$parent_id = $node['parent_id'];

				$j = 0;
				foreach ($map_elements_list[$i] as $parent_node) {
					if ($parent_node['id'] === $parent_id) {
						$map_elements_list[$i][$j]['nodes'][] = $node;
					}
					$j++;
				}
			}			
		}

		return $map_elements_list[0];

	}

	public function itemDetails($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get('menus_items');
		$result = $query->result_array();
		$result = $result[0];

		return $result;
	}

	public function itemDelete($id)
	{
		$this->db->trans_start();

		// récupération des infos pour réordering
		$this->db->select('parent_id, menu_id');
		$this->db->where('id', $id);

		$query = $this->db->get('menus_items');
		$item = $query->result_array();
		$item = $item[0];

		// delete des enfants
		$this->db
			->where(array('parent_id'=>$id, 'menu_id' => $item['menu_id']))
			->or_where('id', $id)
			->delete('menus_items');

		// reordering
		$this->itemGroupReordering(array('menu_id' => $item['menu_id'], 'parent_id' => $item['parent_id']), 'menus_items');

		$this->db->trans_complete();
	}

	// private function 

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

		if (isset($data['menu_id'])) {
			$this->db->where('menu_id', $data['menu_id']);
		}

		if (isset($data['parent_identity'])) {
			$this->db->where('parent_identity', $data['parent_identity']);
		}
	
		$this->db->order_by('weight');
		$query = $this->db->get($table);

		$items = $query->result_array();


		$order_max = count($items) + 1;

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
				if ($items[$i]['weight'] != $j) {
					$this->db->set('weight', $j);
					$this->db->where('id', $items[$i]['id']);
					$this->db->update($table);
				}
				$i++;
			}

			$j++;
		}

	 	return $data['weight'];
	}
}