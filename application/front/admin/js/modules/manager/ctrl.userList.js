// manager /////////////////////// 

angular.module('Peaks.Manager').controller('UserListCtrl', ['$scope', '$http','$injector', function($scope, $http, $injector){
    var config = {
      section : "manager/users",
      menu : 'manager',
      getUrl : '/admin_manager/users_list/',
      deleteUrl : 'admin_manager/delete_user/',
      getCallBack : function(data)
      {
        // traitement du statut utilisateur 
        var i = 0;
        angular.forEach($scope.items, function(item){
          $scope.items[i].statut = item.active == 1 ? 'success' : 'warning';    
          if (item.suspend == 1) $scope.items[i].statut = 'error';
          i++;
        });
      }
    }

    $scope.table = [
        {title: '', param : 'src', width: '60px'},
        {title : 'Nom d\'utilisateur', param : 'username', strong : true},
        {title: 'Email', param : 'email'},
      ];

    $scope.pageTitle = 'Utilisateurs';

    $scope.thumbPath = 'users';

    $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});
}]);