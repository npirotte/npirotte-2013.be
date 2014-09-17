var installer = installer || angular.module('installer', ['ngRoute']).
  config(
  ['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $routeProvider.
  	  when('/', {templateUrl: '/install/view/0'}).
      when('/step1', {templateUrl: '/install/view/1', controller: Step1Ctrl}).
      when('/step2', {templateUrl: '/install/view/2', controller: Step2Ctrl}).
      when('/step3', {templateUrl: '/install/view/3', controller: Step3Ctrl}).

      otherwise({redirectTo: '/'});
  }]
);

  // validatt zzzzions

var regex = {
    mail : /\b[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}\b/,
    slug : /^[a-zA-Z0-9\-]+$/,
    int : /^[0-9]+$/,
    password : /^.{4,12}$/,
    phone : /^[0-9]{2,3}-? ?[0-9]{6,7}$/
}

var validationError = [];

validationError['fr'] = {
    mail : 'Ce champ doit être au format Email.',
    slug : 'Ce champ ne peut contenir ni espace ni carractères spéciaux.',
    int : 'Ce champ doit être un nombre entier.',
    password : 'Ce champ doit être un nombre entier.',
    phone : 'Ce champ doit être au format téléphone.'
}

angular.module('installer').directive('validation', function() {
  return {
    require: 'ngModel',
    link: function($scope, elm, attrs, ctrl) {
      console.log(attrs.id);
      ctrl.$parsers.unshift(function(viewValue) {
        if (regex[attrs['validation']].test(viewValue) || !viewValue) {
          // it is valid
          ctrl.$setValidity('validation', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('validation', false);
          $scope[attrs.id] = validationError['fr'][attrs['validation']];
          return undefined;
        }
      });
    }
  };
});

angular.module('installer').directive('errorSumary', function(){
  // Runs during compile
  return {
    template: '<div ng-if="errors" class="alert alert-danger alert-dismissable"><button type="button" ng-click="closeAlert()" class="close" aria-hidden="true">&times;</button><ul><li ng-repeat="error in errors">{{error}}</li></ul></div>',
    controller: function($scope, $element, $attrs, $transclude) {
      $scope.closeAlert = function() { $scope.errors = null }
    },
  };
});


angular.module('installer').factory('installerRepository', ['$http', function($http){

    return { 
        CreateConfig : function(data, callback, failBack)
        {
          $http({
            url: '/install/create_config',
            method: "POST",
            data: data,
            headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
                  callback(data);
              }).error(function (data, status, headers, config) {
                  alert('Une erreure est survenue.');
                  failBack();
              });
        },
        CreateDatabase : function(callback, failBack)
        {
          console.log('ok');
          $http.get('/maintenance/forge_database')
            .success(function(data)
            {
              callback(data);
            }).error(function()
            {
              failBack()
            });
        },
        CreateUser : function(data, callback)
        {
          $http({
            url: '/install/create_default_user',
            method: "POST",
            data: data,
            headers: {'Content-Type': 'application/json'}
          }).success(function (data, status, headers, config) {
                  callback(data);
              }).error(function (data, status, headers, config) {
                  alert('Une erreure est survenue.');
              });
        },
        EraseInstaller : function()
        {
          $http.get('/install/erase_installer');
        }
     }; 
}]);

/* controller */

function Step1Ctrl($scope, installerRepository)
{

  $scope.working = false;
  $scope.message = '';

  $scope.data = {
    configData : {
      sitename : ''
    },
    dbData : {
      hostname : 'localhost',
      databaseName : '',
      username : '',
      password : '',
      prefix : 'nyp_'
    }
  }

  $scope.submitData = function()
  {
    if (!$scope.working) {
      //window.location.hash = '#/step2';
      $scope.message = 'Création en cours';
      $scope.working = true;
      installerRepository.CreateConfig($scope.data, function(data)
      {
        $scope.message = 'Génération de la base de donnée';
        installerRepository.CreateDatabase(function()
        {
          window.location.hash = '#/step2';
        }, function()
        {
          $scope.message = '';
          $scope.working = false;
        });
      }, function()
      {
        $scope.message = '';
        $scope.working = false;
      });
    };
  }
}

function Step2Ctrl($scope, installerRepository)
{
  $scope.working = false;
  $scope.message = '';
  $scope.submitData = function()
  {

   if ($scope.data.pwd1 != $scope.data.pwd2) {
      return false;
    };

    if (!$scope.working) {
      $scope.working = true;
      $scope.message = '';

      installerRepository.CreateUser($scope.data, function(data)
      {
        console.log(data);
        if (data.errors.length === 0) {
          window.location.hash = '#/step3';
        };
      })
    };
  }
}

function Step3Ctrl($scope, installerRepository)
{
  installerRepository.EraseInstaller();

  $scope.submitData = function()
  {
    window.location.href = '/admin';
  }
}