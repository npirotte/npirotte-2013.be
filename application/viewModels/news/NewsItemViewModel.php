<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!class_exists('NewsItemViewModel')) {

	class NewsItemViewModel
	{
		private $id;
		private $_src;
		private $_userSrc;
		private $_published_on;
		private $_createdBy;
		private $_lang = 'fr';
		
		public $title;
		public $icon;
		public $content;
		public $resume;
		private $_categorySlug;

		public $user_name;

		public function __construct($item, $index = 0)
		{
			$this->id = $item['id'];
			$this->_src = $item['src'];
			$this->title = $item['title'];
			$this->icon = $item['icon'];
			$this->content = $item['content'];
			$this->resume = $item['resume'];
			$this->_categorySlug = $item['category_slug'];
			$this->_published_on = $item['published_on'];
			// user
			$this->_createdBy = $item['created_by'];
			$this->_userSrc = $item['user_src'];
			$this->createdBy = $item['user_last_name'].' '. $item['user_first_name'];
		}

		public function Slug()
		{
			$slug = $this->id.'-'.url_title($this->title);
			$url = site_url(array($this->_lang, 'news', 'post', $slug));
			return $url;
		}

		public function CategorySlug()
		{
			return site_url(array($this->_lang, 'news', $this->_categorySlug));
		}

		public function Src($size = '0x0')
		{
			return site_url(array('assets', 'image', 'news~'.$this->id.'~thumbs', $size, $this->_src));
		}

		public function Date()
		{
			return date_format( date_create($this->_published_on), 'd/m/Y');
		}

		public function UserSrc($size = '0x0')
		{
			return site_url(array('assets', 'image', 'users~'.$this->_createdBy.'~thumbs', $size, $this->_userSrc));
		}
	} 
}