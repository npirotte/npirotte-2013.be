<section id="portfolio-list" class="side-bar-template">
	<aside>
		<div class="tools">
			<a href="<?=site_url($lang);?>" class="btn"><i class="fa fa-home"></i></a>

			<a href="javascript:void(0)" class="btn toggleAside"><i class="fa fa-bars"></i></a>
		</div>
		<h1><?=$title?></h1>
		<div class="categories">
			<?=portfolio_categories_list($category_id)?>
		</div>
	</aside>
	
	<div class="page">
		<?=$list?>
	</div>
</section>