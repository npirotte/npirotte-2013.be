;(function()
{

	function _validateLink($element, url)
	{
		if (!url
			|| $element.hasClass('no-ajax')
	        || $element.attr('target') === "_blank"
	        || $element.attr('target') === "blank"
	        //|| url.match(/^http:\/\//)
	        || url.match(/mailto:/) 
	        || url.match(/javascript:/) 
	        )
	    {
			return false;
		}
		else
		{
			return true;
		}
	}

	Peaks.prototype.Ajaxify = function()
	{
        var _this = this;

        _this.$context.delegate('a', 'click', function(event) {
        	var $_this = $(this),
        		url = $_this.attr('href');

        	if (_validateLink($_this, url)) {
        		event.preventDefault();
        		_this.GetPage(url);
        	};
        });
	}
})();

;(function()
{
	Peaks.prototype.GetPage = function(url, options )
	{
		var _this = this,
			defaultConfig = {
				$target : _this.$page,
				EnableHistory : _this.config.EnableHistory,
				ScrollTop : true
			},
			ajaxConfig = $.extend(defaultConfig, options);
				

		$.ajax({
			url : url,
			cache : true,
			dataType : 'html',
			beforeSend : function()
			{
				if (ajaxConfig.EnableHistory) {
					var stateObj = { foo: 1000 + Math.random()*1001 };
					
					try
		            {
		                history.pushState(stateObj, "ajax page loaded...", url);
		            }
		            catch(e)
		            {
		                console.log(e);
		                window.location.href = url;
		            }
				};

				_this.$context.addClass('loading');
	            ajaxConfig.$target
	                .removeClass('loaded')
	                .addClass('loading');

			},
			success: function(data)
			{
				ajaxConfig.$target.html(data);

				ajaxConfig.$target
	                .removeClass('loading')
	                .addClass('loaded');

	            _this.currentUrl = url;

				if (ajaxConfig.ScrollTop) $('html, body').animate({ scrollTop: 0}, 0);

				if (ajaxConfig.EnableHistory) {
					window.onpopstate = function(e) { 
				        if (_this.currentUrl && _this.currentUrl != window.location.pathname) {
				            _this.GetPage(window.location.href, ajaxConfig.$target);
				        };
				    }
				};
			},
			complete: function()
			{
				_this.$context.removeClass('loading');
				ajaxConfig.$target
	                .removeClass('loading')
	                .addClass('loaded');
			},
			error : function()
			{

			}
		});
	}
})();