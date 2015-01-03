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




'use strict';

/**
 * Config for the router
 */
angular.module('admin')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {
          
          $urlRouterProvider
              .otherwise('/dashboard');
          $stateProvider

            .state('dashboard', {
              url: "/dashboard",
              templateUrl: '/admin/view_loader/'+templateDir+'/dashboard/dashboard/view',
              controller : DashboardMasterListCtrl
            })

            /*==========  Contacts  ==========*/

            .state('contactsMessageslist', {
              url : '/contacts/messages',
              templateUrl : '/admin/view_loader/'+templateDir+'/contacts/messages/list',
              controller : 'MessagesList as messagesListCtrl'
            })
            .state('contactsFormsList', {
              url : '/contacts/forms',
              templateUrl : '/admin/view_loader/'+templateDir+'/shared/views/list',
              controller : 'ContactFormsList as contactFormsList'
            })
            .state('contactsFormsEdit', {
              url : '/contacts/forms/:id',
              templateUrl : '/admin/view_loader/'+templateDir+'/contacts/forms/edit', 
              controller: 'ContactFormsEdit as contactFormsEdit'
            })

            /*==========  Manager  ==========*/

            .state('managerUsersList', {
              url : '/manager/users',
              templateUrl : '/admin/view_loader/'+templateDir+'/shared/views/list',
              controller : 'UserListCtrl as userListCtrl'
            })
            .state('managerUsersEdit', {
              url : '/manager/users/:userId',
              templateUrl : '/admin/view_loader/'+templateDir+'/manager/users/edit',
              controller : 'UserEditCtrl as userEditCtrl'
            })

            .state('managerGroupsList', {
              url : '/manager/groups',
              templateUrl : '/admin/view_loader/'+templateDir+'/shared/views/list',
              controller : 'GroupListCtrl as groupListCtrl'
            })
            .state('managerGroupEdit', {
              url : '/manager/groups/:groupId',
              templateUrl : '/admin/view_loader/'+templateDir+'/manager/groups/edit',
              controller : 'GroupEditCtrl as groupEditCtrl'
            })

            /*==========  Pages  ==========*/
            
            .state('pagesPagesList', {
              url : '/pages/pages',
              templateUrl : '/admin/view_loader/'+templateDir+'/pages/pages/list',
              controller : 'PageListCtrl as pageListCtrl'
            })
            .state('pagesPageEdit', {
              url : '/pages/pages/:pageId',
              templateUrl : '/admin/view_loader/'+templateDir+'/pages/pages/edit',
              controller : 'PageEditCtrl as pageEditCtrl'
            })

            .state('pagesTemplatesList', {
              url : '/pages/templates',
              templateUrl : '/admin/view_loader/'+templateDir+'/shared/views/list',
              controller : 'TemplatesListCtrl as templateListCtrl'
            })
            .state('pagesTemplatesEdit', {
              url : '/pages/templates/:id',
              templateUrl : '/admin/view_loader/'+templateDir+'/pages/templates/edit',
              controller : 'TemplateEditCtrl as templateEditCtrl'
            })

            .state('pagesMenusList', {
              url : '/pages/menus',
              templateUrl : '/admin/view_loader/'+templateDir+'/shared/views/list',
              controller : 'MenusListCtrl as menuListCtrl'
            })
            .state('pagesMenusEdit', {
              url : '/pages/menus/:id',
              templateUrl : '/admin/view_loader/'+templateDir+'/menus/menus/edit',
              controller : 'MenuEditCtrl as menuEditCtrl'
            })

            /*==========  Banners  ==========*/
            
            .state('bannersZonesList', {
              url : '/banners/zones',
              templateUrl : '/admin/view_loader/'+templateDir+'/shared/views/list',
              controller : 'BannerZoneListCtrl as bannerZoneListCtrl'
            })
            .state('bannersZonesEdit', {
              url : '/banners/zones/:id',
              templateUrl : '/admin/view_loader/'+templateDir+'/banners/bannerzone/edit',
              controller : 'BannerZoneEditCtrl as bannerZoneEditCtrl'
            })
            .state('bannersBannerEditByParent', {
              url : '/banners/banners/:parent_id/:id',
              templateUrl : '/admin/view_loader/'+templateDir+'/banners/banner/edit',
              controller : 'BannerEditCtrl as bannerEditCtrl'
            })
            .state('bannersBannerEdit', {
              url : '/banners/banners/:id',
              templateUrl : '/admin/view_loader/'+templateDir+'/banners/banner/edit',
              controller : 'BannerEditCtrl as bannerEditCtrl'
            })

            /*==========  Portfolio  ==========*/

            .state('portfolioCategoriesList', {
              url : '/portfolio/categories',
              templateUrl : '/admin/view_loader/'+templateDir+'/shared/views/list',
              controller : 'PortfolioCategoriesListCtrl as portfolioCategoriesListCtrl'
            })
            .state('portfolioCategoriesEdit', {
              url : '/portfolio/categories/:id',
              templateUrl : '/admin/view_loader/'+templateDir+'/portfolio/categories/edit',
              controller : 'PortfolioCategoryEditCtrl as portfolioCategoryEditCtrl'
            })

            .state('portfolioItemsList', {
              url : '/portfolio/portfolios',
              templateUrl : '/admin/view_loader/'+templateDir+'/shared/views/list',
              controller : 'PortfolioListCtrl as portfolioListCtrl'
            })
            .state('portfolioItemsEdit', {
              url : '/portfolio/portfolios/:id',
              templateUrl : '/admin/view_loader/'+templateDir+'/portfolio/portfolio/edit',
              controller : 'PortfolioEditCtrl as portfolioEditCtrl'
            })

            /*==========  News  ==========*/

            .state('newsCategoriesList', {
              url : '/news/categories',
              templateUrl : '/admin/view_loader/'+templateDir+'/shared/views/list',
              controller : 'NewsCategoriesListCtrl as newsCategoriesListCtrl'
            })
            .state('newsCategoriesEdit', {
              url : '/news/categories/:id',
              templateUrl : '/admin/view_loader/'+templateDir+'/news/categories/edit',
              controller : 'NewsCategoriesEditCtrl as newsCategoryEditCtrl'
            })

            .state('newsItemsList', {
              url : '/news/items',
              templateUrl : '/admin/view_loader/'+templateDir+'/shared/views/list',
              controller : 'NewsItemsListCtrl as newsItemsListCtrl'
            })
            .state('newsItemsEdit', {
              url : '/news/items/:id',
              templateUrl : '/admin/view_loader/'+templateDir+'/news/news/edit',
              controller : 'NewsItemsEditCtrl as newsItemsEditCtrl'
            })
            
            
             
      }
    ]
  );
