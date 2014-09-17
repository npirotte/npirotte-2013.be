<?php
$database['contact_contacts_fields'] = array(
	'keys' => array(
		'primary' => 'id'
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
		'field_name' => array(
			'type' => 'VARCHAR',
			'constraint' => 80
			),
		'field_value' => array(
			'type' => 'VARCHAR',
			'constraint' => 600
			)
		)
	);