<?php
$database['global_tags'] = array(
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
			'constraint' => 80
			)
		)
	);