angular.module('Peaks.Manager.Directives').directive('activationMessage', function(){
  // Runs during compile
  return {
    //require: 'ngModel',
    template: '<div class="alert alert-warning alert-dismissable"><button type="button" data-dismiss="alert" class="close" aria-hidden="true">&times;</button>Ce compte n\'est pas encore activé. <a href="javascript:void(0)" ng-click="activateUser()">Forcer l\'activation</a></div>',
    // name: '',
    // priority: 1,
    // terminal: true,
    // scope: {}, // {} = isolate, true = child, false/undefined = no change
    controller: function($scope, $element, $attrs, $transclude, $http) {
      $scope.activateUser = function()
      {
        $scope.alert = "Activation…";
        showAlert();

          $http({
            url: '/admin_manager/activate_user/' + $scope.item.user_id,
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
                console.log(data);
                $scope.alert = data.message;
                $scope.item.active = 1;
                showFadeAlert(); 
            }).error(function (data, status, headers, config) {
                $scope.alert = 'Une erreure est survenue.';
                showFadeAlert();
                console.log(data);
            });
      }
    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    // templateUrl: '',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    // link: function($scope, iElm, iAttrs, controller) {
      
    // }
  };
});