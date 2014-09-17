<?php
$database['user_profiles'] = array(
	'keys' => array(
		'primary' => 'user_account_id'
		),
	'fields' => array(
		// custom fields,
		'user_account_id' => array(
			'type' => 'INT',
			'constraint' => 9
			),
		'first_name' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'last_name' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'src' => array(
			'type' => 'VARCHAR',
			'constraint' => 80
			),
		'description' => array(
			'type' => 'VARCHAR',
			'constraint' => 300
			),
		'birthdate' => array(
			'type' => 'VARCHAR',
			'constraint' => 10
			)
		)
	);