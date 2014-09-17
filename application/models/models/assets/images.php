<?php

$database['assets_images'] = array(
	'keys' => array(
		'primary' => 'id'
		),
	'fields' => array(
		'id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'src' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'required' => true,
			'set' => true
			),
		'title' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'NULL' => TRUE,
			'localize' => true,
			'set' => true
			),
		'alt' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'NULL' => TRUE,
			'localize' => true,
			'set' => true
			),
		'parent_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'NULL' => TRUE,
			'set' => true
			),
		'parent_identity' => array(
			'type' => 'VARCHAR',
			'constraint' => 20,
			'NULL' => TRUE,
			'set' => true
			),
		'weight' => array(
			'type' => 'INT',
			'constraint' => 9,
			'set' => true
			),
		'created_on' => array(
			'type' => 'DATETIME'
			),
		'created_by' => array(
			'type' => 'INT',
			'constraint' => 9,
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