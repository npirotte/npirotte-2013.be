<?php
$database['user_ips'] = array(
	'keys' => array(
		'primary' => 'id'
		),
	'fields' => array(
		'id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'user_id' => array(
			'type' => 'INT',
			'constraint' => 9
			),
		'ip_address' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			)
		)
	);