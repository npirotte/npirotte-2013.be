<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!class_exists('LastNewsWidgetViewModel')) {
	
	class LastNewsWidgetViewModel
	{
		private $_id;
		private $_user_tumb;
		private $_createdBy;
		private $_publishedOn;
		
		public $title;
		public $resume;
		public $user_name;

		public function __construct($item)
		{
			$this->_id = $item['id'];
			$this->title = $item['title'];
			$this->resume = $item['resume'];
			$this->_publishedOn = $item['published_on'];
			$this->createdBy = $item['last_name'].' '.$item['first_name'];
			$this->_user_thumb = $item['user_thumb'];
			$this->_createdBy = $item['user_account_id'];
		}

		public function Slug()
		{
			$slug = $this->_id.'-'.url_title($this->title);
			$url = site_url(array('news', 'post', $slug));
			return $url;
		}

		public function UserSrc($size = '0x0')
		{
			return site_url('assets/image/users~'.$this->_createdBy.'~thumbs/'.$size.'/'.$this->_user_thumb);
		}

		public function Date()
		{
			return date_format( date_create($this->_publishedOn), 'd/m/Y');
		}
	}
}

?>