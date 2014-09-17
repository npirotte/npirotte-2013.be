<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!class_exists('ThumbListWidgetViewModel')) {

	class ThumbListWidgetViewModel
	{
		public $id;
		private $_src;
		private $_category;
		public $name;
		public $icon;
		public $resume;
		private $_lang = 'fr';

		public function __construct($item, $category = false, $index = 0)
		{
			$this->id = $item['id'];
			$this->_src = $item['src'];
			$this->_category = $category;
			$this->name = $item['name'];
			$this->icon = $item['icon'];
			$this->resume = $item['resume'];
		}

		public function Slug()
		{
			$slug = $this->id.'-'.url_title($this->name);

			if ($this->_category) 
			{
				$url = site_url(array('portfolio', 'c'.$this->_category, $slug));
			}
			else
			{
				$url = site_url(array('portfolio', $slug));
			}
			
			return $url;
		}

		public function Src($size)
		{
			return site_url(array('assets', 'image', 'portfolio~'.$this->id.'~thumbs', $size, $this->_src));
		}
	} 
}

?>