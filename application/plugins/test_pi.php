<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

	// ------------------------------------------------------------------------

/**
 * print_css
 *
 * Compile less
 *
 * @access	public
 * @param	string
 * @param	integer
 * @return	string
 */

if ( ! function_exists('test'))
{
	function test($data) {
		require "scripts/lessc.inc.php";

		$less = new lessc;

		if ( ENVIRONMENT  != 'development') {
			$less->checkedCompile('content/'.$data.'/style_compilator.less', 'content/cache/'.$data.'_compiled.css');
		} 
		else {
			$less->compileFile('content/'.$data.'/style_compilator.less', 'content/cache/'.$data.'_compiled.css');
		}

		echo '<link href="/content/cache/'.$data.'_compiled.css" rel="stylesheet" type="text/css" />';
		
	}
}

 ?>
