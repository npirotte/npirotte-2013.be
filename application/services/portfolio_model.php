<?php
class Portfolio_model extends CI_Model {

	public function __construct()
	{
		//$this->load->database();
		//$this->db->cache_on();

		// récupération du modèle
		$this->load->model('db_model');

		//require(APPPATH.'models/models/menuModel.php');
		$this->database = array(
			'portfolio_categories' => $this->db_model->database_model('portfolio_categories'),
			'portfolio_items' => $this->db_model->database_model('portfolio_items')
			);
	}


	/* front */

/*	public function porfolioByCategories($category)
	{

	}*/

	public function language_transition()
	{
		/*==========  items  ==========*/
		$query = $this->db->get('menus_items');
		$items = $query->result_array();

		foreach ($items as $item) {
			# code...
			$this->db->set('name_fr', $item['name']);
			$this->db->set('element_fr', $item['element']);

			$this->db->where('id', $item['id']);
			$this->db->update('menus_items');
		}
	}

	public function simple_categories_list()
	{

		$this->db->select('id, name_'.$this->lang->lang().' as name');
		$this->db->order_by('weight');
		$query = $this->db->get('portfolio_categories');

		return $query->result_array();
	} 

	public function simple_portfolio_list($options = false)
	{
		$lang = $this->lang->lang();

		$this->db->select('portfolio_items.name_'.$lang.' as name, portfolio_items.src, portfolio_items.icon, portfolio_items.id');

		if (isset($options['category'])) 
		{
			$this->db->where('parent_id', $options['category']);
			$this->db->order_by('weight');
		}
		else
		{
			$this->db->order_by('portfolio_items.id', 'desc');
		}
		
		$this->db->distinct('portfolio_links.child_ids');

		$this->db->join('portfolio_items', 'portfolio_items.id = portfolio_links.child_id', 'left');

		if (isset($options['limit']) && isset($options['offset']))
		{
			$query = $this->db->get('portfolio_links');
		}
		else
		{
			$query = $this->db->get('portfolio_links', $options['limit'], $options['offset']);
		}

		$result = $query->result_array();

		return $query->result_array();
	}	

	public function portfolio_list($limit, $offset, $category_id = FALSE)
	{
		$lang = $this->lang->lang();

		$this->load->library('List_query_filters', array('table' => 'portfolio_items', 'filtered_cols' => array('name_'.$lang, 'id')));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();

		$this->db->stop_cache();

		$count = $this->db->count_all_results('portfolio_items');

		$this->db->select('id, name_'.$lang.' as name, src');
		$query = $this->db->get('portfolio_items', $limit, $offset);

		$result = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		$this->db->flush_cache();

		$i = 0;

		foreach ($result['items'] as $item) {
			//$this->db->where(array('parent_id' => $item['id']));

			$result['items'][$i++]['childs_count'] = 0;//$this->db->count_all_results('portfolio_images');
		}

		return $result;
	}

	public function PorfolioDetails($id, $light = false)
	{
		$lang = $this->lang->lang();

		$this->db->where('id', $id);

		if ($light) {
			$this->db->select(
			'name_'.$lang.' as name, 
			description_'.$lang.' as description, 
			resume_'.$lang.' as resume, 
			meta_description_'.$lang.' as meta_description, 
			meta_title_'.$lang.' as meta_title,
			id'
			);
		}

		$query = $this->db->get('portfolio_items');
		$result = $query->result_array();
		$result = $result[0];

		// links

		$this->db->where('child_id', $id);
		$this->db->select('parent_id, weight');
		$query = $this->db->get('portfolio_links');
		$result['categories'] = $query->result_array();
		$result['categories_old'] = $query->result_array();

		return $result;
	}

	public function PortfolioSlug($id)
	{
		$lang = $this->lang->lang();

		$this->db
			->select('portfolio_items.name_'.$lang)
			->where('id', $id)
			->from('portfolio_items');

		$query = $this->db->get();
		$result = $query->result_array();

		return $result[0];
	}

