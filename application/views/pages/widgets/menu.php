<ul class="<?=$menu['cssclass']?>">
	<?php foreach($links as $node)
	{
		echo print_menu_item($node);
	} ?>
</ul>