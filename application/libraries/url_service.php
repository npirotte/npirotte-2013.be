<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Url_service
{
  	protected $CI;
  	private $_pages_cache = array();
  	private $_news_category_cache = array();

	public function __construct()
	{
        $this->CI =& get_instance();
	}

	public function GetUrl($module, $function, $id)
	{
		$result;

		switch ($module) {
			case 'pages':
				$result = $this->_PageUrl($id);
				break;

			case 'news':
				if ($function === 'category') 
				{
					$result = $this->_NewsCategoryUrl($id);
				}
				else
				{
					$result = $this->_NewsItemUrl($id);
				}
				break;

			case 'portfolio':
				if ($function === 'category') 
				{
					$result = $this->_PortfolioCategoryUrl($id);
				}
				else
				{
					$result = $this->_PortfolioItemUrl($id);
				}
				break;

			case 'url':
				$result = $id;
				break;
			default:
				# code...
				break;
		}

		return $result;
	}

	private function _PageUrl($id)
	{
		if (count($this->_pages_cache) === 0) {
			$this->CI->load->model('pages_model');
			$this->_pages_cache = $this->CI->pages_model->PagesSlugList();
		}

		$slug = $this->_pages_cache[$id];

		return site_url($slug === 'home' ? 'fr' : $slug);
	}

	private function _NewsCategoryUrl($id)
	{
		$slug = '';

		if (count($this->_news_category_cache) === 0 && $id != 'all') {
			$this->CI->load->model('news_model');
			$this->_news_category_cache = $this->CI->news_model->CategorySlugs();
		}

		if ($id != 'all') {
			$slug = $this->_news_category_cache[$id];
		}

		return site_url(array('news', $slug));
	}

	private function _NewsItemUrl($id)
	{
		// pas de cache sur les news items, bcp trop d'éléments
		$this->CI->load->model('news_model');
		$newsItem = $this->CI->news_model->news_slug($id);

		$slug = $id.'-'.url_title($newsItem['title']);

		return site_url(array('news', 'post', $slug));
		
	}

	private function _PortfolioCategoryUrl($id)
	{
		$slug = '';

		if ($id != 'all') 
		{
			// pas de cache sur le porfolio car bcp d'éléments
			$this->CI->load->model('portfolio_model');
			$category = $this->CI->portfolio_model->CategorySlug($id);

			$slug = 'c'.$id.'-'.url_title($category['name']);
		}

		return site_url(array('portfolio', $slug));
	}

	private function _PortfolioItemUrl($id)
	{
		// pas de cache sur le porfolio car bcp d'éléments
		$this->CI->load->model('portfolio_model');
		$category = $this->CI->portfolio_model->PortfolioSlug($id);

		$slug = $id.'-'.url_title($category['name']);

		return site_url(array('portfolio', $slug));
	}
}

/* End of file Url_service.php */
/* Location: ./application/libraries/Url_service.php */