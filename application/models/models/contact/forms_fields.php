<?php
$database['contact_forms_fields'] = array(
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
			'constraint' => 9
			),
		'weight' => array(
			'type' => 'INT',
			'constraint' => 9
			),
		'name' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'required' => TRUE,
			'validation' => 'slug',
			'unique' => 'by_parent'
			),
		'display_name' => array(
			'type' => 'VARCHAR',
			'constraint' => 80
			),
		'placeholder' => array(
			'type' => 'VARCHAR',
			'constraint' => 80
			),
		'field_type' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'required' => TRUE,
			'options' => array(
				'text' => 'Texte',
				'textarea' => 'Texte multilignes',
				'checkbox' => 'Checkbox',
				'checkbox_list' => 'Liste de checkbox',
				'radio_list' => 'Liste de boutons radio',
				'select' => 'Déroulant',
				'title' => 'Titre',
				'help_text' => 'Texte d\'aide'
				)
			),
		'field_values' => array(
			'type' => 'VARCHAR',
			'constraint' => 600,
			),
		'validation' => array(
			'type' => 'VARCHAR',
			'constraint' => 80,
			'options' => array(
				'' => 'Libre',
				'email' => 'Email',
				'int' => 'Nombre entier',
				'float' => 'Nombre à décimales',
				'url' => 'Url',
				'phone' => 'n° de téléphone',
				'regexp' => 'Expresion régulière'
				)
			),
		'validation_regexp' => array(
			'type' => 'VARCHAR',
			'constraint' => 100
			),
		'is_mandatory' => array(
			'type' => 'BOOLEAN',
			)
		)
		);