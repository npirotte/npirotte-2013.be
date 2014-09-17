function getAnalitics ()
	{
		oo.setAPIKey("c745cb2a020a78b6ee0c528bf4a712070f3c6b84");

		$('#visitsNbr, #visitsTime').block({ message: '<img src="/content/framework/img/ajax-loader.gif" alt="Chargement">', css: { backgroundColor: 'transparent', border: 0, opacity: 0.3}, overlayCSS: { backgroundColor: '#fff' } });

		oo.load(function(){

			var visitsNbr = new oo.Timeline("53677304", "30d");

					visitsNbr.addMetric("ga:visits", "Visites");

					visitsNbr.addMetric("ga:newVisits", "Nouvelles");

					visitsNbr.draw('visitsNbr', function(){$('#visitsNbr').unBlock()});

			var visitsTime = new oo.Timeline("53677304", "30d");

					visitsTime.addMetric("ga:timeOnSite", "Temps sur le site (s)");

					visitsTime.draw('visitsTime', function(){$('#visitsTime').unBlock()});

		});
	}