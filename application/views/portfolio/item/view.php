<section id="portfolio-view" class="side-bar-template">
	<aside>
		<div class="tools">
			<a href="<?=site_url($lang);?>" class="btn"><i class="fa fa-home"></i></a>

			<a href="<?=site_url(array($lang, 'portfolio', $category))?>" class="btn toggleAside"><i class="fa fa-bars"></i></a>

			<?php if (isset($navigationViewModel['prev'])):?>
				<a href="<?=$navigationViewModel['prev']->Slug()?>" class="btn"><i class="fa fa-angle-left"></i></a>
			<?php endif; ?>
			<?php if (isset($navigationViewModel['next'])):?>
				<a href="<?=$navigationViewModel['next']->Slug()?>" class="btn"><i class="fa fa-angle-right"></i></a>
			<?php endif; ?>

		</div>
		<h1><?=$itemViewModel['name']?></h1>
		<div class="dscription">
			<?=$itemViewModel['description']?>
		</div>
	</aside>

	<ul class="medias">
		<?php foreach($imagesViewModel as $image): ?>
			<li>
				<img src="<?=$image->Src()?>" alt="<?=$image->alt?>" title="<?=$image->title?>">
			</li>
		<?php endforeach; ?>
	</ul>

</section>