angular.module('Peaks.Pages.Repositories').factory('TemplatesRepository', ['$http', function($http){

	var templatesCache = new Array();

	return { 
    getTemplate : function(id, callback)
    {
      $http.get('/admin_pages/templates_details/'+id).success(function(data)
        {
          callback(data);
        });
    },
    getTemplateFiles : function(callback)
    {
      $http.get('/admin_pages/template_files_list').success(function(data)
      {
        callback(data);
      })
    },
    getTemplates : function(callback)
    {
      $http.get('./admin_pages/templates_list').success(function(data)
      {
        callback(data);
      });
    },
    saveTemplate : function(data, callback)
    {
       $http({
            url: '/admin_pages/templates_edit',
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
    deleteTemplete : function(id, callback)
    {
      $http.get('/admin_pages/templates_delete/' + id).success(function(data)
      {
        callback(data);
      })
    },
    getTemplateFields : function(id, callback)
    {
      $http.get('/admin_pages/templates_fields_list/' + id).success(function(data)
      {
        callback(data);
      });
    }
  }; 
}]);