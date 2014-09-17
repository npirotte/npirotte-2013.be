<?php
$database['pages_templates'] = array(
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
			'unique' => true
			),
		'content' => array(
			'type' => 'VARCHAR',
			'constraint' => 10000,
			'required' => true
			),
		'type' => array(
			'type' => 'VARCHAR',
			'constraint' => 40,
			'options' => array(
				'database' => 'Base de donnée',
				'file' => 'Fichier'
				)
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