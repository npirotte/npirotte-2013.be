<?php
$database['global_tags_links'] = array(
	'keys' => array(
		'primary' => 'id',
		'foreign' => 'parent_id'
		),
	'fields' => array(
		'id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'tag_id' => array(
			'type' => 'INT',
			'constraint' => 9
			),
		'parent_id' => array(
			'type' => 'INT',
			'constraint' => 9
			),
		'parent_identity' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'tag_type' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			)
		)
	);