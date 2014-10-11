<?php
class Db_model extends CI_Model {

	public function current_model()
	{
		$sql= "SHOW TABLES";

		$req="show tables";
		$result=mysql_query($req);

		// $query = $this->db->query($sql);
		return $result;
	}

	public function col_exist($table, $col)
	{
		return $this->db->field_exists($col, $table) > 0 ? true : false;
	}

	public function table_exist($table)
	{
		return $this->db->table_exists($table) ? true : false;
	}

	public function set_validation_rules($table_id, $item_id, $item_lang = false)
	{

		function extend_rule($rules, $rule)
		{
			$rules = $rules == '' ? $rule : $rules.'|'.$rule;

			return $rules;
 		}

		$rules = array();
		$table = $this->db_model->database_model($table_id);
		$key = array_keys($table['fields']);

		foreach ($table['fields'] as $col => $params) {

			$rule = '';

			// is unique
			if ( isset($params['unique']) && $params['unique'] === TRUE ) {
				if ($item_lang) {
					$rule = extend_rule($rule, 'item_available_localized['.$item_id.','.$key[0].','.$table_id.','.$col.','.$item_lang.']');
				}
				else
				{
					$rule = extend_rule($rule, 'item_available['.$item_id.','.$key[0].','.$table_id.','.$col.']');
				}
			}

			// is required
			if ( isset($params['required']) && $params['required'] === TRUE ) {
				$rule = extend_rule($rule, 'required');
			}

			// validations format

			if (isset($params['validation'])) {
				$extend;
				switch ($params['validation']) {
					case 'int':
						$extend = 'integer';
						break;
					case 'mail':
						$exend = 'valid_email';
						break;
					case 'slug':
						$extend = 'alpha_dash';
						break;
				}

				if ($extend) {
					$rule = extend_rule($rule, $extend);
				}
			}

			// Nom de char
			if (isset($params['constraint'])) {
				$rule = extend_rule($rule, 'max_length['.$params['constraint'].']');
			}

			// on termine en poussant dans l'array

			if ($rule != '') {
				$rules[] = array(
					'field' => $col,
					'label' => $col,
					'rules' => $rule
				);
			}

		}

		$this->form_validation->set_rules($rules);
	}

	//Models

	public function database_model($table = false)
	{

		$this->load->library('Models_service');
		$languages = $this->lang->languages;

		$database = array();

		if ($table) {

			$position = strpos($table, '_');

			if (!$position) {
				$module = $function = $table;
			}
			else
			{
				$module = substr($table, 0, $position);
				$function = substr($table, $position + 1, strlen($table) + 1);
			}
		
			require(APPPATH.'models/models/'.$module.'/'.$function.'.php');
		}

		else
		{

			require(APPPATH.'models/models/menus/menus.php');
			require(APPPATH.'models/models/menus/items.php');

			// core

			require(APPPATH.'models/models/global/config.php');
			require(APPPATH.'models/models/global/log.php');
			require(APPPATH.'models/models/global/tags.php');
			require(APPPATH.'models/models/global/tags_links.php');
			require(APPPATH.'models/models/global/stylesheets.php');
			require(APPPATH.'models/models/global/stylesheets_content.php');

			// assets

			require(APPPATH.'models/models/assets/images.php');

			// users

			require(APPPATH.'models/models/user/profiles.php');
			require(APPPATH.'models/models/user/accounts.php');
			require(APPPATH.'models/models/user/groups.php');
			require(APPPATH.'models/models/user/login_sessions.php');
			require(APPPATH.'models/models/user/privileges.php');
			require(APPPATH.'models/models/user/privilege_groups.php');
			require(APPPATH.'models/models/user/privilege_users.php');
			require(APPPATH.'models/models/user/groups.php');
			require(APPPATH.'models/models/user/ips.php');

			// pages

			require(APPPATH.'models/models/pages/templates.php');
			require(APPPATH.'models/models/pages/templates_fields.php');
			require(APPPATH.'models/models/pages/templates_values.php');
			require(APPPATH.'models/models/pages/pages.php');

			// news

			require(APPPATH.'models/models/news/categories.php');
			require(APPPATH.'models/models/news/items.php');

			// contact

			require(APPPATH.'models/models/contact/infos.php');
			require(APPPATH.'models/models/contact/forms.php');
			require(APPPATH.'models/models/contact/forms_fields.php');
			require(APPPATH.'models/models/contact/contacts.php');
			require(APPPATH.'models/models/contact/contacts_fields.php');

			// banners
			require(APPPATH.'models/models/banners/zones.php');
			require(APPPATH.'models/models/banners/banners.php');
			

			// portfolio
			require(APPPATH.'models/models/portfolio/categories.php');
			require(APPPATH.'models/models/portfolio/links.php');
			require(APPPATH.'models/models/portfolio/items.php');

		}


		
		
		// module menu

		/*$database['carte_categories'] = array(
			'keys' => array(
				'primary' => 'id'
				),
			'fields' => array(
				'id' => array(
					'type' => 'INT',
					'constraint' => 9,
					'auto_increment' => TRUE
					),
				'name' => array(
					'type' => 'VARCHAR',
					'constraint' => 40,
					'required' => true
					),
				'desc' => array(
					'type' => 'VARCHAR',
					'constraint' => 300
					),
				'weight' => array(
					'type' => 'INT',
					'constraint' => 9
					)
				)
			);
*/
	/*	$database['carte_items'] = array(
			'keys' => array(
				'primary' => 'id',
				'foreign' => 'parent_id'
				),
			'fields' => array(
				'id' => array(
					'type' => 'INT',
					'constraint' => 9,
					'auto_increment' => TRUE
					),
				'name' => array(
					'type' => 'VARCHAR',
					'constraint' => 40,
					'required' => true
					),
				'desc' => array(
					'type' => 'VARCHAR',
					'constraint' => 300,
					),
				'price' => array(
					'type' => 'VARCHAR',
					'constraint' => 80
					),
				'is_online' => array(
					'type' => 'SMALLINT',
					'constraint' => 1
					),
				'weight' => array(
					'type' => 'INT',
					'constraint' => 9
					),
				'parent_id' => array(
					'type' => 'INT',
					'constraint' => 9
					)
				)
			);*/
		
		foreach ($database as $dbTable => $cols) {
			$database[$dbTable] = $this->models_service->Localize($cols);
		}

		if ($table) {
			$model = $database[$table];
		}
		else
		{
			$model = $database;
		}

		return $model;

	}


}