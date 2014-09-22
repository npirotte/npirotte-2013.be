(function()
{
	'use strict';

	MyPeaks.prototype.NewsWidget = function()
	{
		var _this = this,
			$linkList = $('#news-list'),
			$links = $linkList.find('li'),
			$container = $('#news-view').parent();

		$links.find('a').addClass('no-ajax').click(function(event)
		{
			event.preventDefault();
		})

		$links
			.addClass('no-ajax')
			.click(function(event)
			{
				event.preventDefault();
				var categoryId = $(this).find('a').data('id');

				$links.removeClass('active');

				if (categoryId) {
					$(this).addClass('active');
				};

				$container.css('opacity', 0);

				$.get(baseVars.applicationPath + 'news/get_news_ajax/' + (categoryId ? categoryId : ''), function(data)
				{
					$container.html(data);
					$container.css('opacity', 1);
				});
			});
	}
})();