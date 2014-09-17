<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!class_exists('NewsListWidgetViewModel')) {

	class NewsListWidgetViewModel
	{
		public $id;
		
		public $title;
		public $icon;
		public $published_on;
		public $cssClass;

		public function __construct($item, $index = 0)
		{
			$this->id = $item['id'];
			$this->title = $item['title'];
			$this->icon = $item['icon'];
			$this->cssClass = $index === 0 ? 'active' : '';
			$this->published_on = $item['published_on'];
		}

		public function slug()
		{
			$slug = $this->id.'-'.url_title($this->title);
			$url = site_url(array('news', 'post', $slug));
			return $url;
		}
	} 
}

?>