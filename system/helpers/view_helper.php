<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');
/**
 * CodeIgniter
 *
 * An open source application development framework for PHP 5.1.6 or newer
 *
 * @package		CodeIgniter
 * @author		ExpressionEngine Dev Team
 * @copyright	Copyright (c) 2008 - 2011, EllisLab, Inc.
 * @license		http://codeigniter.com/user_guide/license.html
 * @link		http://codeigniter.com
 * @since		Version 1.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * CodeIgniter VIEW Helpers
 *
 * @package		CodeIgniter
 * @subpackage	Helpers
 * @category	Helpers
 * @author		N.Pirotte
 */


// ------------------------------------------------------------------------

/**
 * print_js
 *
 * Minimize js and print js files in prod.
 *
 * @access	public
 * @param	string
 * @return	string
 */

if ( ! function_exists('print_js'))
{
	function print_js($data) {

		//minimify js files

		require_once( APPPATH .'front/compilers/'.$data.'_js.php');

	 	if ( ENVIRONMENT  != 'development' ) {


	 		if (!file_exists( APPPATH .'front/cache/'.$data.'_combined.js')) {
	 			require_once(SYSDIR .'/third_party/minifier.php');

				$js = "";
				foreach($files as $file) {
				    //$js .= \JShrink\Minifier::minify(file_get_contents($file));
				    $js .= file_get_contents($file);
				}

				$js = \JShrink\Minifier::minify($js);
			 
				file_put_contents(APPPATH .'front/cache/'.$data.'_combined.js', $js);
	 		}
			echo '<script src="/'.APPPATH .'front/cache/'.$data.'_combined.js" type="text/javascript"></script>';
	 	}
	 	else {

	 		foreach($files as $file) {
			    echo '<script src="/'.$file.'" type="text/javascript"></script>';
			}
	 	}
	}
}

/*// ------------------------------------------------------------------------

/**
 * print_css
 *
 * Compile less
 *
 * @access	public
 * @param	string
 * @return	string
 */
/*
if ( ! function_exists('print_css'))
{
	function print_css($data) {
		require SYSDIR ."/third_party/lessc.inc.php";

		$application_folder;

		$less = new lessc;

		if ( ENVIRONMENT  != 'development') {
			$less->checkedCompile( APPPATH .'front/'.$data.'/style_compilator.less', APPPATH .'front/cache/'.$data.'_compiled.css');
		} 
		else {
			$less->compileFile(APPPATH .'front/'.$data.'/style_compilator.less', APPPATH .'front/cache/'.$data.'_compiled.css');
		}

		echo '<link href="/'.APPPATH .'front/cache/'.$data.'_compiled.css" rel="stylesheet" type="text/css" />';
		
	}
}*/

// ------------------------------------------------------------------------

/**
 * print_css
 *
 * Compile less
 *
 * @access	public
 * @param	string
 * @return	string
 */

if ( ! function_exists('print_css'))
{
	function print_css($data, $varsOverride = false) {

		if ( ENVIRONMENT  == 'development' || !file_exists( APPPATH .'front/cache/'.$data.'_combined.css' ))
		//if (false || !file_exists( APPPATH .'front/cache/'.$data.'_combined.css' ))
		{
			require SYSDIR ."/third_party/less.php/Less.php";

			$options = array( 'sourceMap'=> ENVIRONMENT  == 'development' ? true : false, 'compress' => true );

			$parser = new Less_Parser( $options );	

			$parser->parseFile( APPPATH .'front/'.$data.'/style_compilator.less',  '/'.APPPATH .'front/'.$data );

			// récupération du css db pour le front
			if ($data === 'default') 
			{
				$CI =& get_instance();
				$CI->load->model('stylesheets_model');
				$customCss = $CI->stylesheets_model->StyleSheetsContent();
				$parser->parse($customCss);
			}

			if ($varsOverride) {
				$parser->ModifyVars( $varsOverride );
			}

			$css = $parser->getCss();

			file_put_contents(APPPATH .'front/cache/'.$data.'_combined.css', $css);
		}

		echo '<link href="/'.APPPATH .'front/cache/'.$data.'_combined.css" rel="stylesheet" type="text/css" />';
		
	}
}

// ------------------------------------------------------------------------

/**
 * parse_json_content_to_html_css
 *
 * Compile less
 *
 * @access	public
 * @param	self
 * @param	array
 * @return	string
 */
if (! function_exists('parse_content')) {
	function parse_content($self, $content)
	{
		$content = json_decode($content);
		foreach ($content as $item) {
			$self->load->view('shared/grid_generator', $item);
		}
		
	}
}

?>