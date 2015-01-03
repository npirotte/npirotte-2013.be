 var underscore = angular.module('underscore', []);
  underscore.factory('_', function() {
    return window._; // assumes underscore has already been loaded on the page
  });  

var tinymceConfig = {
    plugins: [
        "autolink link image",
        "searchreplace visualblocks fullscreen importcss",
        "table contextmenu paste"
    ],
    skin : 'light',
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image",
    content_css : globalVars.app_url + "front/cache/default_combined.css?"+new Date().getTime(),
    importcss_selector_filter : /^\.(btn|label|alert|hero-unit|well|text)/,
     importcss_groups: [
        {title: 'Boutons', filter: /^\.btn/}, // td.class and tr.class
        {title: 'Texte', filter: /^\.text/}, // td.class and tr.class
        {title: 'Labels', filter: /^\.(label|alert)/}, // div.class and p.class
        {title: 'Block', filter: /^\.(well|hero-unit)/}, // div.class and p.class
    ]
  },
  aceeditorConfig = function(_editor)
  {
    _editor.setReadOnly(true);
    ace.require("ace/ext/emmet");
    ace.require("ace/ext/language_tools");
    _editor.setOptions({
        enableBasicAutocompletion: true,
        enableEmmet: true,
        enableSnippets: true,
    });
  }



var templateDir;
var dashboardRefresh;

$('body').hasClass('mobile') ? templateDir = 'mobile' : templateDir = 'desktop';

var admin = admin || angular.module('admin', ['ui.router', 'ngSanitize', 'nouislider', 'ui.checkbox', 'ui.sortable', 'ui.tinymce', 'ui.ace', 'ui.select2',
  'googlechart', 'ui.bootstrap', 'underscore', 'ui.tree', 'chieffancypants.loadingBar', 'Peaks.Contacts', 'Peaks.Manager', 'Peaks.Pages', 'Peaks.Banners', 'Peaks.Portfolio', 'Peaks.News', 'Peaks.Global']);
 // interceptors.js

/*admin.factory('httpRequestInterceptor', function ($q, $location) {
    return {
        'responseError': function(rejection) {
            console.log(rejection);
            // do something on error
            if(rejection.status === 404){
                $location.path('/404/');
                return $q.reject(rejection);
            }
            if (rejection.status === 401) {
              window.location.reload();
            };
         }
     };
});
*/
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

admin.directive('validation', function() {
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

admin.directive('errorSumary', function(){
  // Runs during compile
  return {
    template: '<div ng-if="errors" class="alert alert-danger alert-dismissable"><button type="button" ng-click="closeAlert()" class="close" aria-hidden="true">&times;</button><ul><li ng-repeat="error in errors" ng-bind-html="error"></li></ul></div>',
    controller: function($scope, $element, $attrs, $transclude) {
      $scope.closeAlert = function() { $scope.errors = null }
    },
  };
});



