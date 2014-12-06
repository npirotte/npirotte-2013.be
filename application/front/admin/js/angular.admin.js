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

var admin = admin || angular.module('admin', ['ngRoute', 'ngSanitize', 'nouislider', 'ui.checkbox', 'ui.sortable', 'ui.tinymce', 'ui.ace', 'ui.select2', 'googlechart', 'ui.bootstrap', 'underscore', 'ui.tree', 'chieffancypants.loadingBar']).
  config(
  ['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
  $httpProvider.interceptors.push('httpRequestInterceptor');
  $routeProvider.
  	  when('/', {templateUrl: '/admin/view_loader/'+templateDir+'/dashboard/dashboard/view',   controller: DashboardMasterListCtrl}).

      // global
      when('/configuration/stylesheets', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list',   controller: StylecheetsListCtrl}).
      when('/configuration/stylesheets/edit/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/global/stylesheets/edit',   controller: StylecheetEdit}).
  	//contact
      when('/contacts/config', {templateUrl: '/admin/view_loader/'+templateDir+'/contacts/informations/edit', controller: ContactConfigCtrl}).
      when('/contacts/:filter', {templateUrl: '/admin/view_loader/'+templateDir+'/contacts/messages/list',   controller: MessagesListCtrl}).
      when('/contacts/:filter/message/:messageId', {templateUrl: '/admin/view_loader/'+templateDir+'/contacts/messages/list',   controller: MessagesListCtrl}).
      //when('/contacts/messages/:messageId', {templateUrl: '/admin/view_loader/'+templateDir+'/contacts/messages/view',   controller: ViewMessage}).
      //when('/contacts/spams', {templateUrl: 'admin/view_loader/'+templateDir+'/contacts/messages/list',   controller: SpamsListCtrl}).

      when('/contacts/forms/list', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list', controller: ContactFormsListCtrl}).
      when('/contacts/forms/edit/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/contacts/forms/edit', controller: ContactFormsEditCtrl}).

    //pages
      when('/pages/pages', {templateUrl: '/admin/view_loader/'+templateDir+'/pages/pages/list',   controller: PagesListCtrl}).
      when('/pages/pages/edit/:pageId', {templateUrl: '/admin/view_loader/'+templateDir+'/pages/pages/edit',   controller: PagesEditCtrl}).
      when('/pages/templates/', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list',   controller: TemplatesListCtrl}).
      when('/pages/templates/edit/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/pages/templates/edit',   controller: TemplatesEditCtrl}).
      when('/pages/menus', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list',   controller: MenusListCtrl}).
      when('/pages/menus/edit/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/menus/menus/edit',   controller: MenuEditCtrl}).
      //when('/pages/content/:id', {templateUrl: 'index.php/admin/view_loader/'+templateDir+'/pages/edit/edit_content.php',   controller: EditContent}).
      //when('/pages/content/:parent_id/:id', {templateUrl: 'index.php/admin/view_loader/'+templateDir+'/pages/edit/edit_content.php',   controller: EditContent}).
    //manager
      when('/manager/comptes', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list',   controller: UserListCtrl}).
      when('/manager/comptes/edit/:userId', {templateUrl: '/admin/view_loader/'+templateDir+'/manager/users/edit',   controller: EditUser}).
      when('/manager/groupes', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list',   controller: GroupsListCtrl}).
      when('/manager/groupes/edit/:groupId', {templateUrl: '/admin/view_loader/'+templateDir+'/manager/groups/edit',   controller: GroupsEditCtrl}).
      /*when('/manager/logs', {templateUrl: '/admin/view_loader/'+templateDir+'/manager/logs/list',   controller: LogsList}).
      when('/manager/logs/:logId', {templateUrl: '/admin/view_loader/'+templateDir+'/manager/logs/details',   controller: LogsDetails}).*/
    //portfolio
      when('/portfolio/portfolios', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list',   controller: PortfolioListCtrl}).
      when('/portfolio/portfolios/edit/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/portfolio/portfolio/edit',   controller: PortfolioEditCtrl}).
      when('/portfolio/categories', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list',   controller: PortfolioCategoriesCtrl}).
      when('/portfolio/categories/edit/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/portfolio/categories/edit',   controller: PortfolioCategoriesEditCtrl}).
    //banners
      when('/banner-zones/list', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list',   controller: BannerZoneListCtrl}).
      when('/banner-zones/edit/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/banners/bannerzone/edit',   controller: BannerZoneEditCtrl}).
      when('/banner-zones/banner/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/banners/banner/edit',   controller: BannerEditCtrl}).
      when('/banner-zones/banner/:parent_id/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/banners/banner/edit',   controller: BannerEditCtrl}).
    //news
      when('/news/categories', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list',   controller: NewsCategoriesList}).
      when('/news/categories/edit/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/news/categories/edit',   controller: NewsCategoriesEdit}).
      when('/news/list', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list',   controller: NewsListCtrl}).
      when('/news/edit/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/news/news/edit',   controller: EditNews}).

    //edit
     // when('/wysiwyg/:module/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/wysiwyg/wysiwyg/edit',   controller: WysiwygCtrl}).
    //menu
     // when('/carte/list', {templateUrl: '/admin/view_loader/'+templateDir+'/shared/views/list', controller: CarteCategoriesListCtrl}).
     // when('/carte/edit/:id', {templateUrl: '/admin/view_loader/'+templateDir+'/carte/categories/edit', controller: CarteCategorieEditCtrl}).


      otherwise({redirectTo: '/'});
  }]
);

 // interceptors.js

admin.factory('httpRequestInterceptor', function ($q, $location) {
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



