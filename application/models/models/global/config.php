<?php
$database['global_config'] = array(
	'keys' => array(
		'primary' => 'id',
		'name' => 'name',
		),
	'fields' => array(
		'id' => array(
			'type' => 'INT',
			'constraint' => 9,
			//'auto_increment' => TRUE
			),
		'name' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'param' => array(
			'type' => 'VARCHAR',
			'constraint' => 80
			),
		'value' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'required' => true
			)
		)
	);