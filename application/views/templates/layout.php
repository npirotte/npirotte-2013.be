<?php $this->load->helper('pages/menus') ?>

<div id="fb-root"></div>

<header id="general-header">
	<button id="menu-toggle">
		<span class="bar"></span>
		<span class="bar"></span>
		<span class="bar"></span>
	</button>
</header>

<section id="container">
    <?=$page?>
</section>

<div id="ajax-frame"></div>
<div id="ajax-loader"></div>

<footer id="general-footer">

</footer>

<div id="main-menu">
	<button class="close" data-close="main-menu"></button>
	<?= print_menu('MainMenu') ?>
</div>

<div id="loader">
	<span id="chargement-infos"></span>
	<div id="loading-bar"></div>
</div>
