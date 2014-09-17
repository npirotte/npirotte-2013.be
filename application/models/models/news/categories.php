<?php

$database['news_categories'] = array(
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
			'required' => TRUE,
			'localize' => true,
			'set' => true
			),
		'slug' => array(
			'type' => 'VARCHAR',
			'constraint' => 40,
			'required' => TRUE,
			'unique' => TRUE,
			'validation' => 'slug',
			'localize' => true,
			'set' => true
			),
		'thumb_w' => array(
			'type' => 'SMALLINT',
			'constraint' => 9,
			'required' => TRUE,
			'validation' => 'int',
			'set' => true
			),
		'thumb_h' => array(
			'type' => 'SMALLINT',
			'constraint' => 9,
			'required' => TRUE,
			'validation' => 'int',
			'set' => true
			),
		'is_hidden' => array(
			'type' => 'INT',
			'constraint' => 1,
			'set' => true
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