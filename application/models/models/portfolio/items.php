<?php
$database['portfolio_items'] = array(
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
			'required' => true,
			'set' => TRUE,
			'localize' => TRUE
			),
		'icon' => array(
			'type' => 'VARCHAR',
			'constraint' => 20,
			'NULL' => TRUE,
			'set' => TRUE,
			),
		'resume' => array(
			'type' => 'VARCHAR',
			'constraint' => 300,
			'NULL' => TRUE,
			'set' => TRUE,
			'localize' => TRUE
			),
		'description' => array(
			'type' => 'VARCHAR',
			'constraint' => 1000,
			'NULL' => TRUE,
			'set' => TRUE,
			'localize' => TRUE
			),
		'src' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'NULL' => TRUE,
			'set' => TRUE,
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
		)
	);