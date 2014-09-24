<?php
$database['pages'] = array(
	'keys' => array(
		'primary' => 'slug',
		'id' => 'id',
		'lang' => 'lang'
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
		'slug' => array(
			'type' => 'VARCHAR',
			'constraint' => 40,
			'required' => true,
			'validation' => 'slug',
			'unique' => true
			),
		'lang' => array(
			'type' => 'VARCHAR',
			'constraint' => 2,
			'required' => true,
			'options' => $languages	
			),
		'meta_keywords' => array(
			'type' => 'VARCHAR',
			'constraint' => 300,
			'NULL' => TRUE
			),
		'meta_description' => array(
			'type' => 'VARCHAR',
			'constraint' => 300,
			'NULL' => TRUE
			),
		'meta_title' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'NULL' => TRUE
			),
		'type' => array(
			'type' => 'VARCHAR',
			'constraint' => 40,
			'required' => true,
			'options' => array(
				'file' => 'Fichier',
				'template' => 'Template'
				)
			),
		'template' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'required' => true
			),
		'version' => array(
			'type' => 'INT',
			'constraint' => 10
			),
		'parent_id' => array(
			'type' => 'INT',
			'constraint' => 10
			),
		'weight' => array(
			'type' => 'INT',
			'constraint' => 10
			),
		'user_groups' => array(
			'type' => 'VARCHAR',
			'constraint' => 80
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