	public function PorfolioNavigation($currentItem, $category = false)
	{
		$lang = $this->lang->lang();
		
		$result = array();
		$this->db->start_cache();
		$this->db->select('portfolio_items.id, portfolio_items.name_'.$lang.' as name, portfolio_items.resume_'.$lang.' as resume, portfolio_items.src, portfolio_items.icon');
		$this->db->stop_cache();

		if ($category) {
			$currentItemWeight = 1;
			foreach ($currentItem['categories'] as $link) {
				if ($link['parent_id'] === $category) {
					$currentItemWeight = $link['weight'];
				}
			}

			$this->db->select('portfolio_links.weight');

			$this->db->where('parent_id', $category);
			$this->db->where_in('weight', array($currentItemWeight - 1, $currentItemWeight + 1));
			$this->db->join('portfolio_items', 'portfolio_items.id = portfolio_links.child_id');
			$query = $this->db->get('portfolio_links');
			$query = $query->result_array();

			if (count($query)  === 2) {
				$result['prev'] = $query[0];
				$result['next'] = $query[1];
			}
			else
			{
				$sens = $query[0]['weight'] > $currentItemWeight ? 'next' : 'prev';
				$result[$sens] = $query[0];
			}

		}
		else
		{
			$this->db->where('id <', $currentItem['id']);
			$this->db->order_by('id', 'desc');
			$query = $this->db->get('portfolio_items', 1, 0);
			$result['next'] = $query->result_array();

			$this->db->where('id >', $currentItem['id']);
			$this->db->order_by('id', 'asc');
			$query = $this->db->get('portfolio_items', 1, 0);
			$result['prev'] = $query->result_array();

			$result['prev'] = $result['prev'][0];
			$result['next'] = $result['next'][0];
		}

		$this->db->flush_cache();

		return $result;
	}

