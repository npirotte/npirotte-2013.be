<?php
class News_model extends CI_Model {

	public function __construct()
	{
		//$this->db->cache_on(); 

		// récupération du modèle
		$this->load->model('db_model');

		//require(APPPATH.'models/models/menuModel.php');
		$this->database = array(
			'news_categories' => $this->db_model->database_model('news_categories'),
			'news_items' => $this->db_model->database_model('news_items')
			);
	}

	private function reorder($prop, $sens)
	{
		$this->db->order_by($prop, $sens == 'true' ? 'asc' : 'desc');
	}

	private function filter($query, $cols)
	{
		$i = 0;

		foreach ($cols as $key => $value) {
			if ($i++ === 0) {
				$this->db->like($value, $query);
			}
			else
			{
				$this->db->or_like($value, $query);
			}
			
		}
		
	}

	public function CategorySlugs()
	{
		$lang = $this->lang->lang();

		$this->db->select('id, slug_'.$lang.' as slug');
		$query = $this->db->get('news_categories');

		$categories  = $query->result_array();

		$result = array();

		foreach ($categories as $categorie) {
			$result[$categorie['id']] = $categorie['slug'];
		}

		return $result;
	}

	public function admin_categories_list($limit, $offset)
	{
		$lang = $this->lang->lang();

		$this->load->library('List_query_filters', array('table' => 'news_categories', 'filtered_cols' => array('name_'.$lang, 'slug', 'id')));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();

		$this->db->stop_cache();

		$count = $this->db->count_all_results('news_categories');

		$this->db->select('id, name_'.$lang.' as name, is_hidden');

		$query = $this->db->get('news_categories', $limit, $offset);

		$result = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		$this->db->flush_cache();

		$i = 0;

		foreach ($result['items'] as $item) {
			$this->db->where(array('parent_id' => $item['id']));

			$result['items'][$i++]['childs_count'] = $this->db->count_all_results('news_items');
		}

		return $result;
	}

	public function admin_category_details($id)
	{

		//$this->db->select('news_categories.id, news_categories.name, news_categories.created_on, news_categories.slug, news_categories.modified_on, news_categories.modified_by, news_categories.thumb_w, news_categories.thumb_h, news_categories.created_by');
		
		$this->db->where(array('id' => $id));
		$query = $this->db->get('news_categories');

		$result = $query->result_array();
		$result = $result[0];

		return $result;
	}

