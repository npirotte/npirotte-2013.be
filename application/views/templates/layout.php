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

<!-- The Gallery as lightbox dialog, should be a child element of the document body -->
<div id="blueimp-gallery" class="blueimp-gallery">
    <div class="slides"></div>
    <h3 class="title"></h3>
    <a class="prev">‹</a>
    <a class="next">›</a>
    <a class="close">×</a>
    <a class="play-pause"></a>
    <ol class="indicator"></ol>
</div>
