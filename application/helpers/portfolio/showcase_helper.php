<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

	// ------------------------------------------------------------------------

/** 
 * affiche la liste des catégories de portfolio
 *
 * @access	public
 * @param	$self
 * @return	string
 */

if ( ! function_exists('category_list'))
{
	function category_list($self) {
		//controler
		$content_items = $self->general_model->ordered_items('portfolio_categories');

		function minusculesSansAccents($texte)
		{
		    $texte = mb_strtolower($texte, 'UTF-8');
		    $texte = str_replace(
		        array(
		            'à', 'â', 'ä', 'á', 'ã', 'å',
		            'î', 'ï', 'ì', 'í', 
		            'ô', 'ö', 'ò', 'ó', 'õ', 'ø', 
		            'ù', 'û', 'ü', 'ú', 
		            'é', 'è', 'ê', 'ë', 
		            'ç', 'ÿ', 'ñ', 
		        ),
		        array(
		            'a', 'a', 'a', 'a', 'a', 'a', 
		            'i', 'i', 'i', 'i', 
		            'o', 'o', 'o', 'o', 'o', 'o', 
		            'u', 'u', 'u', 'u', 
		            'e', 'e', 'e', 'e', 
		            'c', 'y', 'n', 
		        ),
		        $texte
		    );
		 
		    return $texte;        
		}

		$i = 0;
		$count = count($content_items);
		while ( $i < $count) {
			//ecriture des urls
			$url_name = strtolower($content_items[$i]['name']);
			$url_name = minusculesSansAccents($url_name);
			$url_name = str_replace('_', '-', $url_name);
			$url_name = preg_replace('/[^a-z0-9- ]/', '', $url_name);
			$url_name = preg_replace('/ $/', '', $url_name);
			$url_name = str_replace(' ', '-', $url_name);
			$content_items[$i]['slug'] = $content_items[$i]['id'].'-'.$url_name ;
			$i++;
		}


		//view
		echo '<ul class="category_list">';
		echo '<li><a href="#">Tout</a></li>';
		foreach ($content_items as $item) {
			if ($item['is_hidden'] == 0) echo '<li><a href="'.$item['slug'].'">'.$item['name'].'</a></li>';
		}
		echo "</ul>";
	}
}

/** 
 * affiche la liste des elements de portfolio
 *
 * @access	public
 * @param	$self
 * @return	string
 */

if ( ! function_exists('showcase'))
{
	function showcase($self, $mode) {
		//controler
		$content_items = $self->general_model->ordered_items('portfolio');


		//view
		echo "<ul>";
		foreach ($content_items as $item) {
			$data['media_list'] = $item;
			$data['media_list']['mode'] = $mode;
			$self->load->view('modules/portfolio/item_caption', $data);
			
			unset ($item['meta_keywords']);
			unset ($item['meta_description']);
		}
		echo "</ul>";
	}
}

/** 
 * affiche la liste des elements de portfolio d'une catégorie
 *
 * @access	public
 * @param	$self
 * @param	$int
 * @param	$string
 * @return	string
 */

if ( ! function_exists('media_category'))
{
	function media_category($categoryId, $mode = 'caption_list') {

		$CI =& get_instance();

		//controler
		if ($categoryId != '' || $categoryId === 'all') {
			$content_items = $CI->general_model->category_items('portfolio', $categoryId);
			$category = $CI->general_model->get_item('portfolio_categories', 'id', $categoryId);
		}
		else {
			$content_items = $CI->general_model->ordered_items('portfolio');
			$category[0] = array('name' => '');
		}
		

		$i = 0;
		$count = count($content_items);
		while ( $i < $count) {
			//ecriture des urls
			$url_name = strtolower($content_items[$i]['db_title_default']);
			$url_name = str_replace('_', '-', $url_name);
			$url_name = preg_replace('/[^a-z0-9- ]/', '', $url_name);
			$url_name = preg_replace('/ $/', '', $url_name);
			$url_name = str_replace(' ', '-', $url_name);

			if ($categoryId != 1 && $categoryId != '')
			{
				$category_name = strtolower($category[0]['name']);
				$category_name = str_replace('_', '-', $category_name);
				$category_name = preg_replace('/[^a-z0-9- ]/', '', $category_name);
				$category_name = preg_replace('/ $/', '', $category_name);
				$category_name = str_replace(' ', '-', $category_name);
				$category_name = $categoryId.'-'.$category_name.'/';
			} else ($category_name = '');
			$content_items[$i]['slug'] = $category_name.$content_items[$i]['id'].'-'.$url_name ;
			$i++;
		}

		$output = '';

		//view
		foreach ($content_items as $item) {
			$item['mode'] = $mode;
			if ($item['src'] == '') {
				$item['src'] = 'no-image.jpg';
			}
			if ($item['icon'] == '') {
				$item['icon'] = 'icon-angle-right';
			}
			unset ($item['meta_keywords']);
			unset ($item['meta_description']);
			$output .= $CI->load->view('modules/portfolio/item', $item, true);
		}

		return $output;
	}
}

/** 
 * affiche un element de portfolio
 *
 * @access	public
 * @param	$self
 * @return	string
 */

if ( ! function_exists('print_portfolio_Item'))
{
	function print_portfolio_Item($self, $id, $mode) {
		//controler
		$content_items = $self->general_model->get_item('portfolio', 'id', $id);
		$content_item = $content_items[0];


		$self->load->view('modules/portfolio/item', $content_item);

	}
}

/** 
 * affiche la liste des elements de portfolio
 *
 * @access	public
 * @param	$self
 * @param	int
 * @return	string
 */

if ( ! function_exists('showcase_media'))
{
	function showcase_media($self, $id, $mode) {
		//controler

			$content_medias = $self->general_model->get_sub_item('portfolio_images', $id);

			$i = 0;
			switch($mode)
			{
				case 'just_thumbs' : 
					echo '<ul class="thumb-list">';
					foreach ($content_medias as $media) {
						$media['parent_id'] = $id;
						$media['size'] = 'thumbnail/';
						$self->load->view('modules/portfolio/thumblist', $media);
						$i++;
					}
					echo '</ul>';
					break;

				case 'caption_list' : 

						$content_medias[0]['parent_id'] = $id;
						$content_medias[0]['size'] = 'medium/';
						$image_properties = array(
						          'src' => '/uploads/'.$content_medias[0]['size'].$content_medias[0]['src'],
						          'alt' => $content_medias[0]['alt'],
						          'class' => '',
						          'title' => $content_medias[0]['img_title']
						);

						echo img($image_properties);

					break;

				case 'portfolio_home_slide' :
					$content_medias[0]['parent_id'] = $id;
					$content_medias[0]['size'] = '';
					$self->load->view('modules/portfolio/portfolio_home_slide', $content_medias[0]);
					break;

				case 'full_size' :
					echo '<ul class="media">';
					foreach ($content_medias as $media) 
					{
						$media['parent_id'] = $id;
						$media['size'] = '';
						$self->load->view('modules/portfolio/thumblist', $media);
						$i++;
					}
					echo '</ul>';
					break;

				default : 
					foreach ($content_medias as $media) {
						$media['parent_id'] = $id;
							if ( $i == 0 ) {
								$media['size'] = 'medium/';
							}
							else {
								$media['size'] = 'thumbnail/';
							}
					
							$self->load->view('modules/portfolio/thumblist', $media);

							$i++;
					}
					break;
			}
			
	}
}

 ?>
