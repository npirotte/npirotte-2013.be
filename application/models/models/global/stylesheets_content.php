<?php
$database['global_stylesheets_content'] = array(
	'keys' => array(
		'primary' => 'id',
		),
	'fields' => array(
		'id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'stylesheet_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'set' => TRUE
			),
		'content' => array(
			'type' => 'LONGTEXT',
			'set' => TRUE
			),
		'version' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'set' => TRUE
			),
		'statut' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'default' => 'NULL',
			'options' => array(
				'online' => 'Online',
				'offline' => 'Offline'
				),
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