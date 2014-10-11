<?php
$database['global_stylesheets'] = array(
	'keys' => array(
		'primary' => 'id',
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
			'set' => TRUE,
			'required' => TRUE
			),
		'versions' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'set' => TRUE
			),
		'is_active' => array(
			'type' => 'tinyint',
			'constraint' => 1,
			'default' => 0,
			'set' => TRUE
			),
		'created_on' => array(
			'type' => 'DATETIME'
			),
		'created_by' => array(
			'type' => 'INT',
			'constraint' => 9
			),
		'modified_on' => array(
			'type' => 'DATETIME',
			'NULL' => TRUE
			),
		'modified_by' => array(
			'type' => 'INT',
			'constraint' => 9,
			'NULL' => TRUE
			)
	)
);