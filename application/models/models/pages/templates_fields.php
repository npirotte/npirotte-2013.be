<?php
$database['pages_templates_fields'] = array(
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
		'parent_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			),
		'full_name' => array(
			'type' => 'VARCHAR',
			'constraint' => 80
			),
		'name' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'type' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'is_required' => array(
			'type' => 'SMALLINT',
			'constraint' => 1
			),
		'max_length' => array(
			'type' => 'SMALLINT',
			'constraint' => 6
			),
		'weight' => array(
			'type' => 'INT',
			'constraint' => 9
			)
		)
	);
