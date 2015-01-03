angular.module('Peaks.Manager.Directives').directive('serveUsage', ['$http', function($http){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div google-chart chart="chart" style="{{chart.cssStyle}}" on-ready="chartReady()"/>',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
			function serverUsagePie(appSize, assetsSize, cacheSize, total)
			{


				var chart1 = {};
			    chart1.type = "PieChart";
			    chart1.displayed = false;
			    chart1.cssStyle = "height:200px; width:100%;";
			    chart1.data = {"cols": [
			        {id: "disk", label: "Disque", type: "string"},
			        {id: "database", label: "Base de donnée", type: "number"}
			    ], "rows": [
			        {c: [
			            {v: "Application"},
			            {v: appSize, f: appSize/1000000+" Mo"}
			        ]},
			        {c: [
			            {v: "Données"},
			            {v: assetsSize, f: assetsSize/1000000+" Mo"}
			        ]},
			        {c: [
			            {v: "Cache"},
			            {v: cacheSize, f: cacheSize/1000000+" Mo"}
			        ]},
			        {c: [
			            {v: "Libre"},
			            {v: total - appSize - assetsSize - cacheSize , f: ( total - appSize - assetsSize - cacheSize ) /1000000 +" Mo sur " + total/1000000+" Mo"}
			        ]}
			    ]};

			    chart1.options = {
			        "title": "Utilisation du serveur",
			        "isStacked": "true",
			        "fill": 20,
			        "pieHole": 0.3,
			        "pieSliceText": 'none',
			        "animation":{
				        duration: 1000,
				        easing: 'out',
				      },
			        "displayExactValues": true,
			        slices: {
			            0: { color: '#7FFF00' },
			            1: { color: '#9d261d' },
			            2: { color: '#1a1a1a' },
			            3: { color: '#eee' }
			          }
			    };

			    chart1.formatters = {};

			    $scope.chart = chart1;


			    $scope.chartReady = function () {
			        fixGoogleChartsBarsBootstrap();
			    }

			    function fixGoogleChartsBarsBootstrap() {
			        // Google charts uses <img height="12px">, which is incompatible with Twitter
			        // * bootstrap in responsive mode, which inserts a css rule for: img { height: auto; }.
			        // *
			        // * The fix is to use inline style width attributes, ie <img style="height: 12px;">.
			        // * BUT we can't change the way Google Charts renders its bars. Nor can we change
			        // * the Twitter bootstrap CSS and remain future proof.
			        // *
			        // * Instead, this function can be called after a Google charts render to "fix" the
			        // * issue by setting the style attributes dynamically.

			        $(".google-visualization-table-table img[width]").each(function (index, img) {
			            $(img).css("width", $(img).attr("width")).css("height", $(img).attr("height"));
			        });
			    };
			} 

			$http.get('/admin_manager/server_charge').success(function(data) {
				console.log(data);
			      serverUsagePie(parseInt(data.appSize), parseInt(data.assetsSize), parseInt(data.cacheSize), parseInt(data.serverSize));
			      console.log(data);
			 });

		}
	};
}]);