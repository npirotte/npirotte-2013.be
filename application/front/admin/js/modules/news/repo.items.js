angular.module('Peaks.News.Repositories').factory('NewsItemsRepository', ['$http', function($http){

  return { 
  	GetItem : function(id, callback)
  	{
      $http.get('/admin_menus/item_details/'+id)
          .success(function(data)
          {
            callback (data);
          });
  	},
  	SaveItem : function(data, callback)
  	{
      $http({
          url: '/admin_menus/item_edit',
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
    ReorderItem : function(data, callback)
    {
      $http({
          url: '/admin_menus/item_reorder',
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
      $http.get('/admin_menus/item_delete/'+id)
          .success(function(data)
          {
            callback (data);
          });
  	}
  }

 }]);