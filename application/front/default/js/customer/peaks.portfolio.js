(function()
{
	'use strict';

	MyPeaks.prototype.PorfolioWidget = function()
	{
		var _this = this,
			$linkList = $('#portfolio-grid').find('.porfolio_categories_list'),
			$links = $linkList.find('a'),
			$gridContainer = $('#caption-list');

		$links
			.addClass('no-ajax')
			.click(function(event)
			{
				event.preventDefault();
				var categoryId = $(this).data('id');

				$links.parent().removeClass('active');

				if (categoryId) {
					$(this).parent().addClass('active');
				};

				$gridContainer.css('opacity', 0);

				$.get(baseVars.applicationPath + 'portfolio/thumb_list/' + baseVars.lang + '/' + (categoryId ? categoryId : ''), function(data)
				{
					$gridContainer.html(data);
					$gridContainer.css('opacity', 1);
				});
			});
	}
})();