angular.module('Peaks.Pages.Repositories' ).factory('MenusItemsRepository', ['$http', function($http){

  return { 
    GetItemsTree : function(menuId, callback)
    {
      $http.get('/admin_menus/items_list/'+menuId + '/true')
          .success(function(data)
          {
            callback (data);
          });
    },
    GetItems : function(menuId)
    {
      return $http.get('/admin_menus/items_list/' + menuId);
    },
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