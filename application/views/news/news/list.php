<div id="news-list">
	<aside>
		<div class="tools">
			<a href="<?=site_url(array('fr'));?>" data-action="killView" class="btn"><i class="fa fa-home"></i></a>
		</div>
		<h1><?=$category['name']?></h1>
	</aside>

	<section class="container">
		<br>
		<?php foreach ($news_list as $news): ?>
			<article id="news_<?=$news->id?>">
				<div class="row">
					<div class="col-md-2">
						<img src="<?=$news->Src('180x180')?>" alt="<?=$news->title?>">
					</div>
					<div class="col-md-10">
						<h2><?=$news->title?></h2>
						<p><i class="fa <?=$news->icon?>"></i>  <?= $news->Date() ?></p>
						<p><?=$news->resume?></p>
						<?=anchor($news->Slug(), 'Voir plus');?>
					</div>
				</div>
			</article>	
		<?php endforeach; ?>
	</section>
</div>

<script>
	//initPortfolioPage(3);
</script>

