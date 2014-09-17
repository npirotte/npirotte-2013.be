
<div class="widget-news-list">
	<ul id="news-list" class="clearfix">
		<?php foreach($items as $item): ?>
			<li class="<?= $item->cssClass?>">
				<div class="pull-left">
					<i class="<?=$item->icon?>"></i>
					<span class="date"><?=$item->published_on?></span>
				</div>
				<?= anchor($item->slug(), $item->title, array('class' => 'no-ajax', 'data-id' => $item->id))?>
			</li>
		<?php endforeach; ?>
	</ul>
	<a href="<?= site_url(array('news', $category)) ?>"><i class="icon-archive link-icon"></i>Archives</a>
</div>