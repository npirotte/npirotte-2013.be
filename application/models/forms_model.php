<?php
class Forms_model extends CI_Model {

	public function __construct()
	{
		$this->load->database();
		$this->db->cache_on();
	}

	public function forms_list($limit, $offset)
	{
		$this->load->library('List_query_filters', array('table' => 'contact_forms', 'filtered_cols' => array('contact_forms.name', 'contact_forms.id', 'contact_forms.mailto')));

		$this->db->start_cache();
		
			$this->list_query_filters->setFilters();

		$this->db->stop_cache();

		$count = $this->db->count_all_results('contact_forms');

		$this->db->select('id, name');
		$query = $this->db->get('contact_forms', $limit, $offset);

		$result = array(
			'items' => $query->result_array(),
			'total_items' => $count
			);

		return $result;

	}

	public function form_details($id)
	{
		$this->db->where(array('id' => $id));
		$query = $this->db->get('contact_forms');

		return $query->result_array();
	}

	public function form_create($data)
	{
		$data['created_by'] = $this->flexi_auth->get_user_id();
		$this->db->set('created_on', 'NOW()', FALSE);

		$this->db->insert('contact_forms', $data);

		$this->db->select_max('id');
		$query = $this->db->get('contact_forms');

		$result = $query->result_array();
		$result = $result[0]['id'];

		return $result;
	}

	public function form_update($data)
	{
		$updata = array(
			'name' => $data['name'],
			'mailto' => $data['mailto'],
			'success_message' => $data['success_message'],
			'modified_by' => $this->flexi_auth->get_user_id()
			);

		$this->db->set('modified_on', 'NOW()', FALSE);

		$this->db->where('id', $data['id']);
		$this->db->update('contact_forms', $updata);
	}

	public function form_delete($id)
	{
		$this->db->trans_start();

		$this->db->delete('contact_forms' , array('id' => $id));

		$this->db->delete('contact_forms_fields' , array('parent_id' => $id));

		$this->db->trans_complete();
	}

	public function public_form_details($id)
	{
		$data = array();
		// form
		$this->db->select('mailto, success_message');
		$this->db->where(array('id' => $id));

		$query = $this->db->get('contact_forms');
		$data['form'] = $query->result_array();
		$data['form'] = $data['form'][0];

		// fields
		$this->db->select('name, display_name, validation, validation_regexp, field_type, field_values, is_mandatory');
		$this->db->where(array('parent_id' => $id));
		$this->db->order_by('weight');
		$query = $this->db->get('contact_forms_fields');
		$data['fields'] = $query->result_array();

		return $data;

	}

	/* fields */

	public function fields_list($parent_id)
	{
		$this->db->select('*');
		$this->db->where(array('parent_id' => $parent_id));
		$this->db->order_by('weight');
		$query = $this->db->get('contact_forms_fields');

		$result = $query->result_array();

		$i = 0;
		foreach ($result as $item) {
			$result[$i]['field_values'] = json_decode($result[$i]['field_values']);
			$i++;
		}

		return $result;
	}

	public function field_create($data)
	{
		$data['field_values'] = json_encode($data['field_values']);

		$this->db->insert('contact_forms_fields', $data);

		$this->db->select_max('id');
		$query = $this->db->get('contact_forms_fields');

		$result = $query->result_array();
		$result = $result[0]['id'];

		return $result;
	}

	public function field_update($data)
	{
		$data['field_values'] = json_encode($data['field_values']);

		$this->db->where('id', $data['id']);
		$this->db->update('contact_forms_fields', $data);
	}
}