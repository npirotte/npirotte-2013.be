angular.module('Peaks.Portfolio.Repositories').factory('PortfolioCategoriesRepository', ['$http', function($http){

  var categoriesCache = false;

  return { 
    categoriesList : function(callback)
    {
      if (categoriesCache) {
        callback(categoriesCache);
      };
      $http.get('/admin_portfolio/categories_list').success(function(data) {
        callback(data);
        categoriesCache = data;
      });
    },
    getCategory : function(id, callback)
    {
      $http.get('/admin_portfolio/category_details/'+id).success(function(data)
        {
          callback(data);
        });
    },    
    saveCategory : function(data, callback)
    {

     $http({
          url: '/admin_portfolio/category_edit',
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
    deleteCategory : function(id, callback)
    {
      $http.get('/admin_portfolio/category_delete/' + id).success(function(data)
      {
        callback(data);
      });
    }
  }; 
}]);