<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!class_exists('PortfolioItemViewModel')) {

	class PortfolioItemViewModel
	{
		private $_id;
		public $name;
		public $resume;

		public function __construct($item, $imageDirectory, $index = 0)
		{
			$this->_id = $item['id'];
			$this->_src = $item['src'];
			$this->alt = $item['alt'];
			$this->title = $item['title'];
			$this->_imageDirectory = $imageDirectory;
		}

		public function Src($size)
		{
			return site_url(array('assets', 'image', $this->_imageDirectory, $size, $this->_src));
		}
	} 
}

?>