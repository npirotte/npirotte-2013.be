angular.module('Peaks.Global.Repositories').factory('TagsRespository', ['$http', function($http){

	var userInfosCache = new Array();

  	return { 
        tagNamesList : function(callback)
        {
          $http.get('/admin_global/tag_name_list')
            .success(function(data)
            {
              callback(data);
            });
        }
     }; 
}]);
