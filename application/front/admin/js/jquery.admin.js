/* code by n.pirotte */

//click sur tableau

(function($){

	$.fn.showModal = function() {
		$(this).fadeIn().css('top', '20%');
	}

	// min size
	$.fn.minSize = function()
	{
		var self = $(this),
			top = self.offset().top,
			bottom = $(window).height(),
			height = bottom - top;

		self.css('height', height);

		$(window).resize(function()
		{
			bottom = $(window).height();
			height = bottom - top;
			self.css('height', height);
		});
	}

})(jQuery);

function hideModal() 
{
	$('.modal.fade').fadeOut().css('top', '-25%');
}

function menuControl(activeMenu) {

	var currentMenu = document.getElementsByClassName('active')[0];

	if (currentMenu && currentMenu != activeMenu) {
		currentMenu.classList.remove('active');
	};

	if (activeMenu != 'dashboard' && currentMenu != activeMenu) {
		var activeMenu = document.getElementById(activeMenu);

		activeMenu.classList.add('active');
	}
}  

function block()
{
	$('#container').block({ message: '<div class="spinner"></div>', css: { backgroundColor: 'transparent', border: 0, opacity: 0.6}, overlayCSS: { backgroundColor: '#fff' } });
	$('body').addClass('loading');
}

function unBlock(){
	$('#container').unblock(); 
	$('body').removeClass('loading');
}

function init_page(){
	unBlock();

    $('a[href*="#"]').click(function () {
    		var currentHash = window.location.hash,
    			newHash = $(this).attr('href');
    		if (currentHash != newHash) {
    			block();
    			if ($('body').hasClass('open')) $('body').removeClass('open');
    		};
    });

    if (window.location.hash != '#/') {
    	clearInterval(dashboardRefresh);
    };
}

// alert

function showFadeAlert()
{
	$('#mainAlert').addClass('show');
	setTimeout(function(){$('#mainAlert').removeClass('show');},3000);
}

function showAlert()
{
	$('#mainAlert').addClass('show');
}

function fadeAlert()
{
	$('#mainAlert').removeClass('show');
}

// scroll to

$.fn.scrollTo = function()
{
	var offset = $(this).offset();

	$(window).animate({scrollTop: offset.top + 40}, 2000,'easeInOutCubic');

}


jQuery(document).ready(function($) {
	$('#loading').fadeOut();

    $('[data-toggle="tooltip"]').tooltip(); 

    $('#quick-action-modal a').click(function ()
    {
    	$('#quick-action-modal').modal('hide');
    });

    $('#assetTogle, #closeAssets').click(function()
    {
    	$('#assets-manager').fadeToggle();
    })

    $( ".draggable" ).draggable();
    $( ".resizable" ).resizable();
});


// mobile part

$('#toggle-menu').click(function()
{
	$('body').toggleClass('open');
});

// flush cache
function flushCache(cacheType)
{
	if (confirm("Voulez vous supprimer tout le cache de l'application ?")) { // Clic sur OK
       $.ajax({
		  url: "/maintenance/flush_cache/" + cacheType
		})
		  .done(function( data ) {
		    console.log(data);
		  });  
      }
}

// generate GUID

function setGUID()
{
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}

// Session check

function checkSession()
{
	$.getJSON( "/index.php/session/is_connected", function( data ) 
	{
		console.log(data);
		if (data == 0) {
			alert('Votre session a expiré, veuillez vous identifier');
			window.location.reload();
		};
	});
};


//

var checkSessionHandler = setInterval(function()
{
 	checkSession();
}, 10000);


function friendly_url(str,max) {
  if (max === undefined) max = 32;
  var a_chars = new Array(
    new Array("a",/[áàâãªÁÀÂÃ]/g),
    new Array("e",/[éèêÉÈÊ]/g),
    new Array("i",/[íìîÍÌÎ]/g),
    new Array("o",/[òóôõºÓÒÔÕ]/g),
    new Array("u",/[úùûÚÙÛ]/g),
    new Array("c",/[çÇ]/g),
    new Array("n",/[Ññ]/g)
  );
  // Replace vowel with accent without them
  for(var i=0;i<a_chars.length;i++)
    str = str.replace(a_chars[i][1],a_chars[i][0]);
  // first replace whitespace by -, second remove repeated - by just one, third turn in low case the chars,
  // fourth delete all chars which are not between a-z or 0-9, fifth trim the string and
  // the last step truncate the string to 32 chars 
  return str.replace(/\s+/g,'-').toLowerCase().replace(/[^a-z0-9\-]/g, '').replace(/\-{2,}/g,'-').replace(/(^\s*)|(\s*$)/g, '').substr(0,max);
}

/*
 * Fonction de clonage
 * @author Keith Devens
 * @see http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone
 */
function clone(srcInstance)
{
	/*Si l'instance source n'est pas un objet ou qu'elle ne vaut rien c'est une feuille donc on la retourne*/
	if(typeof(srcInstance) != 'object' || srcInstance == null)
	{
		return srcInstance;
	}
	/*On appel le constructeur de l'instance source pour crée une nouvelle instance de la même classe*/
	var newInstance = srcInstance.constructor();
	/*On parcourt les propriétés de l'objet et on les recopies dans la nouvelle instance*/
	for(var i in srcInstance)
	{
		newInstance[i] = clone(srcInstance[i]);
	}
	/*On retourne la nouvelle instance*/
	return newInstance;
}
