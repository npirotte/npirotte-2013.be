<?php
$database['user_accounts'] = array(
	'keys' => array(
		'primary' => 'user_id',
		'username' => 'username',
		'email' => 'email',
		'group_fk' => 'group_fk'
		),
	'fields' => array(
		'user_id' => array(
			'type' => 'INT',
			'constraint' => 9,
			'auto_increment' => TRUE
			),
		'group_fk' => array(
			'type' => 'smallint',
			'constraint' => 5
			),
		'email' => array(
			'id' => 1,
			'type' => 'VARCHAR',
			'constraint' => 100,
			'required' => true,
			'validation' => 'mail'
			),
		'username' => array(
			'type' => 'VARCHAR',
			'constraint' => 15,
			'required' => true,
			'validation' => 'slug'
			),
		'password' => array(
			'type' => 'VARCHAR',
			'constraint' => 60,
			'validation' => 'password'
			),
		'ip_address' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'salt' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'activation_token' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'forgotten_password_token' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'forgotten_password_expire' => array(
			'type' => 'DATETIME'
			),
		'update_email_token' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'update_email' => array(
			'type' => 'VARCHAR',
			'constraint' => 100
			),
		'active' => array(
			'type' => 'TINYINT',
			'constraint' => 1
			),
		'suspend' => array(
			'type' => 'TINYINT',
			'constraint' => 1
			),
		'fail_login_attempts' => array(
			'type' => 'SMALLINT',
			'constraint' => 5
			),
		'fail_login_ip_address' => array(
			'type' => 'VARCHAR',
			'constraint' => 40
			),
		'date_fail_login_ban' => array(
			'type' => 'DATETIME'
			),
		'date_last_login' => array(
			'type' => 'DATETIME'
			),
		'date_added' => array(
			'type' => 'DATETIME'
			)
		)
	);