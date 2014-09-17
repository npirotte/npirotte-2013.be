<?php
$database['banners_zones'] = array(
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
			'constraint' => 80,
			'validation' => 'slug',
			'required' => true
			),
		'speed' => array(
			'type' => 'INT',
			'constraint' => 6,
			'null' => true,
			'validation' => 'int'
			),
		'width' => array(
			'type' => 'INT',
			'constraint' => 4,
			'required' => true,
			'validation' => 'int'
			),
		'height' => array(
			'type' => 'INT',
			'constraint' => 4,
			'required' => true,
			'validation' => 'int'
			),
		'directionControl' => array(
			'type' => 'INT',
			'constraint' => 1,
			'null' => true,
			),
		'navigationControl' => array(
			'type' => 'INT',
			'constraint' => 1,
			'null' => true,
			),
		'effect' => array(
			'type' => 'VARCHAR',
			'constraint' => 20,
			'null' => true,
			'options' => array(
				'slide' => 'slide',
				'fade' => 'fade'
				)
			),
		'type' => array(
			'type' => 'VARCHAR',
			'constraint' => 20,
			'required' => true,
			'options' => array(
				'slideshow' => 'SlideShow',
				'list' => 'List'
				)
				),
		'cssclass' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'null' => true
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