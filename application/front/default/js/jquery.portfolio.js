
// filtres

function portfolioFilter ()
{
	'use strict';
	var $linkList = $('#portfolio-grid').find('.porfolio_categories_list'),
		$links = $linkList.find('a'),
		$gridContainer = $('#caption-list');
		//$captions = $gridContainer.find('.portfolio-thumbs-list-widget').find('li');

	$links.addClass('no-ajax');

	$links.click(function(event)
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
	})
}

$.fn.toggleAside = function()
{
	var self = $(this),
		pannel = self.parent().parent().parent();

	function toggle()
	{
		pannel.toggleClass('switched');
	}

	if (panelIsSwitched == false) {
		pannel.removeClass('switched');
	}
	else
	{
		pannel.addClass('switched');
	}

	self.click(function(){ toggle(); panelIsSwitched = !panelIsSwitched; });
}
