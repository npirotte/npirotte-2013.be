<?php
$database['menus_items'] = array(
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
			'set' => TRUE
			),
		'menu_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'set' => TRUE
			),
		'weight' => array(
			'type' => 'INT',
			'constraint' => 9,
			'set' => TRUE
			),
		'name' => array(
			'type' => 'VARCHAR',
			'constraint' => 40,
			'required' => true,
			'set' => TRUE,
			'localize' => TRUE
			),
		'cssclass' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'default' => 'NULL',
			'set' => TRUE
			),
		'target' => array(
			'type' => 'tinyint',
			'constraint' => 1,
			'default' => 0,
			'set' => TRUE
			),
		'module' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'default' => 'NULL',
			'options' => array(
				'pages' => 'Pages',
				'news' => 'News',
				'portfolio' => 'Portfolio',
				'url' => 'Url libre'
				),
			'set' => TRUE
			),
		'function' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'default' => 'NULL',
			'set' => TRUE
			),
		'element' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'default' => 'NULL',
			'set' => TRUE,
			'localize' => TRUE
			),
		'is_hidden' => array(
			'type' => 'tinyint',
			'constraint' => 1,
			'default' => 0,
			'set' => true,
			'localize' => true
			)
		)
	);