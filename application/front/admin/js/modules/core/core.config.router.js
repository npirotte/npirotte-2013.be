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