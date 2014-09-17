<li class="<?=$cssclass?>">
	<?php if($url != ''): ?>
		<a <?php if($target) echo('target="_blank"')?> href="<?=$url?>"><?=$name?></a>
	<?php else : ?>
		<span><?=$name?></span>
	<?php endif; ?>
	
	<?php if(count($nodes) > 0): ?>
	<ul class="sub-menu">
		<?php foreach ($nodes as $node) {
			echo print_menu_item($node);
		} ?>
	</ul>
<?php endif; ?>
</li>