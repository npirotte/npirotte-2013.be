<ul class="portfolio-thumbs-list-widget clearfix">
	<?php foreach ($porfolio_items as $item) {
		$this->load->view('portfolio/item/thumb', array('slug' => $item->Slug(), 'src' => $item->Src('300x300'), 'title' => $item->name, 'icon' => $item->icon));
	}?>
</ul>