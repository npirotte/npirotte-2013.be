<?php $this->load->helper('/portfolio/showcase'); ?>
<?php $this->load->helper('/contact/contact'); ?>
<?php $this->load->helper('/news/news'); ?>
<?php $this->load->helper('/banners/banners'); ?>

<nav id="main-nav">
	<ul>
		<li id="cursor"></li>
		<li><a data-target="-"><i class="fa fa-angle-up"></i></a></li>
		<li><a href="#home" data-target="0"><i class="fa fa-home"></i></a></li>
		<li><a href="#presentation" data-target="1"><i class="fa fa-user"></i></a></li>
		<li><a href="#portfolio" data-target="2"><i class="fa fa-picture-o"></i></a></li>
		<li><a href="#news" data-target="3"><i class="fa fa-bullhorn"></i></a></li>
		<li><a href="#contact" data-target="4"><i class="fa fa-envelope-o"></i></a></li>
		<li><a data-target="+"><i class="fa fa-angle-down"></i></a></li>
	</ul>
</nav>

<section id="home" data-frame="0" class="frame">
	<div class="content clearfix">
		<q>Technical skill is mastery of complexity, while creativity is mastery of simplicity.</q><br><small>Chrisopher Zeeman</small>
	</div>
	<footer>
		<a class="next" data-target="+" href="#presentation">v</a>
	</footer>
</section>

<section id="presentation" class="frame" data-frame="1">
	<div class="container">
		<header class="clearfix">
			<h1 class="main-title">Hello, world !</h1>
		</header>
		<?= parse_content($self, $sub_items[1]['content']); ?>
	</div>
	<footer>
		<a class="next" data-target="+" href="#portfolio">v</a>
	</footer>
</section>

<section id="portfolio" class="frame" data-frame="2">
	<!-- <div class="flexslider">
		<ul class="slides">
			<?php media_category($self, 1, 'portfolio_home_slide') ?>
		</ul>
	</div> -->
	<?= banner_zone('homePageBanner') ?>
	<button id="open_portfolio" data-toggle="tooltip" data-placement="top" data-original-title="Toutes réalisations"><i class="fa fa-th"></i></button>
	<div id="portfolio-grid">
		<nav>
			<div class="container-fluid clearfix">
				
					<?php category_list($self) ?>
				
			</div>
		</nav>
		<div class="container-fluid">
			<ul id="caption-list" class="clearfix">
				<div class="grid-sizer"></div>
				<?php media_category($self, '', 'caption_list') ?>
			</ul>
		</div>
	</div>
	<footer>
		<a class="next" data-target="+" href="#contact">v</a>
	</footer>
</section>

<section id="news" class="frame" data-frame="3">
	<div class="container-fluid">
		<header class="clearfix">
			<h1 class="main-title">The news.</h1>
		</header>
		<div class="content row-fluid">
			<div class="span6">
				<?= last_news_item('news') ?>
			</div>
			<div class="span6">
				<?= news_list('news', 4) ?>
			</div>
		</div>
	</div>
	<footer>
		<a class="next" data-target="+" href="#contact">v</a>
	</footer>
</section>

<section id="contact" class="frame" data-frame="4">
	<div class="container-fluid">
		<header class="clearfix">
			<h1 class="main-title">Let's get in touch !</h1>
		</header>
		<div class="content row-fluid">
			<div class="span6">
				<br>
				<?= print_form(5); ?>
			</div>	
			<div class="span6">
				<div class="adress">
					<h2>Nicolas Pirotte</h2>
					<?= print_contact_info_list(0) ?>			
				</div>
			</div>
		</div>
	</div>
</section>

<script>
	$(document).ready(function() {
		initMainPage();
	});
</script>