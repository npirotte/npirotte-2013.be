<?php
$database['news_items'] = array(
	'keys' => array(
		'primary' => 'id',
		'parent_id' => 'parent_id'
		),
	'fields' => array(
		'id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'title' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'required' => true,
			'set' => TRUE
			),
		'resume' => array(
			'type' => 'VARCHAR',
			'constraint' => 300,
			'set' => TRUE
			),
		'content' => array(
			'type' => 'VARCHAR',
			'constraint' => 10000,
			'required' => true,
			'set' => TRUE
			),
		'icon' => array(
			'type' => 'VARCHAR',
			'constraint' => 20,
			'set' => TRUE
			),
		'is_published' => array(
			'type' => 'INT',
			'constraint' => 1
			),
		'archived_on' => array(
			'type' => 'DATE',
			'NULL' => TRUE,
			'set' => TRUE
			),
		'published_on' => array(
			'type' => 'DATE',
			'set' => TRUE
			),
		'parent_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'required' => true,
			'set' => TRUE
			),
		'lang' => array(
			'type' => 'VARCHAR',
			'constraint' => 2,
			'required' => true,
			'options' => $languages,
			'set' => TRUE
			),
		'src' => array(
			'type' => 'VARCHAR',
			'constraint' => 80, 
			'NULL' => true,
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