<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cache_manager
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

	public function DeletePagesCache()
	{
		delete_files(APPPATH.'cache/pages/');
	}

	public function DeleteAdminCache()
	{
		delete_files(APPPATH.'/cache/admin');
	}

	public function DeleteDbCache()
	{
		delete_files(APPPATH.'/cache/database', TRUE);
	}

	public function DeleteAssetsCache()
	{
		delete_files(APPPATH.'/cache/assets');
	}

	public function DeleteThemeCache()
	{
		delete_files(APPPATH.'/front/cache');
	}

	public function DeleteFrontCache()
	{
		$this->DeletePagesCache();
		$this->DeleteDbCache();
		$this->DeleteAssetsCache();
	}

	public function DeleteAllCache()
	{
		$this->DeletePagesCache();
		$this->DeleteAdminCache();
		$this->DeleteDbCache();
		$this->DeleteAssetsCache();
		$this->DeleteThemeCache();
	}

}
