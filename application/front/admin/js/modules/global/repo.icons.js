angular.module('Peaks.Global.Repositories').factory('IconsRepository', ['$http', function($http){

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