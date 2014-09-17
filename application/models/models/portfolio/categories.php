<?php
$database['portfolio_categories'] = array(
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
			'constraint' => 80,
			'required' => TRUE,
			'set' => TRUE,
			'localize' => TRUE
			),
		'weight' => array(
			'type' => 'INT',
			'constraint' => 9,
			'set' => TRUE
			),
		'meta_title' => array(
			'type' => 'VARCHAR',
			'constraint' => 100,
			'NULL' => TRUE,
			'set' => TRUE,
			'localize' => TRUE
			),
		'meta_description' => array(
			'type' => 'VARCHAR',
			'constraint' => 300,
			'NULL' => TRUE,
			'set' => TRUE,
			'localize' => TRUE
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
			),	
		'is_hidden' => array(
			'type' => 'INT',
			'constraint' => 1,
			'default' => 0
			)
		)
	);