	public function PortfolioCreate($data)
	{

		$this->db->trans_start();

		$updata = array(
			'created_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['portfolio_items']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('created_on', 'NOW()', FALSE);
		$this->db->insert('portfolio_items', $updata);

		$this->db->select_max('id');
		$query = $this->db->get('portfolio_items');

		$result = $query->result_array();
		$result = $result[0]['id'];

		// enregistrement des links

		$links = array();

		foreach ($data['categories'] as $category_id => $category_selected ) {
			if ($category_selected) {
				$links[] = $this->ItemLink($category_id, $result);
			}
		}

		if (count($links) > 0) {
			$this->db->insert_batch('portfolio_links', $links); 
		}

		$this->db->trans_complete();


		return $result;
	}

	public function PortfolioUpdate($data)
	{
		$this->db->trans_start();

		$updata = array(
			'modified_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['portfolio_items']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}


		$this->db->set('modified_on', 'NOW()', FALSE);
		$this->db->where('id', $data['id']);
		$this->db->update('portfolio_items', $updata);

		$new_links = array();
		$old_links = array();

		// on formate les old links
		foreach ($data['categories_old'] as $old_link) {
			$old_links[$old_link['parent_id']] = true;
		}

		// on ajoute

		foreach ($data['categories'] as $category_id => $category_selected ) {


			if ($category_selected == 1) 
			{
				if (!isset($old_links[$category_id])) {
					$new_links[] = $this->ItemLink($category_id, $data['id']);
				}
			}
			else if(isset($old_links[$category_id]))
			{
				$this->db->where(array('child_id' => $data['id'], 'parent_id' => $category_id));
				$this->db->delete('portfolio_links');
				$this->itemGroupReordering(array('parent_id' => $category_id), 'portfolio_links');
			}
		}

		if (count($new_links) > 0) {
			$this->db->insert_batch('portfolio_links', $new_links); 
		}

		$this->db->trans_complete();

	}

	public function PortfolioDelete($id)
	{
		$this->load->helper('directory');

		$this->db->trans_start();

		// item
		$this->db->where('id', $id);
		$this->db->delete('portfolio_items');

		// links + reordering
		$this->db->start_cache();

		$this->db->where('child_id', $id);
		$query = $this->db->get('portfolio_links');
		$links = $query->result_array();

		$this->db->stop_cache();

		$this->db->delete('portfolio_links');

		$this->db->flush_cache();

		foreach ($links as $link) {
			$this->itemGroupReordering(array('parent_id' => $link['parent_id']), 'portfolio_links');
		}

		// images

		$this->db->where('parent_id', $id);
		$this->db->delete('assets_images');

		// tags links

		$this->load->model('tags_model');
		$this->tags_model->delete_tag_links_by_parent($id, 'portfolio_categories');

		// folder

		delete_dir(APPPATH.'assets/images/portfolio/'.$id);

		$this->db->trans_complete();

	}

	private function ItemLink($parent_id, $child_id)
	{
		$data = array(
			'parent_id' => $parent_id,
			'child_id' => $child_id,
			'weight' => $this->itemGroupReordering(array('id' => $this->child_id, 'parent_id' => $parent_id), 'portfolio_links')
			);

		return $data;
	}

	public function categories_list($limit, $offset)
	{

		$this->load->library('List_query_filters', array('table' => 'portfolio_categories', 'filtered_cols' => array('name_'.$this->lang->lang(), 'id', 'weight')));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();

		$this->db->stop_cache();

		$count = $this->db->count_all_results('portfolio_categories');

		$this->db->select('id, name_'.$this->lang->lang().' as name, weight, is_hidden');
		$query = $this->db->get('portfolio_categories', $limit, $offset);

		$result = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		$this->db->flush_cache();

		/*foreach ($result['items'] as $item) {
			$this->db->where(array('parent_id' => $item['id']));

			$result['items'][$i++]['childs_count'] = $this->db->count_all_results('portfolio');
		}
*/
		return $result;
	}

	public function CategorySlug($id)
	{
		$this->db
			->select('portfolio_categories.name')
			->where('id', $id)
			->from('portfolio_categories');

		$query = $this->db->get();
		$result = $query->result_array();


		return $result[0];
	}

	public function CategoryDetails($id, $light = false)
	{
		$lang = $this->lang->lang();

		$this->db->where('id', $id);

		if ($light) {
			$this->db->select(
			'name_'.$lang.' as name, 
			meta_description_'.$lang.' as meta_description, 
			meta_title_'.$lang.' as meta_title,'
			);
		}

		$query = $this->db->get('portfolio_categories');
		$result = $query->result_array();
		$result = $result[0];

		return $result;
	}

	public function CategoryCreate($data)
	{
		$data['weight'] = $this->itemGroupReordering($data, 'portfolio_categories');

		$updata = array(
			'created_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['portfolio_categories']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('created_on', 'NOW()', FALSE);
		$this->db->insert('portfolio_categories', $updata);

		$this->db->select_max('id');
		$query = $this->db->get('portfolio_categories');

		$result = $query->result_array();
		$result = $result[0]['id'];

		return $result;
	}

	public function CategoryUpdate($data)
	{

		$data['weight'] = $this->itemGroupReordering($data, 'portfolio_categories');

		/*$updata = array(
			'name' => $data['name'],
			'meta_title' => $data['meta_title'],
			'meta_description' => $data['meta_description'],
			'weight' => $data['weight'],
			'is_hidden' => $data['is_hidden'],
 			'modified_by' => $this->flexi_auth->get_user_id()
			); */

		$updata = array(
			'modified_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['portfolio_categories']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('modified_on', 'NOW()', FALSE);

		$this->db->where('id', $data['id']);

		$this->db->update('portfolio_categories', $updata);
	}

	public function CategoryDelete($id)
	{
		$this->db->trans_start();

		// item
		$this->db->where('id', $id);
		$this->db->delete('portfolio_categories');

		// links

		$this->db->where('parent_id', $id);
		$this->db->delete('portfolio_links');

		// tags links

		$this->load->model('tags_model');
		$this->tags_model->delete_tag_links_by_parent($id, 'portfolio_categories');

		// reorder
		$data['weight'] = $this->itemGroupReordering(array(), 'portfolio_categories');

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