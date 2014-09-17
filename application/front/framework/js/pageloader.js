/**
 *
 * @author	Benoit Asselin <contact(at)ab-d(dot)fr>
 * @version	javascript.js, 2012/12/31
 *
 */


(function($) {
	'use strict';
	
	/**
	 * Loader de page
	 */
	$.pageLoader = function() {
		// Selection des images en src="
		var $elements = $('body').find('img[src]');
		// Selection des images en background-image
		$('body [style]').each(function() {
			var src = $(this).css('background-image').replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
			if(src && src != 'none') {
				$elements = $elements.add($('<img src="' + src + '"/>'));
			}
		});
		
		
		
		var $chargement = $('#loader'),
			$chargementInfos = $('#loading-bar'),
			elementsCharges = 0,
			dureeMs = 1000;
		
		function animateStep(now, fx) {
			$chargementInfos.text(parseInt(now)+'%');
		}
		
		function chargementEnCours() {
			var pourcentage = 0;
			if($elements.length) {
				pourcentage = parseInt((elementsCharges / $elements.length) * 100);
			}
			
			// Affichage du pourcentage
			$chargementInfos
				.stop() // stop les anciennes animations
				.animate({width:pourcentage + '%'}, dureeMs);
			$chargement
				.stop() // stop les anciennes animations
				.animate({pourcentage:pourcentage}, {
					duration: dureeMs,
					step: animateStep
				});
		}
		
		function chargementTermine() {
			var pourcentage = 100;
			
			// Affichage du pourcentage
			$chargementInfos
				.stop() // stop les anciennes animations
				.animate({width:pourcentage + '%'}, (dureeMs / 2));
			$chargement
				.stop() // stop les anciennes animations
				.animate({pourcentage:pourcentage}, {
					duration: (dureeMs / 2),
					step: animateStep
				})
				// Disparition du chargement et affichage de la page
				.fadeOut();
			
		}
		
		// La page contient des elements permettant d'afficher une barre de progression
		if($elements.length) {
			chargementEnCours();
			
			$elements.load(function() {
				$(this).off('load');
				elementsCharges++;
				chargementEnCours();
			});
		}
		
		$(window).load(function() {
			// La page est integralement chargee
			chargementTermine();
		});
		
	};
	
	
	
})(jQuery);


