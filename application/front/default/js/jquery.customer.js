/* code by n.pirotte */

// function libraries

var initialPage;

function menuToggle()
{
	var $body = $('body');

	$('#menu-toggle').click(function(event)
	{
		$body.addClass('menu-open');
	});

	$('[data-close="main-menu"], #main-menu a').click(function(event)
	{
		$body.removeClass('menu-open');
	});
}

function menuActivity () 
{
	'use strict';

	var topMenu = $("#main-nav"),
		$menuItems = topMenu.find("a"),
		$cursor = $('#cursor'),
		$frames = $('.frame'),
		regexp = /^\d$/,
		position = 0;

	function cursorPosition (position) {
		$cursor.css('top', 40+40*position);
	}

	function opacityControl (position) {
		switch (position)
		{
			case 0 :
				$('#main-nav').css('opacity', 0);
				break;
			case 4 : 
				$('#main-nav a[data-target="+"]').css('opacity', .4);
				break;
			default : 
				$('#main-nav').css('opacity', 1);
				$('#main-nav a[data-target="+"]').css('opacity', 1);
				break;
		}
	}

	function scollSpy() {
		// Cache selectors

		var lastId,    
	    // Anchors corresponding to menu items
	    scrollItems = $menuItems.map(function(){
	      var item = $($(this).attr("href"));
	      if (item.length) { return item; }
	    });

		// Bind to scroll
		function checkTheScroll () {

		}
		$(window).scroll(function(){
		   // Get container scroll position
		   var fromTop = $(this).scrollTop();
		   
		   // Get id of current scroll item
		   var cur = scrollItems.map(function(){
		     if ($(this).offset().top-20 < fromTop)
		       return this;
		   });
		   // Get the id of the current element
		   cur = cur[cur.length-1];
		   var id = cur && cur.length ? cur[0].id : "";
		   
		   if (lastId !== id) {
		       lastId = id;
		       // Set/remove active class
		       // menuItems
		       //   .parent().removeClass("active")
		       //   .end().filter("[href=#"+id+"]").parent().addClass("active");
		       position = parseInt($('#'+id).attr('data-frame'));
		       cursorPosition(position);
				opacityControl(position);
				window.location.hash = '/'+id;
		   }                   
		});

	}

	function init () {
		var location = window.location.hash;
			/*if (location) {
				var id = location.replace('/', '');
				position = parseInt($(id).attr('data-frame'));
				var offSet = $(id).offset().top;
				opacityControl(position);
				$('body, html').scrollTop(offSet);
			};	*/
	}

	init();


	scollSpy();

	$('a[data-target]').click(function(e){
		e.preventDefault();
		e.stopPropagation();

		var action = $(this).attr('data-target');

		if (!regexp.test(action)) {
			
			switch (action)
			{
				case '-' :
					action = position-1;
					break;
				case '+' : 
					action = position+1;
					break;
			}
		}

		var frameOffSet = $('section[data-frame='+action+']').offset().top;
		$('body, html').animate({scrollTop: frameOffSet}, 400);
	});
}

// intro frame height

function setIntroHeight (h, w) 
{
	var element = document.getElementById('home'); 
	element.style.height = h+'px';
	element.style.fontSize = w*0.045+'px';
	//$('#intro').css('height', h);

	// element = document.getElementsByClassName('flexslider'); 
	// element[0].style.height = h+'px';
	// //$('#intro').css('height', h);
}


// ajax navigation // dev : n.pirotte ////////////////////////////////

var scrollPosition;


function killView ()
{	
	$('a[data-action="killView"], .media img').click(function(e){
		e.preventDefault();
		$('#container').fadeIn();
		$('#ajax-frame').fadeOut();
		$('body, html').animate({scrollTop: scrollPosition}, 0);
	var stateObj = { foo: 1000 + Math.random()*1001 };
		history.pushState(stateObj, "ajax page loaded...", '/#/portfolio');
	});

}

$.fn.formFocus = function()
{
	'use strict';
	var self = $(this);
	$(this).each(function()
	{
		var icon = $(this).parent().find('i');
		$(this).focus(function()
		{
			icon.addClass('active');
		});
		$(this).blur(function()
		{
			icon.removeClass('active');
		});
	});
}

$.fn.getNews = function ()
{
	'use strict';
	var $items = $(this),
		$container = $('#news-view').parent();

	$(this).each(function ()
	{
		var $self = $(this),
			id = $self.find('a').attr('data-id');

		$self.find('a').click(function(e)
		{
			e.preventDefault();
		});
		
		$self.click(function(e)
		{
			e.preventDefault();
			console.log(id);
			$container.css('opacity', 0);
			
			$.ajax({
				url: '/news/get_news_ajax/'+id,
				cache: true,
				success: function (data) {
					// remplissage du contenu
					$container.html(data);
					// gestion de l'active
					$items.removeClass('active');
					$self.addClass('active');
				},
				error: function (data) {

				},
				complete: function (data) {
					//$container.unblock(); 
					$container.css('opacity', 1);
				}
			});

		});
	});
}

function ReinitializeAddThis(){
	var script = 'http://s7.addthis.com/js/250/addthis_widget.js#domready=1';
	if (window.addthis) {
	    window.addthis = null;
	    window._adr = null;
	    window._atc = null;
	    window._atd = null;
	    window._ate = null;
	    window._atr = null;
	    window._atw = null;
	}
	$.getScript(script);
}

function portfolioViewHeight(w, h)
{
	var element = document.getElementById('portfolio-view'); 
	$('#portfolio-view').css('min-height', h);
}

function initGlobal (parent)
{
	$.pageLoader();
	$('[data-toggle="tooltip"]').tooltip();
}

function initPortfolioPage (frameId)
{
	killView(frameId);
	if ( initialPage == 'home') {
		ajaxify($('#ajax-frame'));
		$('[data-toggle="tooltip"]').tooltip();
	};

	var h = $(window).height(),
		w = $('body').width();
	portfolioViewHeight(w, h);
	$(window).resize(function () {
		h = $(window).height();
		w = $('body').width();
		portfolioViewHeight(w, h);
	});	

	$('.toggleAside').toggleAside();
}


$(document).ready(function() {
	//initGlobal ();
	//1menuToggle();
});