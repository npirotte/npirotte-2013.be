angular.module('Peaks.Pages').controller('TemplatesListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
  var config = {
    section : "pages/templates",
    menu : 'pages',
    getUrl : '/admin_pages/templates_list/',
    deleteUrl : 'admin_pages/templates_delete'
  }

  $scope.table = [
      {title : 'Nom', param : 'name'},
    ];

  $scope.pageTitle = 'Templates';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});
}]);