<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!class_exists('NewsListViewModel')) {

	class NewsListViewModel
	{
		public $id;
		private $_src;
		private $_published_on;
		
		public $title;
		public $icon;
		public $resume;

		public function __construct($item, $index = 0)
		{
			$this->id = $item['id'];
			$this->_src = $item['src'];
			$this->title = $item['title'];
			$this->icon = $item['icon'];
			$this->description = $item['resume'];
			$this->_published_on = $item['published_on'];
		}

		public function Slug()
		{
			$slug = $this->id.'-'.url_title($this->title);
			$url = site_url(array('news', 'post', $slug));
			return $url;
		}

		public function Src($size)
		{
			return site_url(array('assets', 'image', 'news~'.$this->id.'~thumbs', $size, $this->_src));
		}

		public function Date()
		{
			return date_format( date_create($this->_published_on), 'd/m/Y');
		}
	} 
}

?>