admin.directive('iconsPicker', ['iconsRepository', function(iconsRepository){

	return {
		scope: {
			icon : '=ngModel'
		},
		template: '<script type="text/ng-template" id="customTemplate.html"><a><i class="fa {{match.label}}"></i>&nbsp;&nbsp;<span ng-bind-html="match.label | typeaheadHighlight:query" ></span></a></script><div class="input-group"><input class="form-control" type="text" ng-model="icon" typeahead="icon for icon in faIcons | filter:$viewValue | limitTo:8" typeahead-template-url="customTemplate.html" class="form-control" /><div class="input-group-addon"><i class="fa {{icon}}"></i></div></div>',
		link: function(scope, iElm, iAttr, controller)
		{
			scope.faIcons = [];

			iconsRepository.IconList(function(data)
			{
				scope.faIcons = data;
			});
		}

	}
}]);

admin.factory('iconsRepository', ['$http', function($http){

	var iconsCache = false;

  	return { 
        IconList : function(callback)
        {
        	if (iconsCache) {
        		callback(iconsCache);
        		return;
        	};

         	$http.get('/admin_helpers/icons_list')
            .success(function(data)
            {
            	iconsCache = data;
              	callback(iconsCache);
            });
        }
     }; 
}]);
