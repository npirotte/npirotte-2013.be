<?php

$database['user_privilege_groups'] = array(
	'keys' => array(
		'primary' => 'upriv_groups_id'
		),
	'fields' => array(
		'upriv_groups_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'upriv_groups_ugrp_fk' => array(
			'type' => 'SMALLINT',
			'constraint' => 5
			),
		'upriv_groups_upriv_fk' => array(
			'type' => 'SMALLINT',
			'constraint' => 5
			)
		)
	);