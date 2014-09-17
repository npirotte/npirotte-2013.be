/* code by n.pirotte */

/*mailRegexp*/

(function(){
	'user strict';

	var mailRegexp = /\b[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}\b/,
		slugRegexp = /^[a-zA-Z0-9\-]+$/,
		numberRegexp = /^[0-9]+$/,
		passwordRegexp = /^.{4,12}$/,
		phoneRegexp = /^[0-9]{2,3}-? ?[0-9]{6,7}$/;

	// tooltip alertes formulaire ///

	function formTooltips () {
		$('.alertRequired').mouseenter(function () {
			$(this).next().stop().fadeIn();
		});
		$('.alertRequired').mouseleave(function () {
			$(this).next().stop().fadeOut();
		});
	}

	$.fn.formValidation = function () {

		console.log('errorCount');

		var self = this,
			$self = $(this),
			$submitBtn = $('button[data-role="submit"]'),
			$inputs = $self.find('input[type="text"], input[type="password"], input[type="email"], input[type="url"], input[type="tel"], select, textarea');
			$textareas = $self.find('textarea'),
			$selects = $self.find('select');
			errorCount = 0;

		$inputs.after('<i class="icon-exclamation-sign alertRequired hide"></i><span class="alertMessage"></span>');
		formTooltips();


		$.fn.formatValidation = function(type, value) {
			var formaErrors = 0,
				message = 'coucou';
			 	$self = $(this);
			// sur le type 
			if (type && value) {
				var regexp = '',
					message = '';
				switch (type)
				{
					case 'email' :
						regexp = mailRegexp;
						message = 'Ce champ doit être un email';
						break;
					case 'slug' :
						regexp = slugRegexp;
						message = 'Ce champ ne peut contenir que des chiffres, lettres, et tiret';
						break;
					case 'new_password' :
						regexp = passwordRegexp;
						message = 'Votre mot de passe doit contenir entre 4 et 12 caractères';
						break;
					case 'phone' :
						regexp = phoneRegexp;
						message = 'Ce champ doit être un telephone';
						break;
					case 'number' :
						regexp = numberRegexp;
						message = 'Ce champ doit être nombre';
						break;
				}
				if ( !regexp.test(value) ) {
					++formaErrors;
					errorMessage = message;
				}
			}
			// sur le max lenght
			var maxLength = $self.attr('data-length');
			if ( maxLength != undefined ) {
				if ( value.length > maxLength ) {
					++formaErrors;
					errorMessage = 'Ce champ doit comporter au maximum '+maxLength+' caractères';
				};
			}
			// sur le requis
			if ( $self.attr('data-required') == 'true' && value == '? undefined:undefined ?' || $self.attr('data-required') == 'true' && !/^\s*\S.*$/.test(value) ) {
				++formaErrors;
				errorMessage = 'Ce champ est requis';
			}

			if (formaErrors != 0 ) {
				++errorCount;
				$self.addClass('error').next().show();
				$self.parent().find('.alertMessage').text(errorMessage);
			} else {
				$self.removeClass('error').next().hide();
				$self.parent().find('.alertMessage').text('');
			}
		}

		var validate = function () {
			errorCount = 0;

			$inputs.each(function() {
				var $self = $(this),
					type = $self.attr('data-format'),
					value = $self.val();

				$self.formatValidation(type, value);
			});

			console.log(errorCount);

			if ( errorCount == 0) {
				$submitBtn.removeAttr("disabled");
			} else {
				$submitBtn.attr("disabled", "disabled");
				return false;
			};

		}

		$inputs.keyup(function () {
			validate();
		});

		$inputs.change(function () {
		 	validate();
		});

		// $textareas.focus(function () {
		// 	validate();
		// });

		validate();
	}

})();