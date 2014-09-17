<?php
$database['contact_forms'] = array(
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
			'required' => true
			),
		'mailto' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'required' => TRUE,
			'validation' => 'mail'
			),
		'success_message' => array(
			'type' => 'VARCHAR',
			'constraint' => 300
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