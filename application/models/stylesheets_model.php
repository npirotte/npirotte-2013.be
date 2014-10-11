<?php
class Stylesheets_model extends CI_Model {

	public function __construct()
	{
		$this->load->database();

		// récupération du modèle
		$this->load->model('db_model');

		//require(APPPATH.'models/models/menuModel.php');
		$this->database = array(
			'global_stylesheets' => $this->db_model->database_model('global_stylesheets'),
			'global_stylesheets_content' => $this->db_model->database_model('global_stylesheets_content')
			);
	}

	public function StyleSheetsList($limit, $offset)
	{
		$this->load->library('List_query_filters', array('table' => 'global_stylesheets', 'filtered_cols' => array('global_stylesheets.name', 'global_stylesheets.id')));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();

		$this->db->stop_cache();

		$count = $this->db->count_all_results('global_stylesheets');

		$this->db->select('id, name, versions');

		$query = $this->db->get('global_stylesheets', $limit, $offset);

		$result = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		return $result;

	}

	public function StyleSheetDetails($id)
	{
		$retult = array();

		$this->db->where('id', $id);
		$query = $this->db->get('global_stylesheets');
		$query = $query->result_array();

		$result['item'] = $query[0];

		// get version list
		$this->db
			->select('id, version, statut, created_on')
			->where('stylesheet_id', $id)
			->order_by('version', 'desc');
		$query = $this->db->get('global_stylesheets_content');

		$result['childs'] = $query->result_array();

		return $result;
	}

	public function StyleSheetCreate($data)
	{
		$this->db->trans_start();

			$updata = array(
			'created_by' => $this->flexi_auth->get_user_id()
			);

			foreach ($this->database['global_stylesheets']['fields'] as $field => $fieldConfig) {
				if ($fieldConfig['set'] && isset($data[$field])) {
					$updata[$field] = $data[$field];
				}
			}

			$this->db->set('created_on', 'NOW()', FALSE);
			$this->db->insert('global_stylesheets', $updata);

			$this->db->select_max('id');
			$query = $this->db->get('global_stylesheets');

			$result = $query->result_array();
			$result = $result[0]['id'];

		$this->db->trans_complete();

		return $result;
	}

	public function StyleSheetUpdate($data)
	{
		$this->db->trans_start();

			$updata = array(
			'modified_by' => $this->flexi_auth->get_user_id()
			);

			foreach ($this->database['global_stylesheets']['fields'] as $field => $fieldConfig) {
				if ($fieldConfig['set'] && isset($data[$field])) {
					$updata[$field] = $data[$field];
				}
			}

			$this->db
				->set('modified_on', 'NOW()', FALSE)
				->where('id', $data['id'])
				->update('global_stylesheets', $updata);

		$this->db->trans_complete();

		return true;
	}

	// content
	public function ContentDetails($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get('global_stylesheets_content');
		$query = $query->result_array();

		return $query[0];
	}

	public function ContentCreate($data)
	{
		$this->db->trans_start();

			$updata = array(
			'created_by' => $this->flexi_auth->get_user_id()
			);

			foreach ($this->database['global_stylesheets_content']['fields'] as $field => $fieldConfig) {
				if ($fieldConfig['set'] && isset($data[$field])) {
					$updata[$field] = $data[$field];
				}
			}

			$this->db->set('created_on', 'NOW()', FALSE);
			$this->db->insert('global_stylesheets_content', $updata);

			$this->db->select_max('id');
			$query = $this->db->get('global_stylesheets_content');

			$result = $query->result_array();
			$result = $result[0]['id'];

		$this->db->trans_complete();

		return $result;
	}

	public function ContentUpdate($data)
	{
		$this->db->trans_start();

			$updata = array(
			'modified_by' => $this->flexi_auth->get_user_id()
			);

			foreach ($this->database['global_stylesheets_content']['fields'] as $field => $fieldConfig) {
				if ($fieldConfig['set'] && isset($data[$field])) {
					$updata[$field] = $data[$field];
				}
			}

			$this->db
				->set('modified_on', 'NOW()', FALSE)
				->where('id', $data['id'])
				->update('global_stylesheets_content', $updata);

		$this->db->trans_complete();

		return true;
	}


	// front function
	public function StyleSheetsContent($previewMode = false)
	{
		$result = '';

		$this->db
			->where('is_active', 1)
			->select('id, versions');
		$query = $this->db->get('global_stylesheets');
		$stylesheets = $query->result_array();

		// get content and happend to result

		$this->db->start_cache();

		$this->db
			->order_by('id', 'desc')
			->limit(1);

		$this->db->stop_cache();

		foreach ($stylesheets as $stylesheet) {

			$this->db->where(array('statut' => 'online', 'stylesheet_id' => $stylesheet['id']));

			/*if ($previewMode) 
			{
				$this->db->or_where(array('statut' => 'draft', 'stylesheet_id' => $stylesheet['id']));
			}*/

			$query = $this->db->get('global_stylesheets_content');

			$query = $query->result_array();

			$result .= $query[0]['content'];
			
		}

		return $result;

	}
}