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
 * CodeIgniter Directory Helpers
 *
 * @package		CodeIgniter
 * @subpackage	Helpers
 * @category	Helpers
 * @author		ExpressionEngine Dev Team
 * @link		http://codeigniter.com/user_guide/helpers/directory_helper.html
 */

// ------------------------------------------------------------------------

/**
 * Create a Directory Map
 *
 * Reads the specified directory and builds an array
 * representation of it.  Sub-folders contained with the
 * directory will be mapped as well.
 *
 * @access	public
 * @param	string	path to source
 * @param	int		depth of directories to traverse (0 = fully recursive, 1 = current dir, etc)
 * @return	array
 */
if ( ! function_exists('directory_map'))
{
	function directory_map($source_dir, $directory_depth = 0, $hidden = FALSE)
	{
		if ($fp = @opendir($source_dir))
		{
			$filedata	= array();
			$new_depth	= $directory_depth - 1;
			$source_dir	= rtrim($source_dir, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;

			while (FALSE !== ($file = readdir($fp)))
			{
				// Remove '.', '..', and hidden files [optional]
				if ( ! trim($file, '.') OR ($hidden == FALSE && $file[0] == '.'))
				{
					continue;
				}

				if (($directory_depth < 1 OR $new_depth > 0) && @is_dir($source_dir.$file))
				{
					$filedata[$file] = directory_map($source_dir.$file.DIRECTORY_SEPARATOR, $new_depth, $hidden);
				}
				else
				{
					$filedata[] = $file;
				}
			}

			closedir($fp);
			return $filedata;
		}

		return FALSE;
	}
}

/**
 * Delete a directory
 *
 * Files contained will be deleted as well
 *
 * @access	public
 * @param	string	path to source
 * @return	bool
 */

if ( ! function_exists('delete_dir'))
{
	function delete_dir($dir)
	{
		// ajout du slash a la fin du chemin s'il n'y est pas
		 if( !preg_match( "/^.*\/$/", $dir ) ) $dir .= '/';
		 
		 // Ouverture du repertoire demande
		 $handle = @opendir( $dir );
		 
		 // si pas d'erreur d'ouverture du dossier on lance le scan
		 if( $handle != false )
		 {
		 
		  // Parcours du repertoire
		  while( $item = readdir($handle) )
		  {
		   if($item != "." && $item != "..")
		   {
		    if( is_dir( $dir.$item ) )
		     delete_dir( $dir.$item );
		    else unlink( $dir.$item );
		   }
		  }
		 
		  // Fermeture du repertoire
		  closedir($handle);
		 
		  // suppression du repertoire
		  $res = rmdir( $dir );
		 
		 }
		 else $res = false;
		 
		 return $res;
	}
}

/**
 * Create directory if ! exist
 *
 * Files contained will be deleted as well
 *
 * @access	public
 * @param	string	path to source
 * @return	bool
 */

if ( ! function_exists('check_dir'))
{
	function check_dir($dir)
	{
		$response = $dir;
		$directories = explode('/', $dir);

		$directories_merge = '';
		foreach ($directories as $directory) 
		{
			$directories_merge .= $directory.'/';

			if (!file_exists($directories_merge)) {
				mkdir($directories_merge, 0777);
			}
		}

		return $response;
	}
}


/* End of file directory_helper.php */
/* Location: ./system/helpers/directory_helper.php */