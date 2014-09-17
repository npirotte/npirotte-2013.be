<?php
$database['pages_templates_values'] = array(
	'keys' => array(
		'primary' => 'id',
		'parent' => 'parent_id',
		'field' => 'field_name'
		),
	'fields' => array(
		'id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'parent_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			),
		'field_name' => array(
			'type' => 'VARCHAR',
			'constraint' => 150,
			),
		'value' => array(
			'type' => 'VARCHAR',
			'constraint' => 10000
			),
		'page_version' => array(
			'type' => 'INT',
			'constraint' => 9
			),
		'template_id' => array(
			'type' => 'INT',
			'constraint' => 9
			),
		'created_on' => array(
			'type' => 'DATETIME',
			),
		'created_by' => array(
			'type' => 'INT',
			'constraint' => 9,
			),
		)
	);