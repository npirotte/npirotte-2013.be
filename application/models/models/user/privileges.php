<?php

$database['user_privileges'] = array(
	'keys' => array(
		'primary' => 'upriv_id'
		),
	'fields' => array(
		'upriv_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'upriv_name' => array(
			'type' => 'VARCHAR',
			'constraint' => 20
			),
		'upriv_desc' => array(
			'type' => 'VARCHAR',
			'constraint' => 100
			)
		)
	);