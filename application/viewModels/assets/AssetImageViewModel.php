<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!class_exists('AssetImageViewModel')) {

	class AssetImageViewModel
	{
		private $_id;
		private $_src;
		private $_imageDirectory;
		public $alt;
		public $title;

		public function __construct($item, $imageDirectory, $index = 0)
		{
			$this->_id = $item['id'];
			$this->_src = $item['src'];
			$this->alt = $item['alt'];
			$this->title = $item['title'];
			$this->_imageDirectory = $imageDirectory;
		}

		public function Src($size = '0x0')
		{
			return site_url(array('assets', 'image', $this->_imageDirectory, $size, $this->_src));
		}
	} 
}

?>