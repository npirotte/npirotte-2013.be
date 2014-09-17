<?php
$database['contact_contacts'] = array(
	'keys' => array(
		'primary' => 'id'
		),
	'fields' => array(
		'id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'form_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			),
		'is_spam' => array(
			'type' => 'BOOLEAN'
			),
		'created_on' => array(
			'type' => 'TIMESTAMP',
			),
		'read_on' => array(
			'type' => 'TIMESTAMP',
			 'null' => TRUE,
			),
		'send_on' => array(
			'type' => 'TIMESTAMP',
			 'null' => TRUE
			)
		)
	);