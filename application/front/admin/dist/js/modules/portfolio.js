angular.module('Peaks.Portfolio', ['Peaks.Manager.Repositories', 'Peaks.Portfolio.Services', 'Peaks.Portfolio.Directives', 'Peaks.Portfolio.Repositories']);
angular.module('Peaks.Portfolio.Services', []);
angular.module('Peaks.Portfolio.Directives', []);
angular.module('Peaks.Portfolio.Repositories', [])
angular.module('Peaks.Portfolio').controller('PortfolioCategoryEditCtrl', ['$scope', '$stateParams', 'PortfolioCategoriesRepository', 'TagsRespository', 'ScopeCacheProvider', 
  function($scope, $routeParams, portfolioCategoriesRepository, tagsRespository, scopeCacheProvider){

  menuControl('portfolio');

  $scope.backUrl = 'portfolio/categories';

  init_page();

  var id = $routeParams.id;
  $scope.mode =  id;

 $scope.select2Tags = {
      'multiple': true,
      'simple_tags': true,
      //'tags': true,  // Can be empty list.
      'tokenSeparators' : [","],
      initSelection : function(element)
      {
        console.log(this);
      }
  };

  tagsRespository.tagNamesList(function(data)
  {
    $scope.select2Tags.tags = data;
  });


  var getTheItem = function(){
    portfolioCategoriesRepository.getCategory(id, function(data)
    {
      $scope.item = data;
    });
  }

  $scope.save = function (returnToList) {
    $scope.alert = 'Sauvegarde ...';
    showAlert();

    portfolioCategoriesRepository.saveCategory($scope.item, function(data)
    {
        if (returnToList && data.errors.length === 0) {
          window.location.hash = '/portfolio/categories';
        }
        else if (id === 'new' && data.errors.length === 0)
        {
          window.location.hash = '/portfolio/categories/edit/' + data.id;
        }
        else
        {
          $scope.alert = data.message;
          $scope.errors = data.errors;
          showFadeAlert();
        }
    });
  }

  $scope.delete = function () {
    if (confirm('Etes vous sur de vouloir supprimer cette catégories ?')) 
    {
      portfolioCategoriesRepository.deleteCategory(id, function(data)
      {
        window.location.hash = '/portfolio/categories';
      });
    };
  }

  /*=======================================================
  =            Gestion du cache complet de vue            =
  =======================================================*/
  
/*  $scope.$on('$destroy', function() {
      alert("In destroy of:");
      scopeCacheProvider.Set('PortfolioCategories' + $scope.item.id, $scope);
  });
  */
  /*-----  End of Gestion du cache complet de vue  ------*/
  
  

  if ($scope.mode != 'new') {
    getTheItem();
  } 
  else {
    $scope.hideForNew = true;
    $scope.item = {
        //meta_keywords : new Array()
      };
    for (var i = globalVars.siteLangages.length - 1; i >= 0; i--) {
      $scope.item['meta_keywords_'+globalVars.siteLangages[i]];
    };
  }	
}])
angular.module('Peaks.Portfolio').controller('PortfolioCategoriesListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
	
  var config = {
    section : "portfolio/categories",
    menu : 'portfolio',
    getUrl : '/admin_portfolio/categories_list/',
    deleteUrl : 'admin_portfolio/category_delete/'
  }

  $scope.table = [
      {title : 'Titre', param : 'name_' + globalVars.defaultLanguage, strong : true},
      {title : 'Ordre', param : 'weight'},
      {title : 'Nombre d\éléments', param : 'childs_count'}
    ];

  $scope.pageTitle = 'Catégories de porfolios';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}])
