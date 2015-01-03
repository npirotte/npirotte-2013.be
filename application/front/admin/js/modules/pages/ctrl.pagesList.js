angular.module('Peaks.Pages').controller('PageListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
  var config = {
    section : "pages/pages",
    menu : 'pages',
    getUrl : '/admin_pages/pages_list/',
    deleteUrl : 'admin_pages/pages_delete/'
  }

  $scope.table = [
      {title : 'Nom', param : 'name', strong : true},
      {title: 'Langue', param : 'lang'},
      {title: 'Versions', param : 'version'}
    ];

  $scope.pageTitle = 'Pages';

  $scope.thumbPath = 'users~thumbs';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});
}])