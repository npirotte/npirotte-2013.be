<div id="fb-root"></div>
<script>(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=447282875323077";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<div id="news-list">
	<aside>
		<div class="tools">
			<a href="<?=site_url()?>" data-action="killView" class="btn"><i class="fa fa-home"></i></a>
			<a href="<?=$news->CategorySlug()?>" class="btn" data-action="ajax-portfolio" data-toggle="tooltip" data-placement="bottom" data-original-title="Toutes les news"><i class="fa fa-bars"></i></a>

		</div>
		<br>
		<h2>News</h2>
		<hr>
		<div id="last-news">
			<h3>Dernières news :</h3>
		</div>
	</aside>
	<section>
		<br>
		<article id="news-view">
			<div id="news-container">
				<header>
					<h1><?=$news->title?></h1>
				</header>
				<div>
					<?=$news->content?>
				</div>
			</div>
			<footer id="news-footer">
				
				<div class="pull-right">
					<div class="pull-right" id="poster-img">
						<img src="<?=$news->UserSrc("50x50")?>" width='50px' alt="<?=$news->createdBy?>">
					</div>
					<div class="pull-right" id="poste-info">
						Le <strong id="date"><?=$news->Date()?></strong><br>
						Par <em id="person_name"><?=$news->createdBy?></em>
					</div>
				</div>
			</footer>

			<div class="fb-comments" data-href="<?=current_url()?>" data-width="600" data-num-posts="10"></div>

		</article>
	</section>
</div>

<script>
	//initPortfolioPage(3);
	 FB.XFBML.parse();
	 ReinitializeAddThis();
</script>


