angular.module('Peaks.Portfolio.Repositories').factory('PortfolioItemsRepository', ['$http', function($http){

  return { 
    getItem : function(id, callback)
    {
      $http.get('/admin_portfolio/item_details/'+id).success(function(data)
        {
          callback(data);
        });
    },    
    saveItem : function(data, callback)
    {

     $http({
          url: '/admin_portfolio/item_edit',
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
    deleteItem : function(id, callback)
    {
      $http.get('/admin_portfolio/item_delete/' + id).success(function(data)
      {
        callback(data);
      });
    }
  }; 
}]);