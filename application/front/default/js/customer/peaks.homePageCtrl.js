;(function()
{
	MyPeaks.prototype.HomePageCtrl = function()
	{
		var h = $(window).height(),
			w = $('body').width();

		$(window).resize(function () {
			h = $(window).height();
			w = $('body').width();
			setIntroHeight(h, w);
		});	

		setIntroHeight(h, w);
		menuActivity();

		//$('input, textarea').formFocus();

		//canvaIntro();
	}
})();