<?php
$database['banners_banners'] = array(
	'keys' => array(
		'primary' => 'id'
		),
	'fields' => array(
		'id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'src' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'required' => true,
			'set' => true
			),
		'img_title' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'NULL' => true,
			'localize' => true,
			'set' => true
			),
		'alt' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'NULL' => true,
			'localize' => true,
			'set' => true
			),
		'link' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'NULL' => true,
			'localize' => true,
			'set' => true
			),
		'content' => array(
			'type' => 'VARCHAR',
			'constraint' => 300,
			'NULL' => true,
			'localize' => true,
			'set' => true
			),
		'cssclass' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'NULL' => true,
			'set' => true
			),
		'parent_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'required' => true,
			'set' => true
			),
		'weight' => array(
			'type' => 'INT',
			'constraint' => 9,
			'set' => true
			),
		'created_on' => array(
			'type' => 'DATETIME'
			),
		'created_by' => array(
			'type' => 'INT',
			'constraint' => 9,
			),
		'modified_on' => array(
			'type' => 'DATETIME',
			'NULL' => TRUE
			),
		'modified_by' => array(
			'type' => 'INT',
			'constraint' => 9,
			'NULL' => TRUE
			)
		)
	);