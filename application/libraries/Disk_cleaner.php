<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Disk_cleaner
{
  protected 	$CI;
  private $config;

	public function __construct()
	{
        $this->CI =& get_instance();
        $this->CI->load->helper('file');
	}

	public function set_config($config)
	{
		$this->config = $config;
	}

	public function DeleteLogs()
	{
		delete_files(APPPATH.'logs/');
	}

	public function DeleteTempFiles()
	{
		delete_files(APPPATH.'assets/temp/');
	}

}
