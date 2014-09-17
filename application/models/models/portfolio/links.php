<?php
$database['portfolio_links'] = array(
	'keys' => array(
		'primary' => 'id',
		'parent' => 'parent_id'
		),
	'fields' => array(
		'id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'parent_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			),
		'child_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			),
		'weight' => array(
			'type' => 'INT',
			'constraint' => 9
			)
		)
	);