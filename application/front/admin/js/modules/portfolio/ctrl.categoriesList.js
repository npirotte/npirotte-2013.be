angular.module('Peaks.Portfolio').controller('PortfolioCategoriesListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
	
  var config = {
    section : "portfolio/categories",
    menu : 'portfolio',
    getUrl : '/admin_portfolio/categories_list/',
    deleteUrl : 'admin_portfolio/category_delete/'
  }

  $scope.table = [
      {title : 'Titre', param : 'name_' + globalVars.defaultLanguage, strong : true},
      {title : 'Ordre', param : 'weight'},
      {title : 'Nombre d\éléments', param : 'childs_count'}
    ];

  $scope.pageTitle = 'Catégories de porfolios';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}])