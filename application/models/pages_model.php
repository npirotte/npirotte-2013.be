<?php
class Pages_model extends CI_Model {

	public function __construct()
	{
		$this->load->database();
	}

	public function site_map($lang = 'fr')
	{
		$map_id_list = array();
		$map_elements_list = array();

		$this->db->start_cache();
			$this->db
				//->where('lang', $lang)
				->select('id, name, parent_id')
				->order_by('weight');
		$this->db->stop_cache();

		$total_count = $this->db->where('lang', $lang)->count_all_results	('pages');

		if ($total_count === 0)
		{
			return false;
		}

		// on récupère le 1er niveau
		$this->db->where(array('parent_id' => 0, 'lang' => $lang));

		$query = $this->db->get('pages');
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

			$query = $this->db->get('pages');

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

	public function pages_list($limit = false, $offset = 0, $lang = false)
	{
		$this->load->library('List_query_filters', array('table' => 'pages', 'filtered_cols' => array('pages.name', 'pages.lang', 'pages.id')));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();

			if ($lang) {
				$this->db->where('lang', $lang);
			}

		$this->db->stop_cache();

		$count = $this->db->count_all_results('pages');

		$this->db->select('id, name, lang, slug, version, parent_id');
		$query = $this->db->get('pages', $limit ? $limit : $count, $offset);

		$result = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		return $result;
	}

	public function PagesSlugList()
	{
		$this->db->select('id, slug');
		$query = $this->db->get('pages');

		$pages  = $query->result_array();

		$result = array();

		foreach ($pages as $page) {
			$result[$page['id']] = $page['slug'];
		}

		return $result;
	}


	public function get_page_by_slug($slug, $lang)
	{
		$this->db->cache_on();

		$this->db->select('id, name, meta_description, meta_title, type, template, version, user_groups');
		$this->db->where(array('slug' => $slug, 'lang' => $lang));
		$query = $this->db->get('pages');
		$result = $query->result_array();

		return $result[0];
		/*$query = $this->db->get_where('pages', array('name' => $page, 'lang' => $lang));

		return $query->result_array();*/
	}

	public function get_sub_content($parent_name)
	{
		$sql= "SELECT * FROM nyp_pages_content WHERE parent_id = '$parent_name' ORDER BY id";
		$query = $this->db->query($sql);
		return $query->result_array();
	}

	public function pages_details($id)
	{
		$result = array();

		$this->db->where('id', $id);
		$query = $this->db->get('pages');

		$result['page_data'] = $query->result_array();
		$result['page_data'] = $result['page_data'][0];

		if ($result['page_data']['type'] === 'template') 
		{
			$result['template_values'] = $this->pages_model->template_values_list($id, $result['page_data']['version']);
		}

		// trick pour stocker les valeurs weight et parent pour le réordering
		$result['page_data']['cache'] = array();
		$result['page_data']['cache']['weight'] = $result['page_data']['weight'];
		$result['page_data']['cache']['parent_id'] = $result['page_data']['parent_id'];

		return $result;
	}

	public function pages_create($data)
	{
		$this->db->trans_start();

		if (!isset($data['parent_id'])) {
			$data['parent_id'] = 0;
		}

		$data['weight'] = $this->pageGroupReordering($data);
		
		// sélecton de l'order max
/*		$this->db->where('lang', $data['lang']);
		$this->db->where('parent_id', $data['parent_id']);
		$order = $this->db->count_all_results('pages');
		$order++;*/

		$updata = array(
			'name' => $data['name'],
			'slug' => $data['slug'],
			'lang' => $data['lang'],
			'type' => $data['type'],
			'template' => $data['template'],
			'meta_title' => $data['meta_title'],
			'meta_description' => $data['meta_description'],
			'parent_id' => $data['parent_id'],
			'weight' => $data['weight'],
			'version' => $_POST['version'],
			'user_groups' => $_POST['user_groups'],
 			'created_by' => $this->flexi_auth->get_user_id()
			);

		$this->db->set('created_on', 'NOW()', FALSE);
		$this->db->insert('pages', $updata);

		$this->db->trans_complete();

		$this->db->select_max('id');
		$query = $this->db->get('pages');

		$result = $query->result_array();
		$result = $result[0]['id'];

		return $result;
	}

	public function pages_update($data)
	{
		$this->db->trans_start();

		if($data['cache']['weight'] != $data['weight'] || $data['cache']['parent_id'] != $data['parent_id'])
		{
			$data['weight'] = $this->pageGroupReordering($data);

			if ($data['cache']['parent_id'] != $data['parent_id']) 
			{
				$this->pageGroupReordering(array('lang' => $data['lang'], 'parent_id' => $data['cache']['parent_id']));	
			}
		}

		$updata = array(
			'name' => $data['name'],
			'slug' => $data['slug'],
			'lang' => $data['lang'],
			'type' => $data['type'],
			'template' => $data['template'],
			'meta_title' => $data['meta_title'],
			'meta_description' => $data['meta_description'],
			'parent_id' => $data['parent_id'],
			'weight' => $data['weight'],
			'version' => $_POST['version'],
			'user_groups' => $_POST['user_groups'],
 			'modified_by' => $this->flexi_auth->get_user_id()
			);

		//print_r($updata['weight']);

		$this->db->set('modified_on', 'NOW()', FALSE);

		$this->db->where('id', $data['id']);
		$this->db->update('pages', $updata);

		$this->db->trans_complete();
	}

	public function pagesDelete($id)
	{
		$this->db->trans_start();

		// récupération des infos pour réordering
		$this->db->select('parent_id, lang');
		$this->db->where('id', $id);

		$query = $this->db->get('pages');
		$page = $query->result_array();
		$page = $page[0];

		// update enfants
		$this->db->where('parent_id', $id);
		$this->db->set('parent_id', $page['parent_id']);
		$this->db->update('pages');

		// reordering
		$this->pageGroupReordering(array('lang' => $page['lang'], 'parent_id' => $page['parent_id']));

		// suppression tags link
		$this->load->model('tags_model');
		$this->tags_model->delete_tag_links_by_parent($id, 'pages_page');

		// suppression des contenus template
		$this->db->where('parent_id', $id);
		$this->db->delete('pages_templates_values');

		// supression de la page
		$this->db->where('id', $id);
		$this->db->delete('pages');

		$this->db->trans_complete();

	}

	public function simpleReorder($data)
	{
		$data['weight'] = $data['new_index'] + 1;

		$data['weight'] = $this->pageGroupReordering(array('id' => $data['item_id'], 'lang' => $data['lang'], 'parent_id' => $data['parent_id'], 'weight' => $data['weight']));

		if ($data['parent_id'] != $data['old_parent_id']) {
			$this->pageGroupReordering(array('lang' => $data['lang'], 'parent_id' => $data['old_parent_id']));	
		}

		$updata = array(
			'weight' => $data['weight'],
			'parent_id' => $data['parent_id']
			);

		$this->db->where('id', $data['item_id']);
		$this->db->update('pages', $updata);
	}

	public function getPageOrder($id)
	{
		$this->db->select('parent_id, weight');
		$this->db->where('id', $id);
		$query = $this->db->get('pages');
		$result = $query->result_array();
		$result = $result[0];

		return $result;
	}

	private function pageGroupReordering($data)
	{
		// reorder a page group except the current page

		$this->db->select('id, weight');
		$this->db->where('lang', $data['lang']);
		$this->db->where('parent_id', $data['parent_id']);

		if (isset($data['id'])) 
		{
			$this->db->where('id !=', $data['id']);
		}
	
		$this->db->order_by('weight');
		$query = $this->db->get('pages');

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
					$this->db->update('pages');
				}
				$i++;
			}

