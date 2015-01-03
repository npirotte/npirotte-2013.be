
angular.module('Peaks.Manager.Directives').directive('managerUserInfos', ['UsersRepository', function(usersRepository){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: { userId : '=userid'}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs, $transclude) {
			usersRepository.userInfos($scope.userId, function(data)
				{
					$scope.user = data;
				});
		},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<a href="#/manager/users/{{userId}}" >{{user.first_name}} {{user.last_name}}</a>',
		// templateUrl: '',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		//link: function($scope, iElm, iAttrs, controller) {}
	};
}]);