admin.factory('tagsRespository', ['$http', function($http){

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

admin.factory('StylesheetsRespository', ['$http', function($http){

  var userInfosCache = new Array();

    return { 
        StyleSheetDetails : function(id, callback)
        {
          $http.get('/admin_global/stylesheet_details/' + id)
            .success(function(data)
            {
              callback(data);
            });
        },
        StyleSheetSave : function(data, callback)
        {
          $http({
            url: '/admin_global/stylesheets_edit',
            method: "POST",
            data: data,
            headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
                  console.log(data);
                  callback(data);
              }).error(function (data, status, headers, config) {
                  alert = 'Une erreure est survenue.';
              });
        },
        ContentDetails : function(id, callback)
        {
          $http.get('/admin_global/stylesheets_content_details/' + id)
            .success(function(data)
            {
              callback(data);
            });
        }
     }; 
}]);