			$j++;
		}

	 	return $data['weight'];
	}

	// templates

	public function get_template($id)
	{
		$this->db->select('content, type');
		$this->db->where('id', $id);
		$query = $this->db->get('pages_templates');
		$result = $query->result_array();

		if ($result[0]['type'] === 'file') {
			$result[0]['content'] = $this->load->view('pages/'.$result[0]['content'], array(), true);
		}

		return $result[0];
	}

	public function templates_list($limit, $offset)
	{
		$this->load->library('List_query_filters', array('table' => 'pages_templates', 'filtered_cols' => array('pages_templates.name', 'pages_templates.id')));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();
			$this->db->select('id, name');

		$this->db->stop_cache();

		$count = $this->db->count_all_results('pages_templates');
		$query = $this->db->get('pages_templates', $limit, $offset);

		$result = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		return $result;
	}

	public function templates_details($id)
	{
		//$this->db->select('pages_templates.id, pages_templates.name, pages_templates.content, pages_templates.crea');
		
		$this->db->where(array('id' => $id));
		$query = $this->db->get('pages_templates');

		$result = $query->result_array();
		$result = $result[0];

		return $result;
	}

	public function template_create($data)
	{
		$data['created_by'] = $this->flexi_auth->get_user_id();

		$this->db->set('created_on', 'NOW()', FALSE);
		$this->db->insert('pages_templates', $data);

		$this->db->select_max('id');
		$query = $this->db->get('pages_templates');

		$result = $query->result_array();
		$result = $result[0]['id'];

		return $result;
	}

	public function template_edit($data)
	{
		$updata = array(
			'name' => $data['name'],
			'content' => $data['content'],
			'type' => $data['type'],
			'modified_by' => $this->flexi_auth->get_user_id()
			);

			$this->db->set('modified_on', 'NOW()', FALSE);

		$this->db->where('id', $data['id']);
		$this->db->update('pages_templates', $updata);
	}

	public function templates_delete($id)
	{
		$this->db->trans_start();

		$this->db->delete('pages_templates' , array('id' => $id));

		$this->db->delete('pages_templates_fields' , array('parent_id' => $id));

		$this->db->trans_complete();
	}

	// template fields

	public function templates_fields_list($parent_id)
	{
		$this->db->select('id, full_name, name, type, is_required, max_length');
		$this->db->where('parent_id', $parent_id);
		$this->db->order_by('weight');
		$query = $this->db->get('pages_templates_fields');



		return $query->result_array();
	}

	public function template_values_list($parent_id, $page_version)
	{
		$this->db->select('field_name, value');
		$this->db->where(array('parent_id' => $parent_id, 'page_version' => $page_version));
		$query = $this->db->get('pages_templates_values');

		$result = $query->result_array();
		$i = 0;
		$pattern= '/(@)(template)(\{)([^\(\}]*)([\(]{0,1})([^\)\}]*)([\)]{0,1})(\})/';

		foreach ($result as $field_value) {
			//$match;
			preg_match($pattern, $field_value['field_name'], $match);

			$params = explode(',', $match[6]);

			if (isset($params[0]) && $params[0] === 'gridEditor') {
				if (is_array(json_decode($result[$i]['value']))) {
					$result[$i]['value'] = json_decode($result[$i]['value']);
				}
				else
				{
					$result[$i]['value'] = array();
				}
				
			}

			$i++;
		}

		return $result;
	}

	public function save_template_values($data, $version, $parent_id, $template_id)
	{
		$template_values = array();

		foreach ($data as $value) {

			if ($value['type'] === 'gridEditor') {
				$value['fieldValue'] = json_encode($value['fieldValue']);
			}

			$template_values[] = array(
				'parent_id' => $parent_id,
				'field_name' => $value['full_name'],
				'value' => $value['fieldValue'],
				'page_version' => $version,
				'template_id' => $template_id,
				'created_by' => $this->flexi_auth->get_user_id()
				);
		}

		//$this->db->set('created_on', 'NOW()', FALSE); 

		$this->db->insert_batch('pages_templates_values', $template_values);
	}

	public function templates_fields_edit($data)
	{
		if (isset($data['id'])) {
			$updata = array(
				'name' => $data['name'],
				'full_name' => $data['full_name'],
				'parent_id' => $data['parent_id'],
				'type' => $data['type'],
				'is_required' => $data['is_required'],
				'max_length' => $data['max_length'],
				'weight' => $data['weight']
				);
			$this->db->where('id', $data['id']);
			$this->db->update('pages_templates_fields', $updata);

			//si full name change on update

			if ($data['full_name'] != $data['old_name']) {

				$updata = array(
					'field_name' => $data['full_name']
					);

				$this->db->where(array('field_name' => $data['old_name'], 'template_id' => $data['parent_id']));
				$this->db->update('pages_templates_values', $updata);
			}
		}
		else
		{
			$this->db->insert('pages_templates_fields', $data);
		}

		return TRUE;
	}

	public function templates_fields_delete($id)
	{
		$this->db->where('id', $id);
		$this->db->delete('pages_templates_fields');

		return TRUE;
	}

}