angular.module('admin').controller('MainTabsCtrl', ['$scope', 'ScopeCacheProvider', function($scope, scopeCacheProvider){
	
	$scope.tabs = [];

	$scope.$on('TabCreated', function(event, data)
	{
		console.log(data);
		$scope.tabs.push(data);
		console.log($scope.tabs);
	});
}]);
angular.module('admin').factory('ScopeCacheProvider', ['$rootScope', function($rootScope){

	var _cache = {};

	return {
		Get : function(key)
		{
			return _cache[key] || false;
		},
		Set : function(key, scopeData)
		{
			_cache[key] = scopeData;
			console.log(_cache);
		},
		CreateTab : function(tabName, tabUrl)
		{
			$rootScope.$broadcast('TabCreated', {tabName : tabName, tabUrl : tabUrl});
		}
	};
}])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9jb3JlLm1vZHVsZS5qcyIsImNvcmUuY29uZmlnLnJvdXRlci5qcyIsImN0cmwubWFpblRhYnMuanMiLCJzZXJ2LnNjb3BlY2FjaGVwcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIHZhciB1bmRlcnNjb3JlID0gYW5ndWxhci5tb2R1bGUoJ3VuZGVyc2NvcmUnLCBbXSk7XHJcbiAgdW5kZXJzY29yZS5mYWN0b3J5KCdfJywgZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gd2luZG93Ll87IC8vIGFzc3VtZXMgdW5kZXJzY29yZSBoYXMgYWxyZWFkeSBiZWVuIGxvYWRlZCBvbiB0aGUgcGFnZVxyXG4gIH0pOyAgXHJcblxyXG52YXIgdGlueW1jZUNvbmZpZyA9IHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICBcImF1dG9saW5rIGxpbmsgaW1hZ2VcIixcclxuICAgICAgICBcInNlYXJjaHJlcGxhY2UgdmlzdWFsYmxvY2tzIGZ1bGxzY3JlZW4gaW1wb3J0Y3NzXCIsXHJcbiAgICAgICAgXCJ0YWJsZSBjb250ZXh0bWVudSBwYXN0ZVwiXHJcbiAgICBdLFxyXG4gICAgc2tpbiA6ICdsaWdodCcsXHJcbiAgICB0b29sYmFyOiBcImluc2VydGZpbGUgdW5kbyByZWRvIHwgc3R5bGVzZWxlY3QgfCBib2xkIGl0YWxpYyB8IGFsaWdubGVmdCBhbGlnbmNlbnRlciBhbGlnbnJpZ2h0IGFsaWduanVzdGlmeSB8IGJ1bGxpc3QgbnVtbGlzdCB8IGxpbmsgaW1hZ2VcIixcclxuICAgIGNvbnRlbnRfY3NzIDogZ2xvYmFsVmFycy5hcHBfdXJsICsgXCJmcm9udC9jYWNoZS9kZWZhdWx0X2NvbWJpbmVkLmNzcz9cIituZXcgRGF0ZSgpLmdldFRpbWUoKSxcclxuICAgIGltcG9ydGNzc19zZWxlY3Rvcl9maWx0ZXIgOiAvXlxcLihidG58bGFiZWx8YWxlcnR8aGVyby11bml0fHdlbGx8dGV4dCkvLFxyXG4gICAgIGltcG9ydGNzc19ncm91cHM6IFtcclxuICAgICAgICB7dGl0bGU6ICdCb3V0b25zJywgZmlsdGVyOiAvXlxcLmJ0bi99LCAvLyB0ZC5jbGFzcyBhbmQgdHIuY2xhc3NcclxuICAgICAgICB7dGl0bGU6ICdUZXh0ZScsIGZpbHRlcjogL15cXC50ZXh0L30sIC8vIHRkLmNsYXNzIGFuZCB0ci5jbGFzc1xyXG4gICAgICAgIHt0aXRsZTogJ0xhYmVscycsIGZpbHRlcjogL15cXC4obGFiZWx8YWxlcnQpL30sIC8vIGRpdi5jbGFzcyBhbmQgcC5jbGFzc1xyXG4gICAgICAgIHt0aXRsZTogJ0Jsb2NrJywgZmlsdGVyOiAvXlxcLih3ZWxsfGhlcm8tdW5pdCkvfSwgLy8gZGl2LmNsYXNzIGFuZCBwLmNsYXNzXHJcbiAgICBdXHJcbiAgfSxcclxuICBhY2VlZGl0b3JDb25maWcgPSBmdW5jdGlvbihfZWRpdG9yKVxyXG4gIHtcclxuICAgIF9lZGl0b3Iuc2V0UmVhZE9ubHkodHJ1ZSk7XHJcbiAgICBhY2UucmVxdWlyZShcImFjZS9leHQvZW1tZXRcIik7XHJcbiAgICBhY2UucmVxdWlyZShcImFjZS9leHQvbGFuZ3VhZ2VfdG9vbHNcIik7XHJcbiAgICBfZWRpdG9yLnNldE9wdGlvbnMoe1xyXG4gICAgICAgIGVuYWJsZUJhc2ljQXV0b2NvbXBsZXRpb246IHRydWUsXHJcbiAgICAgICAgZW5hYmxlRW1tZXQ6IHRydWUsXHJcbiAgICAgICAgZW5hYmxlU25pcHBldHM6IHRydWUsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuXHJcbnZhciB0ZW1wbGF0ZURpcjtcclxudmFyIGRhc2hib2FyZFJlZnJlc2g7XHJcblxyXG4kKCdib2R5JykuaGFzQ2xhc3MoJ21vYmlsZScpID8gdGVtcGxhdGVEaXIgPSAnbW9iaWxlJyA6IHRlbXBsYXRlRGlyID0gJ2Rlc2t0b3AnO1xyXG5cclxudmFyIGFkbWluID0gYWRtaW4gfHwgYW5ndWxhci5tb2R1bGUoJ2FkbWluJywgWyd1aS5yb3V0ZXInLCAnbmdTYW5pdGl6ZScsICdub3Vpc2xpZGVyJywgJ3VpLmNoZWNrYm94JywgJ3VpLnNvcnRhYmxlJywgJ3VpLnRpbnltY2UnLCAndWkuYWNlJywgJ3VpLnNlbGVjdDInLFxyXG4gICdnb29nbGVjaGFydCcsICd1aS5ib290c3RyYXAnLCAndW5kZXJzY29yZScsICd1aS50cmVlJywgJ2NoaWVmZmFuY3lwYW50cy5sb2FkaW5nQmFyJywgJ1BlYWtzLkNvbnRhY3RzJywgJ1BlYWtzLk1hbmFnZXInLCAnUGVha3MuUGFnZXMnLCAnUGVha3MuQmFubmVycycsICdQZWFrcy5Qb3J0Zm9saW8nLCAnUGVha3MuTmV3cycsICdQZWFrcy5HbG9iYWwnXSk7XHJcbiAvLyBpbnRlcmNlcHRvcnMuanNcclxuXHJcbi8qYWRtaW4uZmFjdG9yeSgnaHR0cFJlcXVlc3RJbnRlcmNlcHRvcicsIGZ1bmN0aW9uICgkcSwgJGxvY2F0aW9uKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgICdyZXNwb25zZUVycm9yJzogZnVuY3Rpb24ocmVqZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlamVjdGlvbik7XHJcbiAgICAgICAgICAgIC8vIGRvIHNvbWV0aGluZyBvbiBlcnJvclxyXG4gICAgICAgICAgICBpZihyZWplY3Rpb24uc3RhdHVzID09PSA0MDQpe1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy80MDQvJyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHEucmVqZWN0KHJlamVjdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlamVjdGlvbi5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgfVxyXG4gICAgIH07XHJcbn0pO1xyXG4qL1xyXG4vLyB2YWxpZGF0dCB6enp6aW9uc1xyXG5cclxudmFyIHJlZ2V4ID0ge1xyXG4gICAgbWFpbCA6IC9cXGJbYS16MC05Ll8lLV0rQFthLXowLTkuLV0rXFwuW2Etel17Miw0fVxcYi8sXHJcbiAgICBzbHVnIDogL15bYS16QS1aMC05XFwtXSskLyxcclxuICAgIGludCA6IC9eWzAtOV0rJC8sXHJcbiAgICBwYXNzd29yZCA6IC9eLns0LDEyfSQvLFxyXG4gICAgcGhvbmUgOiAvXlswLTldezIsM30tPyA/WzAtOV17Niw3fSQvXHJcbn1cclxuXHJcbnZhciB2YWxpZGF0aW9uRXJyb3IgPSBbXTtcclxuXHJcbnZhbGlkYXRpb25FcnJvclsnZnInXSA9IHtcclxuICAgIG1haWwgOiAnQ2UgY2hhbXAgZG9pdCDDqnRyZSBhdSBmb3JtYXQgRW1haWwuJyxcclxuICAgIHNsdWcgOiAnQ2UgY2hhbXAgbmUgcGV1dCBjb250ZW5pciBuaSBlc3BhY2UgbmkgY2FycmFjdMOocmVzIHNww6ljaWF1eC4nLFxyXG4gICAgaW50IDogJ0NlIGNoYW1wIGRvaXQgw6p0cmUgdW4gbm9tYnJlIGVudGllci4nLFxyXG4gICAgcGFzc3dvcmQgOiAnQ2UgY2hhbXAgZG9pdCDDqnRyZSB1biBub21icmUgZW50aWVyLicsXHJcbiAgICBwaG9uZSA6ICdDZSBjaGFtcCBkb2l0IMOqdHJlIGF1IGZvcm1hdCB0w6lsw6lwaG9uZS4nXHJcbn1cclxuXHJcbmFkbWluLmRpcmVjdGl2ZSgndmFsaWRhdGlvbicsIGZ1bmN0aW9uKCkge1xyXG4gIHJldHVybiB7XHJcbiAgICByZXF1aXJlOiAnbmdNb2RlbCcsXHJcbiAgICBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGVsbSwgYXR0cnMsIGN0cmwpIHtcclxuICAgICAgY29uc29sZS5sb2coYXR0cnMuaWQpO1xyXG4gICAgICBjdHJsLiRwYXJzZXJzLnVuc2hpZnQoZnVuY3Rpb24odmlld1ZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHJlZ2V4W2F0dHJzWyd2YWxpZGF0aW9uJ11dLnRlc3Qodmlld1ZhbHVlKSB8fCAhdmlld1ZhbHVlKSB7XHJcbiAgICAgICAgICAvLyBpdCBpcyB2YWxpZFxyXG4gICAgICAgICAgY3RybC4kc2V0VmFsaWRpdHkoJ3ZhbGlkYXRpb24nLCB0cnVlKTtcclxuICAgICAgICAgIHJldHVybiB2aWV3VmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIGl0IGlzIGludmFsaWQsIHJldHVybiB1bmRlZmluZWQgKG5vIG1vZGVsIHVwZGF0ZSlcclxuICAgICAgICAgIGN0cmwuJHNldFZhbGlkaXR5KCd2YWxpZGF0aW9uJywgZmFsc2UpO1xyXG4gICAgICAgICAgJHNjb3BlW2F0dHJzLmlkXSA9IHZhbGlkYXRpb25FcnJvclsnZnInXVthdHRyc1sndmFsaWRhdGlvbiddXTtcclxuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9O1xyXG59KTtcclxuXHJcbmFkbWluLmRpcmVjdGl2ZSgnZXJyb3JTdW1hcnknLCBmdW5jdGlvbigpe1xyXG4gIC8vIFJ1bnMgZHVyaW5nIGNvbXBpbGVcclxuICByZXR1cm4ge1xyXG4gICAgdGVtcGxhdGU6ICc8ZGl2IG5nLWlmPVwiZXJyb3JzXCIgY2xhc3M9XCJhbGVydCBhbGVydC1kYW5nZXIgYWxlcnQtZGlzbWlzc2FibGVcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBuZy1jbGljaz1cImNsb3NlQWxlcnQoKVwiIGNsYXNzPVwiY2xvc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9idXR0b24+PHVsPjxsaSBuZy1yZXBlYXQ9XCJlcnJvciBpbiBlcnJvcnNcIiBuZy1iaW5kLWh0bWw9XCJlcnJvclwiPjwvbGk+PC91bD48L2Rpdj4nLFxyXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdHJhbnNjbHVkZSkge1xyXG4gICAgICAkc2NvcGUuY2xvc2VBbGVydCA9IGZ1bmN0aW9uKCkgeyAkc2NvcGUuZXJyb3JzID0gbnVsbCB9XHJcbiAgICB9LFxyXG4gIH07XHJcbn0pO1xyXG5cclxuXHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKipcclxuICogQ29uZmlnIGZvciB0aGUgcm91dGVyXHJcbiAqL1xyXG5hbmd1bGFyLm1vZHVsZSgnYWRtaW4nKVxyXG4gIC5ydW4oXHJcbiAgICBbICAgICAgICAgICckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLFxyXG4gICAgICBmdW5jdGlvbiAoJHJvb3RTY29wZSwgICAkc3RhdGUsICAgJHN0YXRlUGFyYW1zKSB7XHJcbiAgICAgICAgICAkcm9vdFNjb3BlLiRzdGF0ZSA9ICRzdGF0ZTtcclxuICAgICAgICAgICRyb290U2NvcGUuJHN0YXRlUGFyYW1zID0gJHN0YXRlUGFyYW1zOyAgICAgICAgXHJcbiAgICAgIH1cclxuICAgIF1cclxuICApXHJcbiAgLmNvbmZpZyhcclxuICAgIFsgICAgICAgICAgJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlcicsXHJcbiAgICAgIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgICAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyXHJcbiAgICAgICAgICAgICAgLm90aGVyd2lzZSgnL2Rhc2hib2FyZCcpO1xyXG4gICAgICAgICAgJHN0YXRlUHJvdmlkZXJcclxuXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnZGFzaGJvYXJkJywge1xyXG4gICAgICAgICAgICAgIHVybDogXCIvZGFzaGJvYXJkXCIsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvYWRtaW4vdmlld19sb2FkZXIvJyt0ZW1wbGF0ZURpcisnL2Rhc2hib2FyZC9kYXNoYm9hcmQvdmlldycsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6IERhc2hib2FyZE1hc3Rlckxpc3RDdHJsXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvKj09PT09PT09PT0gIENvbnRhY3RzICA9PT09PT09PT09Ki9cclxuXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnY29udGFjdHNNZXNzYWdlc2xpc3QnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9jb250YWN0cy9tZXNzYWdlcycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnL2FkbWluL3ZpZXdfbG9hZGVyLycrdGVtcGxhdGVEaXIrJy9jb250YWN0cy9tZXNzYWdlcy9saXN0JyxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyIDogJ01lc3NhZ2VzTGlzdCBhcyBtZXNzYWdlc0xpc3RDdHJsJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbnRhY3RzRm9ybXNMaXN0Jywge1xyXG4gICAgICAgICAgICAgIHVybCA6ICcvY29udGFjdHMvZm9ybXMnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJy9hZG1pbi92aWV3X2xvYWRlci8nK3RlbXBsYXRlRGlyKycvc2hhcmVkL3ZpZXdzL2xpc3QnLFxyXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnQ29udGFjdEZvcm1zTGlzdCBhcyBjb250YWN0Rm9ybXNMaXN0J1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2NvbnRhY3RzRm9ybXNFZGl0Jywge1xyXG4gICAgICAgICAgICAgIHVybCA6ICcvY29udGFjdHMvZm9ybXMvOmlkJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICcvYWRtaW4vdmlld19sb2FkZXIvJyt0ZW1wbGF0ZURpcisnL2NvbnRhY3RzL2Zvcm1zL2VkaXQnLCBcclxuICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQ29udGFjdEZvcm1zRWRpdCBhcyBjb250YWN0Rm9ybXNFZGl0J1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLyo9PT09PT09PT09ICBNYW5hZ2VyICA9PT09PT09PT09Ki9cclxuXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbWFuYWdlclVzZXJzTGlzdCcsIHtcclxuICAgICAgICAgICAgICB1cmwgOiAnL21hbmFnZXIvdXNlcnMnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJy9hZG1pbi92aWV3X2xvYWRlci8nK3RlbXBsYXRlRGlyKycvc2hhcmVkL3ZpZXdzL2xpc3QnLFxyXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnVXNlckxpc3RDdHJsIGFzIHVzZXJMaXN0Q3RybCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdtYW5hZ2VyVXNlcnNFZGl0Jywge1xyXG4gICAgICAgICAgICAgIHVybCA6ICcvbWFuYWdlci91c2Vycy86dXNlcklkJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICcvYWRtaW4vdmlld19sb2FkZXIvJyt0ZW1wbGF0ZURpcisnL21hbmFnZXIvdXNlcnMvZWRpdCcsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdVc2VyRWRpdEN0cmwgYXMgdXNlckVkaXRDdHJsJ1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLnN0YXRlKCdtYW5hZ2VyR3JvdXBzTGlzdCcsIHtcclxuICAgICAgICAgICAgICB1cmwgOiAnL21hbmFnZXIvZ3JvdXBzJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICcvYWRtaW4vdmlld19sb2FkZXIvJyt0ZW1wbGF0ZURpcisnL3NoYXJlZC92aWV3cy9saXN0JyxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyIDogJ0dyb3VwTGlzdEN0cmwgYXMgZ3JvdXBMaXN0Q3RybCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdtYW5hZ2VyR3JvdXBFZGl0Jywge1xyXG4gICAgICAgICAgICAgIHVybCA6ICcvbWFuYWdlci9ncm91cHMvOmdyb3VwSWQnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJy9hZG1pbi92aWV3X2xvYWRlci8nK3RlbXBsYXRlRGlyKycvbWFuYWdlci9ncm91cHMvZWRpdCcsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdHcm91cEVkaXRDdHJsIGFzIGdyb3VwRWRpdEN0cmwnXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvKj09PT09PT09PT0gIFBhZ2VzICA9PT09PT09PT09Ki9cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC5zdGF0ZSgncGFnZXNQYWdlc0xpc3QnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9wYWdlcy9wYWdlcycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnL2FkbWluL3ZpZXdfbG9hZGVyLycrdGVtcGxhdGVEaXIrJy9wYWdlcy9wYWdlcy9saXN0JyxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyIDogJ1BhZ2VMaXN0Q3RybCBhcyBwYWdlTGlzdEN0cmwnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zdGF0ZSgncGFnZXNQYWdlRWRpdCcsIHtcclxuICAgICAgICAgICAgICB1cmwgOiAnL3BhZ2VzL3BhZ2VzLzpwYWdlSWQnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJy9hZG1pbi92aWV3X2xvYWRlci8nK3RlbXBsYXRlRGlyKycvcGFnZXMvcGFnZXMvZWRpdCcsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdQYWdlRWRpdEN0cmwgYXMgcGFnZUVkaXRDdHJsJ1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLnN0YXRlKCdwYWdlc1RlbXBsYXRlc0xpc3QnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9wYWdlcy90ZW1wbGF0ZXMnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJy9hZG1pbi92aWV3X2xvYWRlci8nK3RlbXBsYXRlRGlyKycvc2hhcmVkL3ZpZXdzL2xpc3QnLFxyXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnVGVtcGxhdGVzTGlzdEN0cmwgYXMgdGVtcGxhdGVMaXN0Q3RybCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdwYWdlc1RlbXBsYXRlc0VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9wYWdlcy90ZW1wbGF0ZXMvOmlkJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICcvYWRtaW4vdmlld19sb2FkZXIvJyt0ZW1wbGF0ZURpcisnL3BhZ2VzL3RlbXBsYXRlcy9lZGl0JyxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyIDogJ1RlbXBsYXRlRWRpdEN0cmwgYXMgdGVtcGxhdGVFZGl0Q3RybCdcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC5zdGF0ZSgncGFnZXNNZW51c0xpc3QnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9wYWdlcy9tZW51cycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnL2FkbWluL3ZpZXdfbG9hZGVyLycrdGVtcGxhdGVEaXIrJy9zaGFyZWQvdmlld3MvbGlzdCcsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdNZW51c0xpc3RDdHJsIGFzIG1lbnVMaXN0Q3RybCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdwYWdlc01lbnVzRWRpdCcsIHtcclxuICAgICAgICAgICAgICB1cmwgOiAnL3BhZ2VzL21lbnVzLzppZCcsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnL2FkbWluL3ZpZXdfbG9hZGVyLycrdGVtcGxhdGVEaXIrJy9tZW51cy9tZW51cy9lZGl0JyxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyIDogJ01lbnVFZGl0Q3RybCBhcyBtZW51RWRpdEN0cmwnXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvKj09PT09PT09PT0gIEJhbm5lcnMgID09PT09PT09PT0qL1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLnN0YXRlKCdiYW5uZXJzWm9uZXNMaXN0Jywge1xyXG4gICAgICAgICAgICAgIHVybCA6ICcvYmFubmVycy96b25lcycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnL2FkbWluL3ZpZXdfbG9hZGVyLycrdGVtcGxhdGVEaXIrJy9zaGFyZWQvdmlld3MvbGlzdCcsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdCYW5uZXJab25lTGlzdEN0cmwgYXMgYmFubmVyWm9uZUxpc3RDdHJsJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2Jhbm5lcnNab25lc0VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9iYW5uZXJzL3pvbmVzLzppZCcsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnL2FkbWluL3ZpZXdfbG9hZGVyLycrdGVtcGxhdGVEaXIrJy9iYW5uZXJzL2Jhbm5lcnpvbmUvZWRpdCcsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdCYW5uZXJab25lRWRpdEN0cmwgYXMgYmFubmVyWm9uZUVkaXRDdHJsJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ2Jhbm5lcnNCYW5uZXJFZGl0QnlQYXJlbnQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9iYW5uZXJzL2Jhbm5lcnMvOnBhcmVudF9pZC86aWQnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJy9hZG1pbi92aWV3X2xvYWRlci8nK3RlbXBsYXRlRGlyKycvYmFubmVycy9iYW5uZXIvZWRpdCcsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdCYW5uZXJFZGl0Q3RybCBhcyBiYW5uZXJFZGl0Q3RybCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdiYW5uZXJzQmFubmVyRWRpdCcsIHtcclxuICAgICAgICAgICAgICB1cmwgOiAnL2Jhbm5lcnMvYmFubmVycy86aWQnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJy9hZG1pbi92aWV3X2xvYWRlci8nK3RlbXBsYXRlRGlyKycvYmFubmVycy9iYW5uZXIvZWRpdCcsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdCYW5uZXJFZGl0Q3RybCBhcyBiYW5uZXJFZGl0Q3RybCdcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8qPT09PT09PT09PSAgUG9ydGZvbGlvICA9PT09PT09PT09Ki9cclxuXHJcbiAgICAgICAgICAgIC5zdGF0ZSgncG9ydGZvbGlvQ2F0ZWdvcmllc0xpc3QnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9wb3J0Zm9saW8vY2F0ZWdvcmllcycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnL2FkbWluL3ZpZXdfbG9hZGVyLycrdGVtcGxhdGVEaXIrJy9zaGFyZWQvdmlld3MvbGlzdCcsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdQb3J0Zm9saW9DYXRlZ29yaWVzTGlzdEN0cmwgYXMgcG9ydGZvbGlvQ2F0ZWdvcmllc0xpc3RDdHJsJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ3BvcnRmb2xpb0NhdGVnb3JpZXNFZGl0Jywge1xyXG4gICAgICAgICAgICAgIHVybCA6ICcvcG9ydGZvbGlvL2NhdGVnb3JpZXMvOmlkJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICcvYWRtaW4vdmlld19sb2FkZXIvJyt0ZW1wbGF0ZURpcisnL3BvcnRmb2xpby9jYXRlZ29yaWVzL2VkaXQnLFxyXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXIgOiAnUG9ydGZvbGlvQ2F0ZWdvcnlFZGl0Q3RybCBhcyBwb3J0Zm9saW9DYXRlZ29yeUVkaXRDdHJsJ1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLnN0YXRlKCdwb3J0Zm9saW9JdGVtc0xpc3QnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9wb3J0Zm9saW8vcG9ydGZvbGlvcycsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnL2FkbWluL3ZpZXdfbG9hZGVyLycrdGVtcGxhdGVEaXIrJy9zaGFyZWQvdmlld3MvbGlzdCcsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdQb3J0Zm9saW9MaXN0Q3RybCBhcyBwb3J0Zm9saW9MaXN0Q3RybCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCdwb3J0Zm9saW9JdGVtc0VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9wb3J0Zm9saW8vcG9ydGZvbGlvcy86aWQnLFxyXG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsIDogJy9hZG1pbi92aWV3X2xvYWRlci8nK3RlbXBsYXRlRGlyKycvcG9ydGZvbGlvL3BvcnRmb2xpby9lZGl0JyxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyIDogJ1BvcnRmb2xpb0VkaXRDdHJsIGFzIHBvcnRmb2xpb0VkaXRDdHJsJ1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLyo9PT09PT09PT09ICBOZXdzICA9PT09PT09PT09Ki9cclxuXHJcbiAgICAgICAgICAgIC5zdGF0ZSgnbmV3c0NhdGVnb3JpZXNMaXN0Jywge1xyXG4gICAgICAgICAgICAgIHVybCA6ICcvbmV3cy9jYXRlZ29yaWVzJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICcvYWRtaW4vdmlld19sb2FkZXIvJyt0ZW1wbGF0ZURpcisnL3NoYXJlZC92aWV3cy9saXN0JyxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyIDogJ05ld3NDYXRlZ29yaWVzTGlzdEN0cmwgYXMgbmV3c0NhdGVnb3JpZXNMaXN0Q3RybCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLnN0YXRlKCduZXdzQ2F0ZWdvcmllc0VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9uZXdzL2NhdGVnb3JpZXMvOmlkJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICcvYWRtaW4vdmlld19sb2FkZXIvJyt0ZW1wbGF0ZURpcisnL25ld3MvY2F0ZWdvcmllcy9lZGl0JyxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyIDogJ05ld3NDYXRlZ29yaWVzRWRpdEN0cmwgYXMgbmV3c0NhdGVnb3J5RWRpdEN0cmwnXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAuc3RhdGUoJ25ld3NJdGVtc0xpc3QnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9uZXdzL2l0ZW1zJyxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybCA6ICcvYWRtaW4vdmlld19sb2FkZXIvJyt0ZW1wbGF0ZURpcisnL3NoYXJlZC92aWV3cy9saXN0JyxcclxuICAgICAgICAgICAgICBjb250cm9sbGVyIDogJ05ld3NJdGVtc0xpc3RDdHJsIGFzIG5ld3NJdGVtc0xpc3RDdHJsJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc3RhdGUoJ25ld3NJdGVtc0VkaXQnLCB7XHJcbiAgICAgICAgICAgICAgdXJsIDogJy9uZXdzL2l0ZW1zLzppZCcsXHJcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmwgOiAnL2FkbWluL3ZpZXdfbG9hZGVyLycrdGVtcGxhdGVEaXIrJy9uZXdzL25ld3MvZWRpdCcsXHJcbiAgICAgICAgICAgICAgY29udHJvbGxlciA6ICdOZXdzSXRlbXNFZGl0Q3RybCBhcyBuZXdzSXRlbXNFZGl0Q3RybCdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgXHJcbiAgICAgIH1cclxuICAgIF1cclxuICApOyIsImFuZ3VsYXIubW9kdWxlKCdhZG1pbicpLmNvbnRyb2xsZXIoJ01haW5UYWJzQ3RybCcsIFsnJHNjb3BlJywgJ1Njb3BlQ2FjaGVQcm92aWRlcicsIGZ1bmN0aW9uKCRzY29wZSwgc2NvcGVDYWNoZVByb3ZpZGVyKXtcclxuXHRcclxuXHQkc2NvcGUudGFicyA9IFtdO1xyXG5cclxuXHQkc2NvcGUuJG9uKCdUYWJDcmVhdGVkJywgZnVuY3Rpb24oZXZlbnQsIGRhdGEpXHJcblx0e1xyXG5cdFx0Y29uc29sZS5sb2coZGF0YSk7XHJcblx0XHQkc2NvcGUudGFicy5wdXNoKGRhdGEpO1xyXG5cdFx0Y29uc29sZS5sb2coJHNjb3BlLnRhYnMpO1xyXG5cdH0pO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FkbWluJykuZmFjdG9yeSgnU2NvcGVDYWNoZVByb3ZpZGVyJywgWyckcm9vdFNjb3BlJywgZnVuY3Rpb24oJHJvb3RTY29wZSl7XHJcblxyXG5cdHZhciBfY2FjaGUgPSB7fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdEdldCA6IGZ1bmN0aW9uKGtleSlcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIF9jYWNoZVtrZXldIHx8IGZhbHNlO1xyXG5cdFx0fSxcclxuXHRcdFNldCA6IGZ1bmN0aW9uKGtleSwgc2NvcGVEYXRhKVxyXG5cdFx0e1xyXG5cdFx0XHRfY2FjaGVba2V5XSA9IHNjb3BlRGF0YTtcclxuXHRcdFx0Y29uc29sZS5sb2coX2NhY2hlKTtcclxuXHRcdH0sXHJcblx0XHRDcmVhdGVUYWIgOiBmdW5jdGlvbih0YWJOYW1lLCB0YWJVcmwpXHJcblx0XHR7XHJcblx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnVGFiQ3JlYXRlZCcsIHt0YWJOYW1lIDogdGFiTmFtZSwgdGFiVXJsIDogdGFiVXJsfSk7XHJcblx0XHR9XHJcblx0fTtcclxufV0pIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9