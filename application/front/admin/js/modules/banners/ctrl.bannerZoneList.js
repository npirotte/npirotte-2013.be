angular.module('Peaks.Banners').controller('BannerZoneListCtrl', ['$scope', '$http','$injector', function($scope, $http, $injector){
	  var config = {
	    section : "banners/zones",
	    menu : 'banners',
	    getUrl : '/admin_banners/bannerzone_list/',
	    deleteUrl : 'admin_banners/delete_bannerzone/'
	  }

	  $scope.table = [
	      {title : 'Nom', param : 'name'},
	      {title : 'Nombre de bannières', param : 'childs_count'}
	    ];

	  $scope.pageTitle = 'Zones de bannière';

	  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});	
}]);
