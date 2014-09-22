// duplication de la classe Core pour garder le core intact
// toute méthode Core seront appliquée à MyPeaks

function MyPeaks()
{
		Peaks.apply(this, arguments);
}

MyPeaks.prototype = new Peaks();

;(function()
{
	MyPeaks.prototype.CustomerInitPage = function()
	{
		var _this = this;

		this.$context.find('#menu-toggle').click(function()
		{
			menuToggle();
		});
	}
})();