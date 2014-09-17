<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (!class_exists('HeaderViewModel')) {
	class HeaderViewModel
	{
		public $lang;
		public $meta_title;
		private $_meta_keywords;
		public $meta_keywords;
		public $meta_description;
		public $body_class;

		public function __construct($data, $bodyclass = 'page')
		{
			$this->lang = $data['lang'];
			$this->meta_title = htmlentities($data['meta_title'], ENT_QUOTES);
			$this->meta_description = $data['meta_description'];
			$this->body_class = $bodyclass;
			$this->_meta_keywords = $data['meta_keywords'];
			$this->meta_keywords = false;
		}

		public function keywords_to_string($keywords)
		{
			if (!$this->meta_keywords) {
				$return = '';
				$i = 0;

				foreach ($this->_meta_keywords as $tag) {
					if ($i++ != 0)
					{
						$return .= ' ,';
					}
					$return .= $tag;
				}

				$this->meta_keywords = $return;
			}
			else
			{
				$return = $this->meta_keywords;
			}

			return $return;
		}
	}
}