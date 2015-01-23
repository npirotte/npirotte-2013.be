<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/

Pigeon::map(function($r){

	$r->get('default_controller', '/pages/view/fr/home');
	$r->get('^('.CULTURES.')$', '/pages/view/fr/home');

	/*==========  admin  ==========*/
	
	$r->get('admin', 'admin/view/home');
	$r->get('admin/view_loader/(:any)/(:any)/(:any)/(:any)', 'admin/view_loader/$1/$2/$3/$4');

	/*==========  News  ==========*/
	
	$r->get('^'.CULTURES.'/news/*([a-zA-Z0-9\-}]*)$', 'news/news_list/$1');
	$r->get('^'.CULTURES.'/news/post/([0-9]+\-\S+)$', 'news/view/$1');

	/*==========  portfolio  ==========*/
	
	$r->get('^('.CULTURES.')/portfolio/([0-9]*\-\S*)$' , 'portfolio/view/$1/$2'); // sans catégorie
	$r->get('^('.CULTURES.')/portfolio/c([0-9]+\-\S+)/([0-9]*\-\S*)$', 'portfolio/view/$1/$3/$2'); // avec catégories
	$r->get('^('.CULTURES.')/portfolio$' , 'portfolio/porfolio_list/$1');
	$r->get('^('.CULTURES.')/portfolio/c([0-9]+\-\S+)$', 'portfolio/porfolio_list/$1/$2');

	/*==========  Accounts  ==========*/
	
	$r->get('^'.CULTURES.'/accounts/register', array('Accounts', 'Register'));
	$r->post('^'.CULTURES.'/accounts/register-profile', array('Accounts', 'RegisterProfile'));
	$r->post('^'.CULTURES.'/accounts/create', array('Accounts', 'create'));

	/*==========  contacts  ==========*/
	
	$r->post('^('.CULTURES.')/contact/send/(:any)', 'contact/send/$2');

	/*==========  sitemap  ==========*/
	
	$r->get('sitemap\.xml', "sitemap/sitemap_view");

	/*==========  pages  ==========*/

	$r->get('^('.CULTURES.')/(:any)', 'pages/view/$1/$2');	

});

$route = Pigeon::draw();

// URI like '/en/about' -> use controller 'about'
//$route['^(en|de|fr|nl)/(.+)$'] = "$2";
/*
$route['default_controller'] = '/pages/view/fr/home';

// '/en', '/de', '/fr' and '/nl' URIs -> use default controller
$route['^('.CULTURES.')$'] = $route['default_controller'];

//admin//
$route['admin'] = 'admin/view/home';
$route['admin/view_loader/(:any)/(:any)/(:any)/(:any)'] = 'admin/view_loader/$1/$2/$3/$4';
//maintenance
//pages//
//$route['page/(:any)'] = '/page/view/$1';
//portfolio
$route['^('.CULTURES.')/portfolio/([0-9]*\-\S*)$'] = 'portfolio/view/$1/$2'; // sans catégorie
$route['^('.CULTURES.')/portfolio/c([0-9]+\-\S+)/([0-9]*\-\S*)$'] = 'portfolio/view/$1/$3/$2'; // avec catégories
$route['^('.CULTURES.')/portfolio$'] = 'portfolio/porfolio_list/$1';
$route['^('.CULTURES.')/portfolio/c([0-9]+\-\S+)$'] = 'portfolio/porfolio_list/$1/$2';
//$route['^(fr)/portfolio/thumb_list/([0-9]*)$'] = 'portfolio/thumb_list/$1/$2';
//mail//
$route['^('.CULTURES.')/contact/send/(:any)'] = 'contact/send/$2';
//news
//news
$route['^('.CULTURES.')/news/post/([0-9]+\-\S+)$'] = 'news/view/$1/$2';
$route['^('.CULTURES.')/news/(:any)'] = 'news/news_list/$1/$2';
$route['^('.CULTURES.')/news$'] = 'news/news_list/$1';
//$route['(:any)/news/archives/(:any)'] = 'news/archives/$1/$2/offline';
//$route['news/get_news_ajax/(:any)'] = 'news/get_news_ajax/$1';
//file upload
$route['file_upload/upload'] = 'file_upload/upload';
//sitemap
$route['sitemap\.xml'] = "sitemap/sitemap_view";

$route['^('.CULTURES.')/(:any)'] = 'pages/view/$1/$2';

$route['404_override'] = '';


/* End of file routes.php */
/* Location: ./application/config/routes.php */