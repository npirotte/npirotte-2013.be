<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Loader Class
 * Loads views and files
 *
 * @package 	CodeIgniter
 * @subpackage  Libraries
 * @author  	Phil Sturgeon
 * @category    Loader
 * @link    	http://codeigniter.com/user_guide/libraries/loader.html
 */
class MY_Loader extends CI_Loader {

    function image($file_path, $mime_type_or_return = 'image/jpg')
    {
        $this->helper('file');

        $image_content = read_file($file_path);

        // Image was not found
        if($image_content === FALSE)
        {
        	show_error('Image "'.$file_path.'" could not be found.');
        	return FALSE;
        }

        // Return the image or output it?
        if($mime_type_or_return === TRUE)
        {
        	return $image_content;
        }

        header('Content-Length: '.strlen($image_content)); // sends filesize header
        header('Content-Type: '.$mime_type_or_return); // send mime-type header
        header('Content-Disposition: inline; filename="'.basename($file_path).'";'); // sends filename header
        header('Content-Encoding: identity');
        exit($image_content); // reads and outputs the file onto the output buffer */
    }
}