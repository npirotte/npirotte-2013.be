angular.module('Peaks.Contacts.Directives').directive('unreadMessagesNbr', ['ContactsRepository', '$interval', function(contactsRepository, $interval){
	// Runs during compile

	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div><span class="number">{{messagesNbr}}</span><br /><small>Nouveau(x) message(s)</small></div>',
		// templateUrl: '',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, iElm, iAttrs, controller) {

			function getData()
			{
				contactsRepository.unreadMessagesNbr(function(data)
				{
					scope.messagesNbr = data.count;
				});
			}

			getData();

			var interval = $interval(function(){getData()}, 30000);

			scope.$on('$destroy', function()
			{
				$interval.cancel(interval);
			})
		}
	};
}]);