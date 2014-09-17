<article id="news-view">
	<div id="news-container">
		<header>
			<h2><a class="title" href="<?= $news_item->Slug(); ?>"><?=$news_item->title?></a></h2>
		</header>
		<div class="news-content">
			<?=$news_item->resume?>
		</div>
	</div>
	<footer id="news-footer">
		<div class="pull-right">
			<div class="pull-right poster-img" id="poster-img">
				<img src="<?= $news_item->UserSrc('60x60')?>" alt="<?=$news_item->createdBy?>">
			</div>
			<div class="pull-right poster-info" id="poster-info">
				Le <strong id="date" class="date"><?=$news_item->Date()?></strong><br>
				Par <i id="person_name" class="person-name"><?=$news_item->createdBy?></i>
			</div>
		</div>
	</footer>
</article>