angular.module('Peaks.Portfolio').controller('PortfolioListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
  var config = {
    section : "portfolio/portfolios",
    menu : 'portfolio',
    getUrl : '/admin_portfolio/portfolio_list/',
    deleteUrl : 'admin_portfolio/delete/'
  }

  $scope.table = [
      {title: '', param : 'src', width: '60px'},
      {title : 'Titre', param : 'name', strong : true},
      {title : 'Nombre d\éléments', param : 'childs_count'}
    ];

  $scope.pageTitle = 'Galleries';
  $scope.thumbPath = 'portfolio';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});
}])
angular.module('Peaks.Portfolio').controller('PortfolioEditCtrl', ['$scope', '$http', '$stateParams', 'PortfolioCategoriesRepository', 'PortfolioItemsRepository', 'TagsRespository',function($scope, $http, $stateParams, portfolioCategoriesRepository, portfolioItemsRepository, tagsRespository){
  
  $scope.section = "portfolio/portfolios";
  menuControl('portfolio');

  $scope.tinymceOptions = tinymceConfig;

  init_page();

  var id = $stateParams.id;
  $scope.mode =  id;

  $scope.editHide = true;
  $scope.editShow = false;

  $scope.uploader = {
    w : 300,
    h : 300,
    item_id : id,
    folder : 'assets/images/portfolio/'+id+'/thumbs/',
    assetPath : 'portfolio~'+id+'~thumbs',
    crop : 1,
    uniqueName : true
  }

  $scope.assetsList = {
    folder : 'assets/images/portfolio/'+id+'/',
    assetPath : 'portfolio~'+id,
    parentIdentity : 'portfolio_item'
  }

  $scope.select2Tags = {
      'multiple': true,
      'simple_tags': true,
      //'tags': true,  // Can be empty list.
      'tokenSeparators' : [","],
      initSelection : function(element)
      {
        console.log(this);
      }
  };

  tagsRespository.tagNamesList(function(data)
  {
    $scope.select2Tags.tags = data;
  });

  portfolioCategoriesRepository.categoriesList(function(categories)
  {
    console.log(categories);
    $scope.categories = categories.items;
  });

  $scope.createNewCategoty = function ()
  {
    $scope.alert = 'Création de la catégories';
    showAlert();
    portfolioCategoriesRepository.saveCategory($scope.newCategory, function(data)
    {
      $scope.categories.push({id:data.id, name: data.name});
      $scope.alert = data.message;
      showFadeAlert();
    });
  }

  var getTheItem = function(){
    portfolioItemsRepository.getItem(id, function(data)
    {
          
      var temp = {};

      angular.forEach(data.categories, function(category)
      {
        temp[category.parent_id] = true;
      });

      data.categories = temp;

      $scope.item = data;

      console.log($scope.item);

    });
  }

  $scope.save = function (returnToList) {

    $scope.alert = 'Sauvegarde…';
    showAlert();

     console.log($scope.item);

    portfolioItemsRepository.saveItem($scope.item, function(data)
    {
        if (returnToList && data.errors.length === 0) {
          window.location.hash = '/portfolio/portfolios';
        }
        else if (id === 'new' && data.errors.length === 0)
        {
          window.location.hash = '/portfolio/portfolios/edit/' + data.id;
        }
        else
        {
          $scope.alert = data.message;
          $scope.errors = data.errors;
          showFadeAlert();
          getTheItem();
        }
    });   
  }

  $scope.delete = function () {
    bootbox.confirm('Etes vous sur de vouloir supprimer cet élément ?', function(invoke)
    {
      if (invoke) {
        $http.get('/admin_portfolio/delete/'+id).success(function(data) {
          window.location.hash = '/portfolio/portfolios';
        });
      };
    });
  }

  if ($scope.mode != 'new') {
    getTheItem();
  } 
  else {
    $scope.hideForNew = true;
    $scope.item = {
      //'meta_keywords' : {},
      'categories' : {}
    };
/*    console.log(globalVars.siteLanguages.length);
    for (var i = globalVars.siteLangages.length - 1; i >= 0; i--) {
      $scope.item['meta_keywords_'+globalVars.siteLangages[i]];
    };*/
    angular.forEach(globalVars.siteLangages, function(lang)
    {
      $scope.item['meta_keywords_'+lang] = [];
    }); 
  }	
}])
angular.module('Peaks.Portfolio.Repositories').factory('PortfolioCategoriesRepository', ['$http', function($http){

  var categoriesCache = false;

  return { 
    categoriesList : function(callback)
    {
      if (categoriesCache) {
        callback(categoriesCache);
      };
      $http.get('/admin_portfolio/categories_list').success(function(data) {
        callback(data);
        categoriesCache = data;
      });
    },
    getCategory : function(id, callback)
    {
      $http.get('/admin_portfolio/category_details/'+id).success(function(data)
        {
          callback(data);
        });
    },    
    saveCategory : function(data, callback)
    {

     $http({
          url: '/admin_portfolio/category_edit',
          method: "POST",
          data: data,
          headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {
              console.log(data);
              callback(data);
          }).error(function (data, status, headers, config) {
              alert = 'Une erreure est survenue.';
          });
    },
    deleteCategory : function(id, callback)
    {
      $http.get('/admin_portfolio/category_delete/' + id).success(function(data)
      {
        callback(data);
      });
    }
  }; 
}]);
angular.module('Peaks.Portfolio.Repositories').factory('PortfolioItemsRepository', ['$http', function($http){

  return { 
    getItem : function(id, callback)
    {
      $http.get('/admin_portfolio/item_details/'+id).success(function(data)
        {
          callback(data);
        });
    },    
    saveItem : function(data, callback)
    {

     $http({
          url: '/admin_portfolio/item_edit',
          method: "POST",
          data: data,
          headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {
              console.log(data);
              callback(data);
          }).error(function (data, status, headers, config) {
              alert = 'Une erreure est survenue.';
          });
    },
    deleteItem : function(id, callback)
    {
      $http.get('/admin_portfolio/item_delete/' + id).success(function(data)
      {
        callback(data);
      });
    }
  }; 
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9wb3Jmb2xpby5tb2R1bGUuanMiLCJjdHJsLmNhdGVnb3JpZXNFZGl0LmpzIiwiY3RybC5jYXRlZ29yaWVzTGlzdC5qcyIsImN0cmwucG9yZm9saW9MaXN0LmpzIiwiY3RybC5wb3J0Zm9saW9FZGl0LmpzIiwicmVwby5jYXRlZ29yaWVzLmpzIiwicmVwby5wb3J0Zm9ybGlvSXRlbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJwb3J0Zm9saW8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnUGVha3MuUG9ydGZvbGlvJywgWydQZWFrcy5NYW5hZ2VyLlJlcG9zaXRvcmllcycsICdQZWFrcy5Qb3J0Zm9saW8uU2VydmljZXMnLCAnUGVha3MuUG9ydGZvbGlvLkRpcmVjdGl2ZXMnLCAnUGVha3MuUG9ydGZvbGlvLlJlcG9zaXRvcmllcyddKTtcclxuYW5ndWxhci5tb2R1bGUoJ1BlYWtzLlBvcnRmb2xpby5TZXJ2aWNlcycsIFtdKTtcclxuYW5ndWxhci5tb2R1bGUoJ1BlYWtzLlBvcnRmb2xpby5EaXJlY3RpdmVzJywgW10pO1xyXG5hbmd1bGFyLm1vZHVsZSgnUGVha3MuUG9ydGZvbGlvLlJlcG9zaXRvcmllcycsIFtdKSIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5Qb3J0Zm9saW8nKS5jb250cm9sbGVyKCdQb3J0Zm9saW9DYXRlZ29yeUVkaXRDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ1BvcnRmb2xpb0NhdGVnb3JpZXNSZXBvc2l0b3J5JywgJ1RhZ3NSZXNwb3NpdG9yeScsICdTY29wZUNhY2hlUHJvdmlkZXInLCBcclxuICBmdW5jdGlvbigkc2NvcGUsICRyb3V0ZVBhcmFtcywgcG9ydGZvbGlvQ2F0ZWdvcmllc1JlcG9zaXRvcnksIHRhZ3NSZXNwb3NpdG9yeSwgc2NvcGVDYWNoZVByb3ZpZGVyKXtcclxuXHJcbiAgbWVudUNvbnRyb2woJ3BvcnRmb2xpbycpO1xyXG5cclxuICAkc2NvcGUuYmFja1VybCA9ICdwb3J0Zm9saW8vY2F0ZWdvcmllcyc7XHJcblxyXG4gIGluaXRfcGFnZSgpO1xyXG5cclxuICB2YXIgaWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcbiAgJHNjb3BlLm1vZGUgPSAgaWQ7XHJcblxyXG4gJHNjb3BlLnNlbGVjdDJUYWdzID0ge1xyXG4gICAgICAnbXVsdGlwbGUnOiB0cnVlLFxyXG4gICAgICAnc2ltcGxlX3RhZ3MnOiB0cnVlLFxyXG4gICAgICAvLyd0YWdzJzogdHJ1ZSwgIC8vIENhbiBiZSBlbXB0eSBsaXN0LlxyXG4gICAgICAndG9rZW5TZXBhcmF0b3JzJyA6IFtcIixcIl0sXHJcbiAgICAgIGluaXRTZWxlY3Rpb24gOiBmdW5jdGlvbihlbGVtZW50KVxyXG4gICAgICB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICAgIH1cclxuICB9O1xyXG5cclxuICB0YWdzUmVzcG9zaXRvcnkudGFnTmFtZXNMaXN0KGZ1bmN0aW9uKGRhdGEpXHJcbiAge1xyXG4gICAgJHNjb3BlLnNlbGVjdDJUYWdzLnRhZ3MgPSBkYXRhO1xyXG4gIH0pO1xyXG5cclxuXHJcbiAgdmFyIGdldFRoZUl0ZW0gPSBmdW5jdGlvbigpe1xyXG4gICAgcG9ydGZvbGlvQ2F0ZWdvcmllc1JlcG9zaXRvcnkuZ2V0Q2F0ZWdvcnkoaWQsIGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgICRzY29wZS5pdGVtID0gZGF0YTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAocmV0dXJuVG9MaXN0KSB7XHJcbiAgICAkc2NvcGUuYWxlcnQgPSAnU2F1dmVnYXJkZSAuLi4nO1xyXG4gICAgc2hvd0FsZXJ0KCk7XHJcblxyXG4gICAgcG9ydGZvbGlvQ2F0ZWdvcmllc1JlcG9zaXRvcnkuc2F2ZUNhdGVnb3J5KCRzY29wZS5pdGVtLCBmdW5jdGlvbihkYXRhKVxyXG4gICAge1xyXG4gICAgICAgIGlmIChyZXR1cm5Ub0xpc3QgJiYgZGF0YS5lcnJvcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvcG9ydGZvbGlvL2NhdGVnb3JpZXMnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChpZCA9PT0gJ25ldycgJiYgZGF0YS5lcnJvcnMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJy9wb3J0Zm9saW8vY2F0ZWdvcmllcy9lZGl0LycgKyBkYXRhLmlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJHNjb3BlLmFsZXJ0ID0gZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgICAgJHNjb3BlLmVycm9ycyA9IGRhdGEuZXJyb3JzO1xyXG4gICAgICAgICAgc2hvd0ZhZGVBbGVydCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChjb25maXJtKCdFdGVzIHZvdXMgc3VyIGRlIHZvdWxvaXIgc3VwcHJpbWVyIGNldHRlIGNhdMOpZ29yaWVzID8nKSkgXHJcbiAgICB7XHJcbiAgICAgIHBvcnRmb2xpb0NhdGVnb3JpZXNSZXBvc2l0b3J5LmRlbGV0ZUNhdGVnb3J5KGlkLCBmdW5jdGlvbihkYXRhKVxyXG4gICAgICB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL3BvcnRmb2xpby9jYXRlZ29yaWVzJztcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgPSAgICAgICAgICAgIEdlc3Rpb24gZHUgY2FjaGUgY29tcGxldCBkZSB2dWUgICAgICAgICAgICA9XHJcbiAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXHJcbiAgXHJcbi8qICAkc2NvcGUuJG9uKCckZGVzdHJveScsIGZ1bmN0aW9uKCkge1xyXG4gICAgICBhbGVydChcIkluIGRlc3Ryb3kgb2Y6XCIpO1xyXG4gICAgICBzY29wZUNhY2hlUHJvdmlkZXIuU2V0KCdQb3J0Zm9saW9DYXRlZ29yaWVzJyArICRzY29wZS5pdGVtLmlkLCAkc2NvcGUpO1xyXG4gIH0pO1xyXG4gICovXHJcbiAgLyotLS0tLSAgRW5kIG9mIEdlc3Rpb24gZHUgY2FjaGUgY29tcGxldCBkZSB2dWUgIC0tLS0tLSovXHJcbiAgXHJcbiAgXHJcblxyXG4gIGlmICgkc2NvcGUubW9kZSAhPSAnbmV3Jykge1xyXG4gICAgZ2V0VGhlSXRlbSgpO1xyXG4gIH0gXHJcbiAgZWxzZSB7XHJcbiAgICAkc2NvcGUuaGlkZUZvck5ldyA9IHRydWU7XHJcbiAgICAkc2NvcGUuaXRlbSA9IHtcclxuICAgICAgICAvL21ldGFfa2V5d29yZHMgOiBuZXcgQXJyYXkoKVxyXG4gICAgICB9O1xyXG4gICAgZm9yICh2YXIgaSA9IGdsb2JhbFZhcnMuc2l0ZUxhbmdhZ2VzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICRzY29wZS5pdGVtWydtZXRhX2tleXdvcmRzXycrZ2xvYmFsVmFycy5zaXRlTGFuZ2FnZXNbaV1dO1xyXG4gICAgfTtcclxuICB9XHRcclxufV0pIiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLlBvcnRmb2xpbycpLmNvbnRyb2xsZXIoJ1BvcnRmb2xpb0NhdGVnb3JpZXNMaXN0Q3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRpbmplY3RvcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRpbmplY3Rvcil7XHJcblx0XHJcbiAgdmFyIGNvbmZpZyA9IHtcclxuICAgIHNlY3Rpb24gOiBcInBvcnRmb2xpby9jYXRlZ29yaWVzXCIsXHJcbiAgICBtZW51IDogJ3BvcnRmb2xpbycsXHJcbiAgICBnZXRVcmwgOiAnL2FkbWluX3BvcnRmb2xpby9jYXRlZ29yaWVzX2xpc3QvJyxcclxuICAgIGRlbGV0ZVVybCA6ICdhZG1pbl9wb3J0Zm9saW8vY2F0ZWdvcnlfZGVsZXRlLydcclxuICB9XHJcblxyXG4gICRzY29wZS50YWJsZSA9IFtcclxuICAgICAge3RpdGxlIDogJ1RpdHJlJywgcGFyYW0gOiAnbmFtZV8nICsgZ2xvYmFsVmFycy5kZWZhdWx0TGFuZ3VhZ2UsIHN0cm9uZyA6IHRydWV9LFxyXG4gICAgICB7dGl0bGUgOiAnT3JkcmUnLCBwYXJhbSA6ICd3ZWlnaHQnfSxcclxuICAgICAge3RpdGxlIDogJ05vbWJyZSBkXFzDqWzDqW1lbnRzJywgcGFyYW0gOiAnY2hpbGRzX2NvdW50J31cclxuICAgIF07XHJcblxyXG4gICRzY29wZS5wYWdlVGl0bGUgPSAnQ2F0w6lnb3JpZXMgZGUgcG9yZm9saW9zJztcclxuXHJcbiAgJGluamVjdG9yLmludm9rZShJdGVtTGlzdCwgdGhpcywgeyRzY29wZTogJHNjb3BlLCAkaHR0cDogJGh0dHAsIGNvbmZpZzogY29uZmlnfSk7XHJcblxyXG59XSkiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuUG9ydGZvbGlvJykuY29udHJvbGxlcignUG9ydGZvbGlvTGlzdEN0cmwnLCBbJyRzY29wZScsICckaHR0cCcsICckaW5qZWN0b3InLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkaW5qZWN0b3Ipe1xyXG4gIHZhciBjb25maWcgPSB7XHJcbiAgICBzZWN0aW9uIDogXCJwb3J0Zm9saW8vcG9ydGZvbGlvc1wiLFxyXG4gICAgbWVudSA6ICdwb3J0Zm9saW8nLFxyXG4gICAgZ2V0VXJsIDogJy9hZG1pbl9wb3J0Zm9saW8vcG9ydGZvbGlvX2xpc3QvJyxcclxuICAgIGRlbGV0ZVVybCA6ICdhZG1pbl9wb3J0Zm9saW8vZGVsZXRlLydcclxuICB9XHJcblxyXG4gICRzY29wZS50YWJsZSA9IFtcclxuICAgICAge3RpdGxlOiAnJywgcGFyYW0gOiAnc3JjJywgd2lkdGg6ICc2MHB4J30sXHJcbiAgICAgIHt0aXRsZSA6ICdUaXRyZScsIHBhcmFtIDogJ25hbWUnLCBzdHJvbmcgOiB0cnVlfSxcclxuICAgICAge3RpdGxlIDogJ05vbWJyZSBkXFzDqWzDqW1lbnRzJywgcGFyYW0gOiAnY2hpbGRzX2NvdW50J31cclxuICAgIF07XHJcblxyXG4gICRzY29wZS5wYWdlVGl0bGUgPSAnR2FsbGVyaWVzJztcclxuICAkc2NvcGUudGh1bWJQYXRoID0gJ3BvcnRmb2xpbyc7XHJcblxyXG4gICRpbmplY3Rvci5pbnZva2UoSXRlbUxpc3QsIHRoaXMsIHskc2NvcGU6ICRzY29wZSwgJGh0dHA6ICRodHRwLCBjb25maWc6IGNvbmZpZ30pO1xyXG59XSkiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuUG9ydGZvbGlvJykuY29udHJvbGxlcignUG9ydGZvbGlvRWRpdEN0cmwnLCBbJyRzY29wZScsICckaHR0cCcsICckc3RhdGVQYXJhbXMnLCAnUG9ydGZvbGlvQ2F0ZWdvcmllc1JlcG9zaXRvcnknLCAnUG9ydGZvbGlvSXRlbXNSZXBvc2l0b3J5JywgJ1RhZ3NSZXNwb3NpdG9yeScsZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zLCBwb3J0Zm9saW9DYXRlZ29yaWVzUmVwb3NpdG9yeSwgcG9ydGZvbGlvSXRlbXNSZXBvc2l0b3J5LCB0YWdzUmVzcG9zaXRvcnkpe1xyXG4gIFxyXG4gICRzY29wZS5zZWN0aW9uID0gXCJwb3J0Zm9saW8vcG9ydGZvbGlvc1wiO1xyXG4gIG1lbnVDb250cm9sKCdwb3J0Zm9saW8nKTtcclxuXHJcbiAgJHNjb3BlLnRpbnltY2VPcHRpb25zID0gdGlueW1jZUNvbmZpZztcclxuXHJcbiAgaW5pdF9wYWdlKCk7XHJcblxyXG4gIHZhciBpZCA9ICRzdGF0ZVBhcmFtcy5pZDtcclxuICAkc2NvcGUubW9kZSA9ICBpZDtcclxuXHJcbiAgJHNjb3BlLmVkaXRIaWRlID0gdHJ1ZTtcclxuICAkc2NvcGUuZWRpdFNob3cgPSBmYWxzZTtcclxuXHJcbiAgJHNjb3BlLnVwbG9hZGVyID0ge1xyXG4gICAgdyA6IDMwMCxcclxuICAgIGggOiAzMDAsXHJcbiAgICBpdGVtX2lkIDogaWQsXHJcbiAgICBmb2xkZXIgOiAnYXNzZXRzL2ltYWdlcy9wb3J0Zm9saW8vJytpZCsnL3RodW1icy8nLFxyXG4gICAgYXNzZXRQYXRoIDogJ3BvcnRmb2xpb34nK2lkKyd+dGh1bWJzJyxcclxuICAgIGNyb3AgOiAxLFxyXG4gICAgdW5pcXVlTmFtZSA6IHRydWVcclxuICB9XHJcblxyXG4gICRzY29wZS5hc3NldHNMaXN0ID0ge1xyXG4gICAgZm9sZGVyIDogJ2Fzc2V0cy9pbWFnZXMvcG9ydGZvbGlvLycraWQrJy8nLFxyXG4gICAgYXNzZXRQYXRoIDogJ3BvcnRmb2xpb34nK2lkLFxyXG4gICAgcGFyZW50SWRlbnRpdHkgOiAncG9ydGZvbGlvX2l0ZW0nXHJcbiAgfVxyXG5cclxuICAkc2NvcGUuc2VsZWN0MlRhZ3MgPSB7XHJcbiAgICAgICdtdWx0aXBsZSc6IHRydWUsXHJcbiAgICAgICdzaW1wbGVfdGFncyc6IHRydWUsXHJcbiAgICAgIC8vJ3RhZ3MnOiB0cnVlLCAgLy8gQ2FuIGJlIGVtcHR5IGxpc3QuXHJcbiAgICAgICd0b2tlblNlcGFyYXRvcnMnIDogW1wiLFwiXSxcclxuICAgICAgaW5pdFNlbGVjdGlvbiA6IGZ1bmN0aW9uKGVsZW1lbnQpXHJcbiAgICAgIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcclxuICAgICAgfVxyXG4gIH07XHJcblxyXG4gIHRhZ3NSZXNwb3NpdG9yeS50YWdOYW1lc0xpc3QoZnVuY3Rpb24oZGF0YSlcclxuICB7XHJcbiAgICAkc2NvcGUuc2VsZWN0MlRhZ3MudGFncyA9IGRhdGE7XHJcbiAgfSk7XHJcblxyXG4gIHBvcnRmb2xpb0NhdGVnb3JpZXNSZXBvc2l0b3J5LmNhdGVnb3JpZXNMaXN0KGZ1bmN0aW9uKGNhdGVnb3JpZXMpXHJcbiAge1xyXG4gICAgY29uc29sZS5sb2coY2F0ZWdvcmllcyk7XHJcbiAgICAkc2NvcGUuY2F0ZWdvcmllcyA9IGNhdGVnb3JpZXMuaXRlbXM7XHJcbiAgfSk7XHJcblxyXG4gICRzY29wZS5jcmVhdGVOZXdDYXRlZ290eSA9IGZ1bmN0aW9uICgpXHJcbiAge1xyXG4gICAgJHNjb3BlLmFsZXJ0ID0gJ0Nyw6lhdGlvbiBkZSBsYSBjYXTDqWdvcmllcyc7XHJcbiAgICBzaG93QWxlcnQoKTtcclxuICAgIHBvcnRmb2xpb0NhdGVnb3JpZXNSZXBvc2l0b3J5LnNhdmVDYXRlZ29yeSgkc2NvcGUubmV3Q2F0ZWdvcnksIGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgICRzY29wZS5jYXRlZ29yaWVzLnB1c2goe2lkOmRhdGEuaWQsIG5hbWU6IGRhdGEubmFtZX0pO1xyXG4gICAgICAkc2NvcGUuYWxlcnQgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmFyIGdldFRoZUl0ZW0gPSBmdW5jdGlvbigpe1xyXG4gICAgcG9ydGZvbGlvSXRlbXNSZXBvc2l0b3J5LmdldEl0ZW0oaWQsIGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgICAgICBcclxuICAgICAgdmFyIHRlbXAgPSB7fTtcclxuXHJcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLmNhdGVnb3JpZXMsIGZ1bmN0aW9uKGNhdGVnb3J5KVxyXG4gICAgICB7XHJcbiAgICAgICAgdGVtcFtjYXRlZ29yeS5wYXJlbnRfaWRdID0gdHJ1ZTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBkYXRhLmNhdGVnb3JpZXMgPSB0ZW1wO1xyXG5cclxuICAgICAgJHNjb3BlLml0ZW0gPSBkYXRhO1xyXG5cclxuICAgICAgY29uc29sZS5sb2coJHNjb3BlLml0ZW0pO1xyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAocmV0dXJuVG9MaXN0KSB7XHJcblxyXG4gICAgJHNjb3BlLmFsZXJ0ID0gJ1NhdXZlZ2FyZGXigKYnO1xyXG4gICAgc2hvd0FsZXJ0KCk7XHJcblxyXG4gICAgIGNvbnNvbGUubG9nKCRzY29wZS5pdGVtKTtcclxuXHJcbiAgICBwb3J0Zm9saW9JdGVtc1JlcG9zaXRvcnkuc2F2ZUl0ZW0oJHNjb3BlLml0ZW0sIGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgICAgaWYgKHJldHVyblRvTGlzdCAmJiBkYXRhLmVycm9ycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJy9wb3J0Zm9saW8vcG9ydGZvbGlvcyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGlkID09PSAnbmV3JyAmJiBkYXRhLmVycm9ycy5sZW5ndGggPT09IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL3BvcnRmb2xpby9wb3J0Zm9saW9zL2VkaXQvJyArIGRhdGEuaWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICB7XHJcbiAgICAgICAgICAkc2NvcGUuYWxlcnQgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gZGF0YS5lcnJvcnM7XHJcbiAgICAgICAgICBzaG93RmFkZUFsZXJ0KCk7XHJcbiAgICAgICAgICBnZXRUaGVJdGVtKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7ICAgXHJcbiAgfVxyXG5cclxuICAkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgYm9vdGJveC5jb25maXJtKCdFdGVzIHZvdXMgc3VyIGRlIHZvdWxvaXIgc3VwcHJpbWVyIGNldCDDqWzDqW1lbnQgPycsIGZ1bmN0aW9uKGludm9rZSlcclxuICAgIHtcclxuICAgICAgaWYgKGludm9rZSkge1xyXG4gICAgICAgICRodHRwLmdldCgnL2FkbWluX3BvcnRmb2xpby9kZWxldGUvJytpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvcG9ydGZvbGlvL3BvcnRmb2xpb3MnO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAoJHNjb3BlLm1vZGUgIT0gJ25ldycpIHtcclxuICAgIGdldFRoZUl0ZW0oKTtcclxuICB9IFxyXG4gIGVsc2Uge1xyXG4gICAgJHNjb3BlLmhpZGVGb3JOZXcgPSB0cnVlO1xyXG4gICAgJHNjb3BlLml0ZW0gPSB7XHJcbiAgICAgIC8vJ21ldGFfa2V5d29yZHMnIDoge30sXHJcbiAgICAgICdjYXRlZ29yaWVzJyA6IHt9XHJcbiAgICB9O1xyXG4vKiAgICBjb25zb2xlLmxvZyhnbG9iYWxWYXJzLnNpdGVMYW5ndWFnZXMubGVuZ3RoKTtcclxuICAgIGZvciAodmFyIGkgPSBnbG9iYWxWYXJzLnNpdGVMYW5nYWdlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAkc2NvcGUuaXRlbVsnbWV0YV9rZXl3b3Jkc18nK2dsb2JhbFZhcnMuc2l0ZUxhbmdhZ2VzW2ldXTtcclxuICAgIH07Ki9cclxuICAgIGFuZ3VsYXIuZm9yRWFjaChnbG9iYWxWYXJzLnNpdGVMYW5nYWdlcywgZnVuY3Rpb24obGFuZylcclxuICAgIHtcclxuICAgICAgJHNjb3BlLml0ZW1bJ21ldGFfa2V5d29yZHNfJytsYW5nXSA9IFtdO1xyXG4gICAgfSk7IFxyXG4gIH1cdFxyXG59XSkiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuUG9ydGZvbGlvLlJlcG9zaXRvcmllcycpLmZhY3RvcnkoJ1BvcnRmb2xpb0NhdGVnb3JpZXNSZXBvc2l0b3J5JywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgdmFyIGNhdGVnb3JpZXNDYWNoZSA9IGZhbHNlO1xyXG5cclxuICByZXR1cm4geyBcclxuICAgIGNhdGVnb3JpZXNMaXN0IDogZnVuY3Rpb24oY2FsbGJhY2spXHJcbiAgICB7XHJcbiAgICAgIGlmIChjYXRlZ29yaWVzQ2FjaGUpIHtcclxuICAgICAgICBjYWxsYmFjayhjYXRlZ29yaWVzQ2FjaGUpO1xyXG4gICAgICB9O1xyXG4gICAgICAkaHR0cC5nZXQoJy9hZG1pbl9wb3J0Zm9saW8vY2F0ZWdvcmllc19saXN0Jykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgY2F0ZWdvcmllc0NhY2hlID0gZGF0YTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0Q2F0ZWdvcnkgOiBmdW5jdGlvbihpZCwgY2FsbGJhY2spXHJcbiAgICB7XHJcbiAgICAgICRodHRwLmdldCgnL2FkbWluX3BvcnRmb2xpby9jYXRlZ29yeV9kZXRhaWxzLycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sICAgIFxyXG4gICAgc2F2ZUNhdGVnb3J5IDogZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spXHJcbiAgICB7XHJcblxyXG4gICAgICRodHRwKHtcclxuICAgICAgICAgIHVybDogJy9hZG1pbl9wb3J0Zm9saW8vY2F0ZWdvcnlfZWRpdCcsXHJcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgYWxlcnQgPSAnVW5lIGVycmV1cmUgZXN0IHN1cnZlbnVlLic7XHJcbiAgICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBkZWxldGVDYXRlZ29yeSA6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICAgIHtcclxuICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fcG9ydGZvbGlvL2NhdGVnb3J5X2RlbGV0ZS8nICsgaWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAge1xyXG4gICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9OyBcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5Qb3J0Zm9saW8uUmVwb3NpdG9yaWVzJykuZmFjdG9yeSgnUG9ydGZvbGlvSXRlbXNSZXBvc2l0b3J5JywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgcmV0dXJuIHsgXHJcbiAgICBnZXRJdGVtIDogZnVuY3Rpb24oaWQsIGNhbGxiYWNrKVxyXG4gICAge1xyXG4gICAgICAkaHR0cC5nZXQoJy9hZG1pbl9wb3J0Zm9saW8vaXRlbV9kZXRhaWxzLycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sICAgIFxyXG4gICAgc2F2ZUl0ZW0gOiBmdW5jdGlvbihkYXRhLCBjYWxsYmFjaylcclxuICAgIHtcclxuXHJcbiAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgdXJsOiAnL2FkbWluX3BvcnRmb2xpby9pdGVtX2VkaXQnLFxyXG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgIGFsZXJ0ID0gJ1VuZSBlcnJldXJlIGVzdCBzdXJ2ZW51ZS4nO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZGVsZXRlSXRlbSA6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICAgIHtcclxuICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fcG9ydGZvbGlvL2l0ZW1fZGVsZXRlLycgKyBpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07IFxyXG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9