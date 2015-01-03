angular.module('Peaks.Portfolio').controller('PortfolioListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
  var config = {
    section : "portfolio/portfolios",
    menu : 'portfolio',
    getUrl : '/admin_portfolio/portfolio_list/',
    deleteUrl : 'admin_portfolio/delete/'
  }

  $scope.table = [
      {title: '', param : 'src', width: '60px'},
      {title : 'Titre', param : 'name', strong : true},
      {title : 'Nombre d\éléments', param : 'childs_count'}
    ];

  $scope.pageTitle = 'Galleries';
  $scope.thumbPath = 'portfolio';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});
}])