	public function category_create($data)
	{
		$lang = $this->lang->lang();

		$updata = array(
			'created_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['news_categories']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('created_on', 'NOW()', FALSE);

		$this->db->insert('news_categories', $updata);

		$this->db->select_max('id');
		$query = $this->db->get('news_categories');

		$result = $query->result_array();
		$result = $result[0]['id'];

		return $result;
	}

	public function category_update($data)
	{
		$lang = $this->lang->lang();

		$updata = array(
			'modified_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['news_categories']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('modified_on', 'NOW()', FALSE);

		$this->db->where('id', $data['id']);
		$this->db->update('news_categories', $updata);
	}

	public function category_delete($id)
	{
		$this->db->trans_start();

		$this->db->delete('news_categories' , array('id' => $id));

		$this->db->delete('news_items' , array('parent_id' => $id));

		$this->db->trans_complete();
	}

	// news

	public function delete_news($id)
	{
		$this->db->delete('news_items' , array('id' => $id));
	}

	public function admin_news_list($limit, $offset, $parent_id = FALSE)
	{
		$this->load->library(
			'List_query_filters', 
			array(
				'table' => 'news_items', 
				'filtered_cols' => array('news_items.title', 'news_items.content', 'news_items.id', 'news_categories.name'),
				'transform' => array('news_items.category_name' => 'news_items.parent_id')
				));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();

			$this->db->join('news_categories', 'news_categories.id = news_items.parent_id', 'left');

			if ($parent_id) 
			{
				$this->db->where(array('parent_id' => $parent_id));
			}

		$this->db->stop_cache();

		// on compte
		$count = $this->db->count_all_results('news_items');

		$this->db->select('news_items.id, news_items.title, news_items.archived_on, news_items.published_on, news_items.created_by');
		
		$this->db->select('news_categories.name as category_name');
		

		//	$this->db->order_by('news_items.created_on', 'desc');
		
		$query = $this->db->get('news_items', $limit, $offset);

		$result = array(
			'items' => $query->result_array(),
			'today' => date('Y-m-d'),
			'total_items' => $count
			);

		$this->db->flush_cache();

		return $result;
	}

	public function admin_news_details($id)
	{
		$this->db->select('*');
		$this->db->where('id', $id);
		$query = $this->db->get('news_items');

		$result = $query->result_array();
		$data = array();

		// on trie les résultats
		foreach ($result[0] as $key => $value) {
			if ($key == 'first_name' || $key == 'last_name')
			{
				$data['person_info'][$key] = $value;
			}
			else 
			{
				$data['content_items'][$key] = $value;
			}
		}

		// on formate la date
		$date = date_create($data['content_items']['created_on']);
		$data['content_items']['created_on_formated'] = date_format($date, 'd-m-Y \à H:i:s');
		$data['today'] = date('Y-m-d');

		return $data;
	}

	public function item_create($data)
	{
		$updata = array(
			'created_by' => $this->flexi_auth->get_user_id()
			);

		foreach ($this->database['news_items']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		if (!$data['published_on']) 
		{
			$this->db->set('published_on', 'NOW()', FALSE);
		}

		$this->db->set('created_on', 'NOW()', FALSE);
		$this->db->insert('news_items', $updata);

		$this->db->select_max('id');
		$query = $this->db->get('news_items');

		$result = $query->result_array();
		$result = $result[0]['id'];

		return $result;
	}

	public function news_update($data)
	{
		$updata = array(
			'modified_by' => $this->flexi_auth->get_user_id()
		);

		foreach ($this->database['news_items']['fields'] as $field => $fieldConfig) {
			if ($fieldConfig['set'] && isset($data[$field])) {
				$updata[$field] = $data[$field];
			}
		}

		$this->db->set('modified_on', 'NOW()', FALSE);


		$this->db->where('id', $data['id']);
		$this->db->update('news_items', $updata);
	}

	// front

	public function news_list($category = false, $limit, $offset, $person = true)
	{
		$lang = $this->lang->lang();
		$data = array();

		// récupération de la catégorie
		if ($category) 
		{
			$this->db->select('name_'.$lang.' as name, id');
			$this->db->where('slug_'.$lang, $category);
			$query = $this->db->get('news_categories');

			$data['category'] = $query->result_array();	
			$data['category'] = $data['category'][0];
			$data['category']['slug'] = $category;
		}
		else
		{
			$data['category'] = false;
		}

		// récupération de la list de news

		$today = date("Y-m-d");

		$this->db->select('
			news_items.id, 
			news_items.title, 
			news_items.resume, 
			news_items.icon, 
			news_items.published_on,
			news_items.src'
			);

		if ($person) {
			$this->db->select('
			user_profiles.user_account_id, 
			user_profiles.first_name, 
			user_profiles.last_name, 
			user_profiles.src as user_thumb'
			);
			$this->db->join('user_profiles', 'user_profiles.user_account_id = news_items.created_by', 'left');
		}
		

		//$this->db->where('archived_on >', $today);
		//$this->db->or_where('archived_on', 'NULL');
		$this->db->where('published_on <=', $today);
		$this->db->where('lang', $this->lang->lang());
		if ($category) 
		{
			$this->db->where('parent_id', $data['category']['id']);
		}

		$this->db->order_by('published_on', 'desc');
		$query = $this->db->get('news_items', $limit, $offset);

		$data['news_list'] = $query->result_array();

		return $data;

	}

	public function news_details($id)
	{

		$this->db->cache_on();

		$data = array();

		// récupération de la news
		$this->db->select('news_items.title, news_items.resume, news_items.content, news_items.icon, news_items.published_on, news_items.src, news_items.parent_id, news_items.created_by');
		// récupération du user
		$this->db->select('user_profiles.first_name as user_first_name, user_profiles.last_name as user_last_name, user_profiles.src as user_src');
		// récurépation de la catégorie
		$this->db->select('news_categories.name as categoty_name, news_categories.slug as category_slug');
		// joitures
		$this->db->join('user_profiles', 'user_profiles.user_account_id = news_items.created_by', 'left');
		$this->db->join('news_categories', 'news_categories.id = news_items.parent_id', 'left');
		// condition
		$this->db->where('news_items.id', $id);

		$query = $this->db->get('news_items');

		$data = $query->result_array();

		return $data[0];
	}

	public function news_slug($id)
	{
		$this->db
			->select('news_items.title')
			->where('id', $id)
			->from('news_items');

		$query = $this->db->get();
		$result = $query-> result_array();
		$result = $result[0];

		return $result;
	}

	public function NewsNavigation($currentItem, $category = false)
	{
		$data = array();
		$today = date("Y-m-d");

		$this->db->start_cache();

		$this->db->select('id, title, src, resume');
		$this->db->where('archived_on >', $today);
		$this->db->where('published_on <=', $today);
		$this->db->where('parent_id', $category);
		//$this->db->order_by('published_on', 'desc');
		

		$this->db->stop_cache();

		$result = array();

		// prev
		$this->db->where('published_on <', $currentItem['published_on']);
		$this->db->order_by('published_on', 'desc');
		$query = $this->db->get('news_items', 1, 0);
		$query = $query->result_array();
		$result['prev'] = $query[0];

		// next
		$this->db->where('published_on >', $currentItem['published_on']);
		$this->db->order_by('published_on', 'asc');
		$query = $this->db->get('news_items', 1, 0);
		$query = $query->result_array();
		$result['prev'] = $query[0];


		$this->db->flush_cache();

		return $result;

	}

	public function get_last_items($parent_id, $nbr)
	{	
		$this->db->select('id, title, resume', 'created_on');
		$this->db->where('parent_id', $parent_id);
		$this->db->where('archived_on >', 'CURDATE()');
		$this->db->where('published_on <=', 'CURDATE()');
		$query = $this->db->get('news_items', $nbr);

		return $query->result_array();

	}

	public function get_nav($id, $categoryId, $direction)
	{
		$this->db->select('id, title');
		$this->db->from('news_items');
		$this->db->where('is_online', 1);
		if ($direction == 'prev') {
			$this->db->where('id >', $id);
			$this->db->order_by('id', 'asc');
		}
		else
		{
			$this->db->where('id <', $id);
			$this->db->order_by('id', 'desc');
		}
		$this->db->where('parent_id', $categoryId);
		$this->db->limit(1);
		$query = $this->db->get();
		return $query->result_array();
	}

	public function get_news_list($parent_id, $is_online)
	{

			$this->db->where('parent_id', $parent_id);
			$this->db->where('archived_on >', 'CURDATE()');
			$this->db->where('published_on <=', 'CURDATE()');
			$query = $this->db->get('news_items');
			return $query->result_array();
	}
}