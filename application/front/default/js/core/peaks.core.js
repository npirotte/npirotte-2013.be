var Peaks = function(context, options)
{
	var defaultOptions = {
		PageSelector : '#container',
		EnableAjax : true,
		EnableHistory : true
	}

	this.config = $.extend(defaultOptions, options);
	this.context = context;
	this.$context = $(context);
	this.$page = this.$context.find(this.config.PageSelector); 
	this.currentUrl = window.location.href;
}

;(function()
{
	Peaks.prototype.InitPage = function($context)
	{
		var _this = this;

		if (!$context) 
		{
			$context = _this.$context;
		};

		if (typeof _this.CustomerInitPage === 'function') {
			_this.CustomerInitPage();
		};
	}
})();