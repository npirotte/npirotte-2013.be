<?php
$database['menus_menus'] = array(
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
			'set' => TRUE
			),
		'cssclass' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'default' => 'NULL',
			'set' => TRUE
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