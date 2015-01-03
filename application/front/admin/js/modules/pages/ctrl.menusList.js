angular.module('Peaks.Pages').controller('MenusListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
  var config = {
    section : "pages/menus",
    menu : 'pages',
    getUrl : '/admin_menus/menus_list/',
    deleteUrl : 'admin_menus/menu_delete/',
    getCallBack : function(data)
    {}
  }

  $scope.table = [
      {title : 'Nom', param : 'name', strong : true}
    ];

  $scope.pageTitle = 'Menu';

  $scope.thumbPath = '';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});	
}])