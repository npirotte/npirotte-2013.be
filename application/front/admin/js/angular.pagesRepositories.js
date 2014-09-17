admin.factory('templatesRespository', ['$http', function($http){

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


admin.factory('pagesRepository', ['$http', function($http){

  return { 
    getPage : function(id, callback)
    {
      $http.get('/admin_pages/pages_details/'+id).success(function(data)
        {
          callback(data);
        });
    },    
    savePage : function(page_data, template_values, callback)
    {
      var data = {};

      data.page_data = page_data;

      if (page_data.type === 'template') {
        data.template_values = template_values;
      };

       $http({
            url: '/admin_pages/page_edit',
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
    deletePage : function(id, callback)
    {
      $http.get('/admin_pages/pages_delete/' + id).success(function(data)
      {
        callback(data);
      });
    },
    reorder : function(data, callback)
    {
      $http({
            url: '/admin_pages/page_reorder',
            method: "POST",
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
                callback();
                console.log(data);
            }).error(function (data, status, headers, config) {
                alert = 'Une erreure est survenue.';
            });
    },
    getPageOrder : function(id, callback)
    {
      $http.get('/admin_pages/get_page_order/' + id).success(function(data)
      {
        console.log(data);  
        callback(data);
      })
    },
    getPageList : function(lang, callback)
    {
      $http.get('/admin_pages/pages_list/0/0/' + lang).success(function(data)
      {
        console.log(data);  
        callback(data);
      })
    },
    siteMap : function(lang, callback)
    {
      $http.get('/admin_pages/site_map/'+lang).success(function(data)
      {
        callback(data);
      });
    }
  }; 
}]);