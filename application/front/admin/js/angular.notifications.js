var notifications = angular.module('notifications', ['ngSanitize']);
notifications.controller('notificationsCtrl', function($scope, $http)
{
	var title = document.title,
		notificationsNbr = 0;

	$scope.notificationsNbr = notificationsNbr;

	console.log('notifications');

	var getData = function(){
    //contenu
	    $http.get('/admin/notifications').success(function(data) {

	    	$scope.items = data;
	      	$scope.notificationsNbr = 0;
	      	angular.forEach($scope.items, function(item){
	      		if (item.is_unread === 1) { 
	      			$scope.notificationsNbr = $scope.notificationsNbr + 1; 
	      		};
	      	});

	      	$scope.notificationsNbr > 0 ? document.title = title + ' ('+$scope.notificationsNbr+')' : document.title = title;

	      	if (notificationsNbr < $scope.notificationsNbr) {
	      		glow();
	      	};

	      	notificationsNbr = $scope.notificationsNbr;
	    });
	 }

	 getData();

	 function glow()
	 {
	 	$('#notifications').addClass('animate');
	 	setTimeout(function(){
	 		$('#notifications').removeClass('animate');
	 	}, 2000);
	 }

	 setInterval(function(){
		$scope.$apply(function() {
			getData();
		});
	 }, 10000);
});