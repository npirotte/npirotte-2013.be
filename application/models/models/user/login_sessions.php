<?php
$database['user_login_sessions'] = array(
	'fields' => array(
		'usess_uacc_fk' => array(
			'type' => 'INT',
			'constraint' => 11
			),
		'usess_series' => array(
			'type' => 'VARCHAR',
			'constraint' => 40,
			'default' => 'NULL'
			),
		'usess_token' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'usess_login_date' => array(
			'type' => 'DATETIME'
			)
		)
	);