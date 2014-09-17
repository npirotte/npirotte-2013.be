<div id="<?=$unique_id?>" class="<?=$banner_zone['cssclass']?>">
	<ul class="slides">
	<?php foreach ($banners as $banner) : ?>
		<li class="<?=$banner['cssclass']?>">
			<?php if($banner['link'] != ''): ?>
			<a href="<?=$banner['link']?>">
			<?php endif; ?>
			<img src="/assets/image/banners~<?=$banner_zone['id']?>/2200x2200/<?=$banner['src']?>" alt="<?=$banner['alt']?>">
			<?php if($banner['content'] != ''): ?>
			<div class="text">
				<?=$banner['content']?>
			</div>
			<?php endif; ?>
			<?php if($banner['link'] != ''): ?>
			</a>
			<?php endif; ?>
		</li>
	<?php endforeach; ?>
	</ul>	
</div>

<?php if ($banner_zone['type'] == 'slideshow') : ?>
	<script>
	jQuery(document).ready(function($) {
		$('#<?=$unique_id?>').addClass('flexslider').flexslider({
			directionNav: false,
		    animation: "<?=$banner_zone['effect']?>",
		    slideshowSpeed: <?=$banner_zone['speed']?>
		 })
	});
	</script>
<?php endif; ?>
