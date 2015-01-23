<?php
class Tags_model extends CI_Model {

	public function __construct()
	{
		$this->load->database();
		$this->db->cache_off();
	}

	public function get_meta_taxonomy()
	{
		$this->db->select('name');
		$this->db->order_by('name');
		$query = $this->db->get('global_tags');

		return $query->result_array();
	}

	public function get_meta_by_parent($parent_id, $parent_identity, $tag_type, $return_string = false)
	{
		$this->db->cache_on();

		$where = array(
			'parent_id' => $parent_id,
			'parent_identity' => $parent_identity,
			'tag_type' => $tag_type
			);

		$this->db->select('global_tags.name');
		$this->db->where($where);
		$this->db->join('global_tags', 'global_tags.id = global_tags_links.tag_id', 'left');

		$query = $this->db->get('global_tags_links');

		$result = $query->result_array();

		if ($return_string) 
		{
			$return = '';
			$i = 0;

			foreach ($result as $tag) {
				if ($i++ != 0)
				{
					$return .= ' ,';
				}
				$return .= $tag['name'];
			}

		}
		else
		{
			$return = array();

			foreach ($result as $tag) {
				$return[] = $tag['name'];
			}
		}

		return $return;
	}

	public function delete_tag_links_by_parent($id, $parent_identity)
	{
		$this->db->where(array('parent_id'=> $id, 'parent_identity' => $parent_identity));
		$this->db->delete('global_tags_links');
	}

	public function save_meta($data, $parent_id, $parent_identity, $tag_type)
	{
		$this->db->cache_off();

		// dicionnaire des id des nouveaux tags
		$tag_ids = array();

		foreach ($data as $tag) {
			$id = $this->get_meta_id($tag);
			$tag_ids[$id] = array(
				'tag_id' => $id
				);
		}

		// récupération des tags links existants pour cet élément
		$this->db->select('id, tag_id');
		$this->db->where(array('parent_id' => $parent_id, 'parent_identity' => $parent_identity, 'tag_type' => $tag_type));
		$query = $this->db->get('global_tags_links');
		$current_tags = $query->result_array();

		$to_delete = array();

		// on compare les 2

		foreach ($current_tags as $current_tag) {
			if (isset($tag_ids[$current_tag['tag_id']])) {
				# code...
				$tag_ids[$current_tag['tag_id']]['link_id'] = $current_tag['id'];
			}
			else
			{
				$to_delete[] = $current_tag['id'];
			}
		}

		// on supprile ceux qui n'existe plus
		if (count($to_delete) > 0) {
			$this->delete_tag_links($to_delete);
		}

		// on enregistre les nouveaux
		if (count($tag_ids) > 0) {
			$this->save_tag_links($tag_ids, $parent_id, $parent_identity, $tag_type);
		}

	}

	private function delete_tag_links($data)
	{
		$this->db->where_in('id', $data);
		$this->db->delete('global_tags_links');
	}

	private function save_tag_links($tag_ids, $parent_id, $parent_identity, $tag_type)
	{
		$this->db->cache_off();

		$updata = array();

		foreach ($tag_ids as $tag_id) {
			if (!isset($tag_id['link_id'])) {
				$updata[] = array(
					'tag_id' => $tag_id['tag_id'],
					'parent_id' => $parent_id,
					'parent_identity' => $parent_identity,
					'tag_type' => $tag_type
					);
			}
		}

		if (count($updata) > 0) {
			$this->db->insert_batch('global_tags_links', $updata);
		}
	}

	private function get_meta_id($tag_name)
	{
		$this->db->cache_off();
		
		// test de l'existance de l'élément
		$this->db->where('name', $tag_name);
		$this->db->select('id');
		$query = $this->db->get('global_tags');
		$tag = $query->result_array();

		if (count($tag) === 0) {
			// n'existe pas, on crée
			$updata = array(
				'name' => $tag_name
				);
			$this->db->insert('global_tags', $updata);

			$this->db->select_max('id');
			$query = $this->db->get('global_tags');

			$tag = $query->result_array();
			$id = $tag[0]['id'];

		}
		else if (count($tag === 1))
		{
			// duplication d'une entrée, on lance une erreur
			$id = $tag[0]['id'];
		}
		else
		{
			// existe, on rend l'id
			
			exit('Duplicate entry found for tag name "'.$tag_name.'".');
		}

		return $id;
	}
}