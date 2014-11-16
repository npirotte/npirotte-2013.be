//'use strict';

var AnimationsService;

;(function()
{
	var DEFAULT = {
		Delay : 400,
		InClass : 'in',
		OutClass : 'out',
		$element : $('body')
	};

	AnimationsService = function(options)
	{
		this._options = $.extend(DEFAULT, options);
	}

	AnimationsService.prototype.ComeIn = function()
	{
		this._options.$element.addClass(this._options.InClass);
	}

	AnimationsService.prototype.GoOut = function()
	{
		var _this = this,
			dft = new jQuery.Deferred();

		this._options.$element.addClass(this._options.OutClass);
		this._options.$element.removeClass(_this._options.InClass);

		setTimeout(function()
		{
			_this._options.$element.removeClass(_this._options.OutClass);
			dft.resolve();
		}, this._options.Delay);

		return dft.promise();
	}
})();