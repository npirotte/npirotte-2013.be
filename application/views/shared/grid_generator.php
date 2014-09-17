<div class="row">
	<?php $i=0; foreach ($cols as $col) : ?>
	<div class="col-sm-<?=$col->width?> col-<?=$i?>">
		<div class="<?=$col->cssClass?>">
			<?php switch($col->type)
			{
				case 'text':
				case 'rawHtml':
					echo $col->content;	
					break;
				case 'img':
					$image = array('src' => 'assets/image/pages/0x0/'.$col->content, 'alt' => $col->altText);
					echo img($image);
					break;

			} ?>
		</div>
	</div>
	<?php $i++; endforeach; ?>	
</div>