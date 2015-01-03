angular.module('Peaks.Pages.Directives').directive('pagesSiteMap', ['PagesRepository', function(pagesRepository){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: { currentId : "=current"}, // {} = isolate, true = child, false/undefined = no change
		/*controller: function($scope, $element, $attrs, $transclude) {
		},*/
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		//restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		//template: '<ul><li ng-repeat="node in siteMap">node.title</li></ul>',
		templateUrl: '/admin/view_loader/desktop/shared/widgets/tree',
		//replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		controller: function($rootScope, $scope, $element, $attrs, $transclude) {

			$scope.smallSize = 'small-size';

			function languagesMap(languages)
			{
				var result = {}
				for (var key in languages) {
					result[key] = { KeyName : key, LangName : languages[key]}
				}

				return result;
			}

			$scope.languages = languagesMap(globalVars.siteLanguages);
			$scope.treeCulture = globalVars.defaultLanguage;

			$scope.remove = function(scope) {
		      scope.remove();
		    };

		    $scope.toggle = function(scope) {
		      scope.toggle();
		    };

		    $scope.newSubItem = function(id) {
		      $rootScope.newItem = {parent_id : id, lang : 'fr'};
		      window.location.hash = '/pages/pages/edit/new';
		      console.log(id);
		    };

		    $scope.getPage = function(id)
		    {
		    	window.location.hash = '/pages/pages/edit/' + id;
		    }

		    var getRootNodesScope = function() {
		      return angular.element(document.getElementById("tree-root")).scope();
		    };

		    $scope.collapseAll = function() {
		      var scope = getRootNodesScope();
		      scope.collapseAll();
		    };

		    $scope.expandAll = function() {
		      var scope = getRootNodesScope();
		      scope.expandAll();
		    };

		    $scope.treeOptions = {
			    dropped: function(event) {
			    	var data = {},
			    		parentChildsList;

			    	try 
			    	{
			    		data.parent_id = event.dest.nodesScope.$nodeScope.$modelValue.id;
			    	}
			    	catch(e)
			    	{
			    		data.parent_id = 0;
			    	}

			    	try 
			    	{
			    		data.old_parent_id = event.source.nodesScope.$nodeScope.$modelValue.id;
			    	}
			    	catch(e)
			    	{
			    		data.old_parent_id = 0;
			    	}

			    	data.new_index = event.dest.index;

			    	parentChildsList = event.dest.nodesScope.$modelValue;
			    	data.item_id = parentChildsList[data.new_index].id;

			    	data.lang = 'fr';

			    	if (event.source.index != data.new_index || data.parent_id != data.old_parent_id) {

			    		pagesRepository.reorder(data, function()
			    		{
			    			$rootScope.$broadcast('siteMapUpdatedBySiteMap');
			    		});

			    	};
			    	//console.log(parentChildsList);
			    	
			    	//console.log(data);

			      return true;
			    },
			  };


		  function getData()
		  {
		  	pagesRepository.siteMap($scope.treeCulture, function(data)
		  	{
		  		$scope.data = data;
		  	})
		  }

		  $scope.$watch('treeCulture', function(newValue)
		  {
		  	getData();
		  });

		  getData();

		  $scope.$on('siteMapUpdatedByPageCtrl', function() {
		      getData();
		  });
		}
	};
}]);