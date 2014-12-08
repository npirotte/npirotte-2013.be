<?php 

 class Maintenance extends CI_Controller
 {
 	public function __construct()
	{
		parent::__construct();

		/*$this->load->library('flexi_auth');
		// Authentification
		if ($this->flexi_auth->is_logged_in()) 
		{
			if ($this->flexi_auth->is_admin())
			{

			}
			else
			{
				exit('Access denied');
			}
		}
		else
		{
			exit('Access denied');
		}*/
	}

 	public function flush_cache ($cache = false)
 	{
 		$this->load->library('Cache_manager', array());

 		switch ($cache) {
 			case 'pages':
 				$this->cache_manager->DeletePagesCache();
 				break;
 			case 'assets':
 				$this->cache_manager->DeleteAssetsCache();
 				break;
 			case 'database':
 				$this->cache_manager->DeleteDbCache();
 				break;
 			case 'theme':
 				$this->cache_manager->DeleteThemeCache();
 				$this->cache_manager->DeletePagesCache();
 				break;
 			case 'admin':
 				$this->cache_manager->DeleteAdminCache();
 				break; 
 			default:
 				$this->cache_manager->DeletePagesCache();
 				$this->cache_manager->DeleteDbCache();
 				$this->cache_manager->DeleteAssetsCache();
 				break;
 		}
 	

 		$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
		$this->output->set_output('Cache supprimé');
 	}

 	public function clean_disk($data_type = false)
 	{
 		$this->load->library('Disk_cleaner', array());

 		switch ($data_type) {
 			case 'logs':
 				$this->disk_cleaner->DeleteLogs();
 				break;
 			case 'temps':
 				$this->disk_cleaner->DeleteTempFiles();
 				break;
 			default:
 				$this->disk_cleaner->DeleteLogs();
 				$this->disk_cleaner->DeleteTempFiles();
 				# code...
 				break;
 		}

 		$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
		$this->output->set_output('Cache supprimé');
 	}

 	public function forge_database ($table_target = false)
 	{
 		$this->load->model('db_model');
 		$this->load->dbforge();

 		// récupération des modèles

 		if ($table_target) 
 		{
 			$database = array();
 			$database[$table_target] = $this->db_model->database_model($table_target);
 		}
 		else
 		{
 			$database = $this->db_model->database_model($table_target);
 		}

 		// création

 		foreach ($database as $table => $cols) {

 			if ($table_target === false || $table == $table_target) {
 				# code...

	 			if (!$this->db_model->table_exist($table)) 
	 			{
	 				$this->dbforge->add_field($cols['fields']);

	 				$keys = array();

	 				foreach ($cols['keys'] as $key => $col) {
	 					if ($key == 'primary')
	 					{
	 						$this->dbforge->add_key($col, TRUE);
	 					}
	 					else
	 					{
	 						$keys[] = $col;
	 					}
	 				}

	 				$this->dbforge->add_key(array($keys));

	 				$this->dbforge->create_table($table, TRUE);

	 				echo 'Création de la table '.$table;
	 			}
	 			else
	 			{
	 				$to_add = array();
		 		 	$to_modify = array();

	 				foreach ($cols['fields'] as $col => $col_params)
		 		 	{
		 		 		//$this->dbforge->modify_column($table, $col_params);

		 		 		if (!$this->db_model->col_exist($table, $col)) 
		 		 		{
		 		 			$to_add[$col] = $col_params;
		 		 		}
		 		 		else
		 		 		{
		 		 			$to_modify[$col] = $col_params;
		 		 		}
		 		 	}

		 		 	$this->dbforge->add_column($table, $to_add);
		 		 	$this->dbforge->modify_column($table, $to_modify);
	 			}
		 		
		 		// if ($this->dbforge->create_table($table, TRUE)) {
		 		// 	echo 'Création de la table '.$table;
		 		// }
		 		// else
		 		// {

		 		// 	foreach ($cols['fields'] as $col => $col_params)
		 		// 	{
		 		// 		try 
		 		// 		{
		 		// 			$this->dbforge->add_column($table, $cols['fields'][$col]);
		 		// 		}
		 		// 		catch(Exception $e)
		 		// 		{
		 		// 			$this->dbforge->modify_column($table, $cols['fields'][$col]);
		 		// 		}
		 		// 	}
		 		// }
	 		}
 		}

 		$this->output->set_header("Cache-Control: no-store, no-cache, must-revalidate");
		$this->output->set_output('Database mise à jour avec succès');
 	}
 }

 ?>