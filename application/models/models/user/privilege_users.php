<?php
$database['user_privilege_users'] = array(
	'keys' => array(
		'primary' => 'upriv_users_id'
		),
	'fields' => array(
		'upriv_users_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'upriv_users_uacc_fk' => array(
			'type' => 'INT',
			'constraint' => 11
			),
		'upriv_users_upriv_fk' => array(
			'type' => 'SMALLINT',
			'constraint' => 5
			)
		)
	);