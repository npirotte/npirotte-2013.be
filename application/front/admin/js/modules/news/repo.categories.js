angular.module('Peaks.News.Repositories').factory('NewsCategoriesRepository', ['$http', function($http){

  return { 
  	GetItem : function(id, callback)
  	{
      $http.get('/admin_news/get_category/'+id)
          .success(function(data)
          {
            callback (data.content_items);
          });
  	},
  	/*SaveItem : function(data, callback)
  	{
      $http({
          url: '/admin_menus/menu_edit',
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
  	DeleteItem : function(id, callback)
  	{
      $http.get('/admin_menus/menu_delete/'+id)
          .success(function(data)
          {
            callback (data);
          });
  	}*/
  }

 }]);