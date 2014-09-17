<?php
class Contact_model extends CI_Model {

	public function __construct()
	{
		$this->load->database();
		$this->db->cache_off();
	}

	//Models

	//admin

	public function unread_messages_nbr()
	{
		$this->db->where('read_on', null);
		return $this->db->count_all_results('contact_contacts');
	}

	public function get_messages($is_spam, $limit = 20, $offset = 0)
	{
			//query 

			if ($this->input->get('query')) {
				$this->contact_model->search_messages($this->input->get('query'));
			}

			// contacts

			$this->db->start_cache();

				$this->db->where('is_spam', $is_spam);

			$this->db->stop_cache();

			$count = $this->db->count_all_results('contact_contacts');

			$this->db->select('id, created_on, read_on, form_id');
			$this->db->order_by('created_on', 'desc');

			// si > id
			if ($this->input->get('max_id')) 
			{
				$this->db->where('id >', $this->input->get('max_id'));
			}

			// si < id
			if ($offset > 0) 
			{
				$this->db->where('id <', $offset);
			}

			$query = $this->db->get('contact_contacts', $limit, 0);

			$data = $query->result_array();

			$this->db->flush_cache();

			// contact_fields

			$i = 0;

			$this->db->start_cache();

			$this->db->select('*');
				
				$this->db->from('contact_contacts_fields');
				$this->db->where('field_name', 'Email');
			
			$this->db->stop_cache();

			foreach ($data as $contact) {
				$this->db->where('parent_id', $contact['id']);
				$query = $this->db->get();

				$data[$i++]['fields'] = array(
					$query->result_array()
					);
			}

			$this->db->flush_cache();

			return array('items' => $data, 'total_items' => $count);
	}

	private function search_messages($query)
	{
		// on cherche dans les champs

		$query = $this->input->get('query');

		$this->db->like('field_value', $query);
		$this->db->select('parent_id');
		$result = $this->db->get('contact_contacts_fields');

		$results = $result->result_array();

		$messages_id = array();

		foreach($results as $result)
		{
			if (!array_search($messages_id, $result['parent_id'])) {
				array_push ($messages_id, $result['parent_id']);
			}
		}

		if (count($messages_id) === 0) {
			array_push($messages_id, 0);
		}

		$this->db->start_cache();
		$this->db->where_in('id', $messages_id);
		$this->db->stop_cache();

		return $messages_id;

	}

	public function get_message($id)
	{

		$this->db->select('field_name, field_value');
		$this->db->where('parent_id', $id);
		$query = $this->db->get('contact_contacts_fields');

		$result = $query->result_array();

		if (!$result[0]['read_on']) {
			$this->db->where('id', $id);
			$this->db->set('read_on', 'NOW()', FALSE);
			$this->db->update('contact_contacts');
		}

		return $result;
	}

	public function delete_message($id)
	{

		$this->db->trans_start();

		$this->db->delete('contact_contacts' , array('id' => $id));
		$this->db->delete('contact_contacts_fields' , array('parent_id' => $id));

		$this->db->trans_complete();
	}

	//front

	public function create_contact($form_id, $fields_values)
	{
		$this->db->trans_start();

		$form_data = array(
			'form_id' => $form_id,
			'is_spam' => 0,
			);

		// création du contact 
		$this->db->insert('contact_contacts', $form_data);

		// onrécupère l'id
		$this->db->select_max('id');
		$query = $this->db->get('contact_contacts');

		$contact_id = $query->result_array();
		$contact_id = $contact_id[0]['id'];	

		// enregistrement des données

		$fields_data = array();

		foreach ($fields_values as $field => $value) {
			$fields_data[] = array(
				'field_name' => $field,
				'field_value' => $value,
				'parent_id' => $contact_id
				);

			//$this->db->insert('contact_contacts_fields', $fields_data); 
		};

		$this->db->insert_batch('contact_contacts_fields', $fields_data); 

		$this->db->trans_complete();

		return $contact_id;
	}

	public function send_mail($mail, $fields_values, $contact_id)
	{
		$this->load->library('parser');
		$this->load->library('email');

		// construction du view model

		$data = array(
			'sitename' => $this->config->item('site_name')
			);

		$data['fields'] = array();

		foreach ($fields_values as $field => $value) {
			$data['fields'][] = array(
				'field_name' => $field,
				'field_value' => $value
			);
		}

		// génération du template

		$mail_body = $this->load->view('email/contact', $data, TRUE);

		// envoi de l'email

		$mail_config['mailtype'] = 'html';

		$this->email->initialize($mail_config);

		if (isset($fields_values['Email'])) {
			$this->email->from($fields_values['Email']);
		}

		$this->email->to($mail);
		$this->email->subject('Contact de '.$data['sitename']);
		$this->email->message($mail_body);

		// si ok on met jour la db

		if($this->email->send())
		{
			$this->db->set('send_on', 'NOW()', FALSE);
			$this->db->where('id', $contact_id);
			$this->db->update('contact_contacts'); 
		}

	}

}