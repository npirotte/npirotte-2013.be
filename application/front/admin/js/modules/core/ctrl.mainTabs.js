angular.module('admin').controller('MainTabsCtrl', ['$scope', 'ScopeCacheProvider', function($scope, scopeCacheProvider){
	
	$scope.tabs = [];

	$scope.$on('TabCreated', function(event, data)
	{
		console.log(data);
		$scope.tabs.push(data);
		console.log($scope.tabs);
	});
}]);