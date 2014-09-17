<?php
$database['global_log'] = array(
	'keys' => array(
		'primary' => 'id',
		),
	'fields' => array(
		'id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'ip' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'page_url' => array(
			'type' => 'VARCHAR',
			'constraint' => 80
			),
		'time' => array(
			'type' => 'INT',
			'constraint' => 11
			)
		)
	);