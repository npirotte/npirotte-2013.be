<?php
$database['contact_infos'] = array(
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
		'value' => array(
			'type' => 'VARCHAR',
			'constraint' => 300,
			'required' => true
			),
		'target' => array(
			'type' => 'VARCHAR',
			'constraint' => 80
			),
		'icon' => array(
			'type' => 'VARCHAR',
			'constraint' => 20
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
	);