<?php
$database['user_groups'] = array(
	'keys' => array(
		'primary' => 'ugrp_id',
		),
	'fields' => array(
		'ugrp_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'ugrp_name' => array(
			'type' => 'VARCHAR',
			'constraint' => 20,
			'required' => true
			),
		'ugrp_desc' => array(
			'type' => 'VARCHAR',
			'constraint' => 100
			),
		'ugrp_admin' => array(
			'type' => 'TINYINT',
			'constraint' => 1
			)
		)
	);