<?php 
/**
 * 
 */
 class Assets extends CI_Controller
 {
 	
 	public function image($path, $size, $image = false)
{

	/*$this->load->helper('file');
	$this->load->helper('url');*/
	
	// définition du nom et chemin du cache
	$cache_filename = $path.'_'.$size.'_'.$image;
	$cache_file = APPPATH.'cache/assets/'.$cache_filename;
	$cache_file = str_replace('%7C', '_', $cache_file);

	$path = str_replace('~', '/', $path);
	$sizes = explode('x', $size);

	$source_image = APPPATH.'assets/images/'.$path.'/'.$image;


	// si la source n'existe pas on redirige vers le no-image
	if (file_exists($source_image)) {
		// si le cache n'existe pas on le crée
		if (!file_exists($cache_file)) {

			$this->load->library('image_lib');

			/*$path = str_replace('%7C', '/', $path);
			$sizes = explode('x', $size);

			$source_image = APPPATH.'assets/images/'.$path.'/'.$image;*/


			$config['image_library'] = 'gd2'; 
	        $config['source_image'] = $source_image; 
	        $config['new_image'] =  $cache_file;  

	        $confif['quality'] = 80;
	        $config['maintain_ratio'] = TRUE; 
	        if ($sizes[0] != 0 && $sizes[1] != 0) {
	        	$config['width'] = $sizes[0];
				$config['height'] = $sizes[1];
	        }
	        $this->image_lib->initialize($config); 
	        $this->image_lib->resize(); 
		}

		$this->load->image($cache_file);
	}
	else
	{
		redirect(APPPATH.'assets/images/no-image.jpg');
	}

}
 }