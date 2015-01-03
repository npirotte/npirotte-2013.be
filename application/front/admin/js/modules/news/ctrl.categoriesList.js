angular.module('Peaks.News').controller('NewsCategoriesListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
	
  var config = {
    section : "news/categories",
    menu : 'news',
    getUrl : '/admin_news/categories_list/',
    deleteUrl : 'admin_news/category_delete/',
  }

  $scope.table = [
      {title : 'Nom', param : 'name'},
      {title: 'Nbr de news', param : 'childs_count'}
    ];

  $scope.pageTitle = 'Catégories de news';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}]);