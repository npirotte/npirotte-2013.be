angular.module('Peaks.Manager').controller('GroupListCtrl', ['$scope', '$http','$injector', function($scope, $http, $injector){
	var config = {
	    section : "manager/groups",
	    menu : 'manager',
	    getUrl : '/admin_manager/user_groups_list/',
	    deleteUrl : 'admin_manager/user_group_delete/',
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
      {title : 'Nom', param : 'ugrp_name', strong : true},
    ];

  $scope.pageTitle = 'Groupes d\'utilisateurs';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});	
  
}])