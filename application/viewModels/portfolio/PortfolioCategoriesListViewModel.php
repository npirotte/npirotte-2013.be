<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!class_exists('PortfolioCategoriesListViewModel')) {

	class PortfolioCategoriesListViewModel
	{
		public $id;
		public $name;
		private $lang;

		public function __construct($item, $lang, $index = 0)
		{
			$this->lang = $lang;
			$this->id = $item['id'];
			$this->name = $item['name'];
		}

		public function Slug()
		{
			return site_url(array('portfolio', 'c'.$this->id.'-'.url_title($this->name, '-')));
		}
	} 
}
