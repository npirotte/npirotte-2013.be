angular.module('Peaks.News', ['Peaks.News.Repositories']);
//angular.module('Peaks.News.Services', []);
//angular.module('Peaks.News.Directives', []);
angular.module('Peaks.News.Repositories', [])
angular.module('Peaks.News').controller('NewsCategoriesEditCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams){

  $scope.section = "news/categories";
  menuControl('news');

  var id = $stateParams.id
  $scope.mode = id;

  var getThePage = function()
  {
    $http.get('/admin_news/get_category/'+id).success(function(data) {
      console.log(data);
      $scope.item = data.content_items;
      init_page();
    });
  }

  var getTheItems = function(limit, offset)
  {
    $http.get('/admin_news/category_childs/'+id +'/'+limit+'/'+offset).success(function(data) {
      $scope.totalItems = data.total_items;
      $scope.childs = data.items;
      init_page();
    });
  }

  // pagination
  
  $scope.currentPage = 0;
  $scope.maxSize = 5;
  $scope.itemPerPage = 20;
  $scope.offset = 0;
  
  $scope.setGetPage = function (pageNo) {
    $scope.currentPage = pageNo;
    $scope.offset = $scope.currentPage * $scope.itemPerPage - $scope.itemPerPage;
    getTheItems($scope.itemPerPage, $scope.offset);
  };

  $scope.getView = function(id)
  {
    window.location.hash = '/news/items/'+id;
    block();
  }

  $scope.save = function () {

    $scope.alert = "Sauvegarde";
    showAlert();

    $http({
            url: '/admin_news/category_edit',
            method: "POST",
            data: $scope.item,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
              console.log(data);
                if (id == 'new' && data.errors.length === 0) { window.location.hash = '/news/categories/edit/'+data.id; }
                else
                {
                   $scope.alert = data.message;
                   $scope.errors = data.errors;
                   showFadeAlert();
                  //formatStatut()
                }
            }).error(function (data, status, headers, config) {
                $scope.alert = 'Une erreure est survenue.';
                showFadeAlert();
                console.log(data);
            });
  }

  $scope.delete = function()
  {
    $scope.alert = 'Supression';
    showAlert();

    $http.get('/admin_news/category_delete/' + id).success(function(data)
    {
      window.location.hash = '/news/categories';
    });
  }

  getThePage();
  getTheItems($scope.itemPerPage, 0);

}])
angular.module('Peaks.News').controller('NewsCategoriesListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
	
  var config = {
    section : "news/categories",
    menu : 'news',
    getUrl : '/admin_news/categories_list/',
    deleteUrl : 'admin_news/category_delete/',
  }

  $scope.table = [
      {title : 'Nom', param : 'name'},
      {title: 'Nbr de news', param : 'childs_count'}
    ];

  $scope.pageTitle = 'Catégories de news';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}]);
angular.module('Peaks.News').controller('NewsItemsEditCtrl', ['$scope', '$http', '$stateParams', 'TagsRespository', 'NewsCategoriesRepository', 
	function($scope, $http, $stateParams, tagsRespository, newsCategoriesRepository){

  init_page();
  

  $scope.section = "news/items";
  menuControl('news');

  var id = $stateParams.id;
  $scope.mode =  id;

  $scope.faIcons = ['fa-home', 'fa-pencil', 'fa-map-marker'];

  $scope.tinymceOptions = tinymceConfig;

  $scope.uploader = {
        w : 200,
        h : 200,
        item_id : 0,
        folder : 'assets/images/news/'+id+'/thumbs/',
        assetPath : 'news~'+id+'~thumbs',
        crop : 1,
        uniqueName : true
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

  $scope.assetsList = {
    folder : 'assets/images/news/'+id+'/',
    assetPath : 'news~'+id,
    parentIdentity : 'news_item'
  }

  function getCatagoryData(categoryId)
  {
    newsCategoriesRepository.GetItem(categoryId, function(data)
    {
      $scope.uploader.h = data.thumb_h;
      $scope.uploader.w = data.thumb_w;
    })
  }

  $scope.$watch('item.parent_id', function(newValue)
  {
    getCatagoryData(newValue);
  });

  function getThePage(){
    $http.get('/admin_news/get_news/'+id).success(function(data) {
      console.log(data);
      $scope.item = data.content_items;
      $scope.person  = data.person_info;
      $scope.today = data.today;

      getCatagoryData(data.content_items.parent_id);

      formatStatut();
      init_page();
    });
  };

  function formatStatut()
  {

    if ($scope.item.published_on == null) {$scope.statut = 'draft'}
    else if (Date.parse($scope.item.published_on) > Date.parse($scope.today)) {$scope.statut = 'pending'}
    else if (Date.parse($scope.item.archived_on) <= Date.parse($scope.today)) {$scope.statut = 'archived'}
    else {$scope.statut = 'online'}; 
    
  }

  function getCategories()
  {
    $http.get('/admin_news/categories_list').success(function(data)
    {
       $scope.categories = data.items;
    });
  }

  getCategories();

  $scope.save = function () {

    if ( id == 'new') {
      $scope.item.created_by = globalVars.user_id;
    };

    console.log($scope.item);

    $http({
            url: '/admin_news/news_edit',
            method: "POST",
            data: $scope.item,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
              console.log(data);
                if (id == 'new' && data.errors.length === 0) { window.location.hash = '/news/edit/'+data.id; }
                else
                {
                   $scope.alert = data.message;
                   $scope.errors = data.errors;
                   showFadeAlert();
                  formatStatut()
                }
            }).error(function (data, status, headers, config) {
                $scope.alert = 'Une erreure est survenue.';
                showFadeAlert();
            });
  }

  $scope.delete = function () {
    $http.get('/admin_news/delete/'+id).success(function(data) {
      window.location.hash = '/news/list';
    });
  } 

  $scope.pushOnline = function () {
    $http.get('/admin_news/push_online/'+id).success(function(data) {
      $scope.alert = "News mise en ligne.";
      showFadeAlert();
      $scope.item['published_on'] = $scope.today;
      formatStatut();
    });
  }

  $scope.pushOffline = function () {

    $http.get('/admin_news/push_offline/'+id).success(function(data) {
      $scope.alert = "News archivée.";
      showFadeAlert();
      $scope.item['archived_on'] = $scope.today;
      formatStatut();
    });
  }

  $('input').click(function($scope)
  {
   $('.alert-container').fadeOut();
  });

  if (id != 'new') {
    getThePage();
  }
  else {
    $scope.hideForNew = true;
    $scope.item = {
      meta_tags : []
    }
  }

}])
angular.module('Peaks.News').controller('NewsItemsListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){

  var config = {
    section : "news/items",
    menu : 'news',
    getUrl : '/admin_news/news_list/',
    deleteUrl : 'admin_news/delete_news/',
    getCallBack : function(data)
    {
        // traitement du statut utilisateur 
      var i = 0;

      angular.forEach($scope.items, function(item){
        if ($scope.items[i].published_on == null) {$scope.items[i].statut = 'warning'}
        else if (Date.parse($scope.items[i].published_on) > Date.parse(data.today)) {$scope.items[i].statut = 'info'}
        else if (Date.parse($scope.items[i].archived_on) <= Date.parse(data.today)) {$scope.items[i].statut = 'offline'}
        else {$scope.items[i].statut = 'success'}; 
        i++;
      });
    }
  }

  $scope.table = [
      {title : 'Titre', param : 'title'},
      {title : 'Catégorie', param : 'category_name'},
      {title : 'Auteur', param : 'created_by'}
    ];

  $scope.pageTitle = 'News';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});
  
}])
angular.module('Peaks.News.Repositories').factory('NewsCategoriesRepository', ['$http', function($http){

  return { 
  	GetItem : function(id, callback)
  	{
      $http.get('/admin_news/get_category/'+id)
          .success(function(data)
          {
            callback (data.content_items);
          });
  	},
  	/*SaveItem : function(data, callback)
  	{
      $http({
          url: '/admin_menus/menu_edit',
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
  	DeleteItem : function(id, callback)
  	{
      $http.get('/admin_menus/menu_delete/'+id)
          .success(function(data)
          {
            callback (data);
          });
  	}*/
  }

 }]);
angular.module('Peaks.News.Repositories').factory('NewsItemsRepository', ['$http', function($http){

  return { 
  	GetItem : function(id, callback)
  	{
      $http.get('/admin_menus/item_details/'+id)
          .success(function(data)
          {
            callback (data);
          });
  	},
  	SaveItem : function(data, callback)
  	{
      $http({
          url: '/admin_menus/item_edit',
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
    ReorderItem : function(data, callback)
    {
      $http({
          url: '/admin_menus/item_reorder',
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
  	DeleteItem : function(id, callback)
  	{  
      $http.get('/admin_menus/item_delete/'+id)
          .success(function(data)
          {
            callback (data);
          });
  	}
  }

 }]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9uZXdzLm1vZHVsZS5qcyIsImN0cmwuY2F0ZWdvcmllc0VkaXQuanMiLCJjdHJsLmNhdGVnb3JpZXNMaXN0LmpzIiwiY3RybC5uZXdzSXRlbXNFZGl0LmpzIiwiY3RybC5uZXdzTGlzdC5qcyIsInJlcG8uY2F0ZWdvcmllcy5qcyIsInJlcG8uaXRlbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im5ld3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnUGVha3MuTmV3cycsIFsnUGVha3MuTmV3cy5SZXBvc2l0b3JpZXMnXSk7XHJcbi8vYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk5ld3MuU2VydmljZXMnLCBbXSk7XHJcbi8vYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk5ld3MuRGlyZWN0aXZlcycsIFtdKTtcclxuYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk5ld3MuUmVwb3NpdG9yaWVzJywgW10pIiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk5ld3MnKS5jb250cm9sbGVyKCdOZXdzQ2F0ZWdvcmllc0VkaXRDdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zKXtcclxuXHJcbiAgJHNjb3BlLnNlY3Rpb24gPSBcIm5ld3MvY2F0ZWdvcmllc1wiO1xyXG4gIG1lbnVDb250cm9sKCduZXdzJyk7XHJcblxyXG4gIHZhciBpZCA9ICRzdGF0ZVBhcmFtcy5pZFxyXG4gICRzY29wZS5tb2RlID0gaWQ7XHJcblxyXG4gIHZhciBnZXRUaGVQYWdlID0gZnVuY3Rpb24oKVxyXG4gIHtcclxuICAgICRodHRwLmdldCgnL2FkbWluX25ld3MvZ2V0X2NhdGVnb3J5LycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgJHNjb3BlLml0ZW0gPSBkYXRhLmNvbnRlbnRfaXRlbXM7XHJcbiAgICAgIGluaXRfcGFnZSgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB2YXIgZ2V0VGhlSXRlbXMgPSBmdW5jdGlvbihsaW1pdCwgb2Zmc2V0KVxyXG4gIHtcclxuICAgICRodHRwLmdldCgnL2FkbWluX25ld3MvY2F0ZWdvcnlfY2hpbGRzLycraWQgKycvJytsaW1pdCsnLycrb2Zmc2V0KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgJHNjb3BlLnRvdGFsSXRlbXMgPSBkYXRhLnRvdGFsX2l0ZW1zO1xyXG4gICAgICAkc2NvcGUuY2hpbGRzID0gZGF0YS5pdGVtcztcclxuICAgICAgaW5pdF9wYWdlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIHBhZ2luYXRpb25cclxuICBcclxuICAkc2NvcGUuY3VycmVudFBhZ2UgPSAwO1xyXG4gICRzY29wZS5tYXhTaXplID0gNTtcclxuICAkc2NvcGUuaXRlbVBlclBhZ2UgPSAyMDtcclxuICAkc2NvcGUub2Zmc2V0ID0gMDtcclxuICBcclxuICAkc2NvcGUuc2V0R2V0UGFnZSA9IGZ1bmN0aW9uIChwYWdlTm8pIHtcclxuICAgICRzY29wZS5jdXJyZW50UGFnZSA9IHBhZ2VObztcclxuICAgICRzY29wZS5vZmZzZXQgPSAkc2NvcGUuY3VycmVudFBhZ2UgKiAkc2NvcGUuaXRlbVBlclBhZ2UgLSAkc2NvcGUuaXRlbVBlclBhZ2U7XHJcbiAgICBnZXRUaGVJdGVtcygkc2NvcGUuaXRlbVBlclBhZ2UsICRzY29wZS5vZmZzZXQpO1xyXG4gIH07XHJcblxyXG4gICRzY29wZS5nZXRWaWV3ID0gZnVuY3Rpb24oaWQpXHJcbiAge1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL25ld3MvaXRlbXMvJytpZDtcclxuICAgIGJsb2NrKCk7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAkc2NvcGUuYWxlcnQgPSBcIlNhdXZlZ2FyZGVcIjtcclxuICAgIHNob3dBbGVydCgpO1xyXG5cclxuICAgICRodHRwKHtcclxuICAgICAgICAgICAgdXJsOiAnL2FkbWluX25ld3MvY2F0ZWdvcnlfZWRpdCcsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5pdGVtLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlkID09ICduZXcnICYmIGRhdGEuZXJyb3JzLmxlbmd0aCA9PT0gMCkgeyB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvbmV3cy9jYXRlZ29yaWVzL2VkaXQvJytkYXRhLmlkOyB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gZGF0YS5lcnJvcnM7XHJcbiAgICAgICAgICAgICAgICAgICBzaG93RmFkZUFsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAgIC8vZm9ybWF0U3RhdHV0KClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSAnVW5lIGVycmV1cmUgZXN0IHN1cnZlbnVlLic7XHJcbiAgICAgICAgICAgICAgICBzaG93RmFkZUFsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKVxyXG4gIHtcclxuICAgICRzY29wZS5hbGVydCA9ICdTdXByZXNzaW9uJztcclxuICAgIHNob3dBbGVydCgpO1xyXG5cclxuICAgICRodHRwLmdldCgnL2FkbWluX25ld3MvY2F0ZWdvcnlfZGVsZXRlLycgKyBpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvbmV3cy9jYXRlZ29yaWVzJztcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGhlUGFnZSgpO1xyXG4gIGdldFRoZUl0ZW1zKCRzY29wZS5pdGVtUGVyUGFnZSwgMCk7XHJcblxyXG59XSkiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuTmV3cycpLmNvbnRyb2xsZXIoJ05ld3NDYXRlZ29yaWVzTGlzdEN0cmwnLCBbJyRzY29wZScsICckaHR0cCcsICckaW5qZWN0b3InLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkaW5qZWN0b3Ipe1xyXG5cdFxyXG4gIHZhciBjb25maWcgPSB7XHJcbiAgICBzZWN0aW9uIDogXCJuZXdzL2NhdGVnb3JpZXNcIixcclxuICAgIG1lbnUgOiAnbmV3cycsXHJcbiAgICBnZXRVcmwgOiAnL2FkbWluX25ld3MvY2F0ZWdvcmllc19saXN0LycsXHJcbiAgICBkZWxldGVVcmwgOiAnYWRtaW5fbmV3cy9jYXRlZ29yeV9kZWxldGUvJyxcclxuICB9XHJcblxyXG4gICRzY29wZS50YWJsZSA9IFtcclxuICAgICAge3RpdGxlIDogJ05vbScsIHBhcmFtIDogJ25hbWUnfSxcclxuICAgICAge3RpdGxlOiAnTmJyIGRlIG5ld3MnLCBwYXJhbSA6ICdjaGlsZHNfY291bnQnfVxyXG4gICAgXTtcclxuXHJcbiAgJHNjb3BlLnBhZ2VUaXRsZSA9ICdDYXTDqWdvcmllcyBkZSBuZXdzJztcclxuXHJcbiAgJGluamVjdG9yLmludm9rZShJdGVtTGlzdCwgdGhpcywgeyRzY29wZTogJHNjb3BlLCAkaHR0cDogJGh0dHAsIGNvbmZpZzogY29uZmlnfSk7XHJcblxyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk5ld3MnKS5jb250cm9sbGVyKCdOZXdzSXRlbXNFZGl0Q3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRzdGF0ZVBhcmFtcycsICdUYWdzUmVzcG9zaXRvcnknLCAnTmV3c0NhdGVnb3JpZXNSZXBvc2l0b3J5JywgXHJcblx0ZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zLCB0YWdzUmVzcG9zaXRvcnksIG5ld3NDYXRlZ29yaWVzUmVwb3NpdG9yeSl7XHJcblxyXG4gIGluaXRfcGFnZSgpO1xyXG4gIFxyXG5cclxuICAkc2NvcGUuc2VjdGlvbiA9IFwibmV3cy9pdGVtc1wiO1xyXG4gIG1lbnVDb250cm9sKCduZXdzJyk7XHJcblxyXG4gIHZhciBpZCA9ICRzdGF0ZVBhcmFtcy5pZDtcclxuICAkc2NvcGUubW9kZSA9ICBpZDtcclxuXHJcbiAgJHNjb3BlLmZhSWNvbnMgPSBbJ2ZhLWhvbWUnLCAnZmEtcGVuY2lsJywgJ2ZhLW1hcC1tYXJrZXInXTtcclxuXHJcbiAgJHNjb3BlLnRpbnltY2VPcHRpb25zID0gdGlueW1jZUNvbmZpZztcclxuXHJcbiAgJHNjb3BlLnVwbG9hZGVyID0ge1xyXG4gICAgICAgIHcgOiAyMDAsXHJcbiAgICAgICAgaCA6IDIwMCxcclxuICAgICAgICBpdGVtX2lkIDogMCxcclxuICAgICAgICBmb2xkZXIgOiAnYXNzZXRzL2ltYWdlcy9uZXdzLycraWQrJy90aHVtYnMvJyxcclxuICAgICAgICBhc3NldFBhdGggOiAnbmV3c34nK2lkKyd+dGh1bWJzJyxcclxuICAgICAgICBjcm9wIDogMSxcclxuICAgICAgICB1bmlxdWVOYW1lIDogdHJ1ZVxyXG4gIH1cclxuXHJcbiAgICRzY29wZS5zZWxlY3QyVGFncyA9IHtcclxuICAgICAgICAnbXVsdGlwbGUnOiB0cnVlLFxyXG4gICAgICAgICdzaW1wbGVfdGFncyc6IHRydWUsXHJcbiAgICAgICAgLy8ndGFncyc6IHRydWUsICAvLyBDYW4gYmUgZW1wdHkgbGlzdC5cclxuICAgICAgICAndG9rZW5TZXBhcmF0b3JzJyA6IFtcIixcIl0sXHJcbiAgICAgICAgaW5pdFNlbGVjdGlvbiA6IGZ1bmN0aW9uKGVsZW1lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgdGFnc1Jlc3Bvc2l0b3J5LnRhZ05hbWVzTGlzdChmdW5jdGlvbihkYXRhKVxyXG4gIHtcclxuICAgICRzY29wZS5zZWxlY3QyVGFncy50YWdzID0gZGF0YTtcclxuICB9KTtcclxuXHJcbiAgJHNjb3BlLmFzc2V0c0xpc3QgPSB7XHJcbiAgICBmb2xkZXIgOiAnYXNzZXRzL2ltYWdlcy9uZXdzLycraWQrJy8nLFxyXG4gICAgYXNzZXRQYXRoIDogJ25ld3N+JytpZCxcclxuICAgIHBhcmVudElkZW50aXR5IDogJ25ld3NfaXRlbSdcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldENhdGFnb3J5RGF0YShjYXRlZ29yeUlkKVxyXG4gIHtcclxuICAgIG5ld3NDYXRlZ29yaWVzUmVwb3NpdG9yeS5HZXRJdGVtKGNhdGVnb3J5SWQsIGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgICRzY29wZS51cGxvYWRlci5oID0gZGF0YS50aHVtYl9oO1xyXG4gICAgICAkc2NvcGUudXBsb2FkZXIudyA9IGRhdGEudGh1bWJfdztcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAkc2NvcGUuJHdhdGNoKCdpdGVtLnBhcmVudF9pZCcsIGZ1bmN0aW9uKG5ld1ZhbHVlKVxyXG4gIHtcclxuICAgIGdldENhdGFnb3J5RGF0YShuZXdWYWx1ZSk7XHJcbiAgfSk7XHJcblxyXG4gIGZ1bmN0aW9uIGdldFRoZVBhZ2UoKXtcclxuICAgICRodHRwLmdldCgnL2FkbWluX25ld3MvZ2V0X25ld3MvJytpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAkc2NvcGUuaXRlbSA9IGRhdGEuY29udGVudF9pdGVtcztcclxuICAgICAgJHNjb3BlLnBlcnNvbiAgPSBkYXRhLnBlcnNvbl9pbmZvO1xyXG4gICAgICAkc2NvcGUudG9kYXkgPSBkYXRhLnRvZGF5O1xyXG5cclxuICAgICAgZ2V0Q2F0YWdvcnlEYXRhKGRhdGEuY29udGVudF9pdGVtcy5wYXJlbnRfaWQpO1xyXG5cclxuICAgICAgZm9ybWF0U3RhdHV0KCk7XHJcbiAgICAgIGluaXRfcGFnZSgpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gZm9ybWF0U3RhdHV0KClcclxuICB7XHJcblxyXG4gICAgaWYgKCRzY29wZS5pdGVtLnB1Ymxpc2hlZF9vbiA9PSBudWxsKSB7JHNjb3BlLnN0YXR1dCA9ICdkcmFmdCd9XHJcbiAgICBlbHNlIGlmIChEYXRlLnBhcnNlKCRzY29wZS5pdGVtLnB1Ymxpc2hlZF9vbikgPiBEYXRlLnBhcnNlKCRzY29wZS50b2RheSkpIHskc2NvcGUuc3RhdHV0ID0gJ3BlbmRpbmcnfVxyXG4gICAgZWxzZSBpZiAoRGF0ZS5wYXJzZSgkc2NvcGUuaXRlbS5hcmNoaXZlZF9vbikgPD0gRGF0ZS5wYXJzZSgkc2NvcGUudG9kYXkpKSB7JHNjb3BlLnN0YXR1dCA9ICdhcmNoaXZlZCd9XHJcbiAgICBlbHNlIHskc2NvcGUuc3RhdHV0ID0gJ29ubGluZSd9OyBcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0Q2F0ZWdvcmllcygpXHJcbiAge1xyXG4gICAgJGh0dHAuZ2V0KCcvYWRtaW5fbmV3cy9jYXRlZ29yaWVzX2xpc3QnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgICAkc2NvcGUuY2F0ZWdvcmllcyA9IGRhdGEuaXRlbXM7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldENhdGVnb3JpZXMoKTtcclxuXHJcbiAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgaWYgKCBpZCA9PSAnbmV3Jykge1xyXG4gICAgICAkc2NvcGUuaXRlbS5jcmVhdGVkX2J5ID0gZ2xvYmFsVmFycy51c2VyX2lkO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuaXRlbSk7XHJcblxyXG4gICAgJGh0dHAoe1xyXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW5fbmV3cy9uZXdzX2VkaXQnLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuaXRlbSxcclxuICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIGlmIChpZCA9PSAnbmV3JyAmJiBkYXRhLmVycm9ycy5sZW5ndGggPT09IDApIHsgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL25ld3MvZWRpdC8nK2RhdGEuaWQ7IH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICRzY29wZS5hbGVydCA9IGRhdGEubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBkYXRhLmVycm9ycztcclxuICAgICAgICAgICAgICAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgICAgZm9ybWF0U3RhdHV0KClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSAnVW5lIGVycmV1cmUgZXN0IHN1cnZlbnVlLic7XHJcbiAgICAgICAgICAgICAgICBzaG93RmFkZUFsZXJ0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICRodHRwLmdldCgnL2FkbWluX25ld3MvZGVsZXRlLycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvbmV3cy9saXN0JztcclxuICAgIH0pO1xyXG4gIH0gXHJcblxyXG4gICRzY29wZS5wdXNoT25saW5lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJGh0dHAuZ2V0KCcvYWRtaW5fbmV3cy9wdXNoX29ubGluZS8nK2lkKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgJHNjb3BlLmFsZXJ0ID0gXCJOZXdzIG1pc2UgZW4gbGlnbmUuXCI7XHJcbiAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgICAgJHNjb3BlLml0ZW1bJ3B1Ymxpc2hlZF9vbiddID0gJHNjb3BlLnRvZGF5O1xyXG4gICAgICBmb3JtYXRTdGF0dXQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnB1c2hPZmZsaW5lID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICRodHRwLmdldCgnL2FkbWluX25ld3MvcHVzaF9vZmZsaW5lLycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAkc2NvcGUuYWxlcnQgPSBcIk5ld3MgYXJjaGl2w6llLlwiO1xyXG4gICAgICBzaG93RmFkZUFsZXJ0KCk7XHJcbiAgICAgICRzY29wZS5pdGVtWydhcmNoaXZlZF9vbiddID0gJHNjb3BlLnRvZGF5O1xyXG4gICAgICBmb3JtYXRTdGF0dXQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJCgnaW5wdXQnKS5jbGljayhmdW5jdGlvbigkc2NvcGUpXHJcbiAge1xyXG4gICAkKCcuYWxlcnQtY29udGFpbmVyJykuZmFkZU91dCgpO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoaWQgIT0gJ25ldycpIHtcclxuICAgIGdldFRoZVBhZ2UoKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICAkc2NvcGUuaGlkZUZvck5ldyA9IHRydWU7XHJcbiAgICAkc2NvcGUuaXRlbSA9IHtcclxuICAgICAgbWV0YV90YWdzIDogW11cclxuICAgIH1cclxuICB9XHJcblxyXG59XSkiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuTmV3cycpLmNvbnRyb2xsZXIoJ05ld3NJdGVtc0xpc3RDdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnJGluamVjdG9yJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJGluamVjdG9yKXtcclxuXHJcbiAgdmFyIGNvbmZpZyA9IHtcclxuICAgIHNlY3Rpb24gOiBcIm5ld3MvaXRlbXNcIixcclxuICAgIG1lbnUgOiAnbmV3cycsXHJcbiAgICBnZXRVcmwgOiAnL2FkbWluX25ld3MvbmV3c19saXN0LycsXHJcbiAgICBkZWxldGVVcmwgOiAnYWRtaW5fbmV3cy9kZWxldGVfbmV3cy8nLFxyXG4gICAgZ2V0Q2FsbEJhY2sgOiBmdW5jdGlvbihkYXRhKVxyXG4gICAge1xyXG4gICAgICAgIC8vIHRyYWl0ZW1lbnQgZHUgc3RhdHV0IHV0aWxpc2F0ZXVyIFxyXG4gICAgICB2YXIgaSA9IDA7XHJcblxyXG4gICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLml0ZW1zLCBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICBpZiAoJHNjb3BlLml0ZW1zW2ldLnB1Ymxpc2hlZF9vbiA9PSBudWxsKSB7JHNjb3BlLml0ZW1zW2ldLnN0YXR1dCA9ICd3YXJuaW5nJ31cclxuICAgICAgICBlbHNlIGlmIChEYXRlLnBhcnNlKCRzY29wZS5pdGVtc1tpXS5wdWJsaXNoZWRfb24pID4gRGF0ZS5wYXJzZShkYXRhLnRvZGF5KSkgeyRzY29wZS5pdGVtc1tpXS5zdGF0dXQgPSAnaW5mbyd9XHJcbiAgICAgICAgZWxzZSBpZiAoRGF0ZS5wYXJzZSgkc2NvcGUuaXRlbXNbaV0uYXJjaGl2ZWRfb24pIDw9IERhdGUucGFyc2UoZGF0YS50b2RheSkpIHskc2NvcGUuaXRlbXNbaV0uc3RhdHV0ID0gJ29mZmxpbmUnfVxyXG4gICAgICAgIGVsc2UgeyRzY29wZS5pdGVtc1tpXS5zdGF0dXQgPSAnc3VjY2Vzcyd9OyBcclxuICAgICAgICBpKys7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnRhYmxlID0gW1xyXG4gICAgICB7dGl0bGUgOiAnVGl0cmUnLCBwYXJhbSA6ICd0aXRsZSd9LFxyXG4gICAgICB7dGl0bGUgOiAnQ2F0w6lnb3JpZScsIHBhcmFtIDogJ2NhdGVnb3J5X25hbWUnfSxcclxuICAgICAge3RpdGxlIDogJ0F1dGV1cicsIHBhcmFtIDogJ2NyZWF0ZWRfYnknfVxyXG4gICAgXTtcclxuXHJcbiAgJHNjb3BlLnBhZ2VUaXRsZSA9ICdOZXdzJztcclxuXHJcbiAgJGluamVjdG9yLmludm9rZShJdGVtTGlzdCwgdGhpcywgeyRzY29wZTogJHNjb3BlLCAkaHR0cDogJGh0dHAsIGNvbmZpZzogY29uZmlnfSk7XHJcbiAgXHJcbn1dKSIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5OZXdzLlJlcG9zaXRvcmllcycpLmZhY3RvcnkoJ05ld3NDYXRlZ29yaWVzUmVwb3NpdG9yeScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG4gIHJldHVybiB7IFxyXG4gIFx0R2V0SXRlbSA6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICBcdHtcclxuICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fbmV3cy9nZXRfY2F0ZWdvcnkvJytpZClcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChkYXRhLmNvbnRlbnRfaXRlbXMpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgXHR9LFxyXG4gIFx0LypTYXZlSXRlbSA6IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKVxyXG4gIFx0e1xyXG4gICAgICAkaHR0cCh7XHJcbiAgICAgICAgICB1cmw6ICcvYWRtaW5fbWVudXMvbWVudV9lZGl0JyxcclxuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICBhbGVydCA9ICdVbmUgZXJyZXVyZSBlc3Qgc3VydmVudWUuJztcclxuICAgICAgICAgIH0pO1xyXG4gIFx0fSxcclxuICBcdERlbGV0ZUl0ZW0gOiBmdW5jdGlvbihpZCwgY2FsbGJhY2spXHJcbiAgXHR7XHJcbiAgICAgICRodHRwLmdldCgnL2FkbWluX21lbnVzL21lbnVfZGVsZXRlLycraWQpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjYWxsYmFjayAoZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICBcdH0qL1xyXG4gIH1cclxuXHJcbiB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk5ld3MuUmVwb3NpdG9yaWVzJykuZmFjdG9yeSgnTmV3c0l0ZW1zUmVwb3NpdG9yeScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG4gIHJldHVybiB7IFxyXG4gIFx0R2V0SXRlbSA6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICBcdHtcclxuICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fbWVudXMvaXRlbV9kZXRhaWxzLycraWQpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjYWxsYmFjayAoZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICBcdH0sXHJcbiAgXHRTYXZlSXRlbSA6IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKVxyXG4gIFx0e1xyXG4gICAgICAkaHR0cCh7XHJcbiAgICAgICAgICB1cmw6ICcvYWRtaW5fbWVudXMvaXRlbV9lZGl0JyxcclxuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICBhbGVydCA9ICdVbmUgZXJyZXVyZSBlc3Qgc3VydmVudWUuJztcclxuICAgICAgICAgIH0pO1xyXG4gIFx0fSxcclxuICAgIFJlb3JkZXJJdGVtIDogZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spXHJcbiAgICB7XHJcbiAgICAgICRodHRwKHtcclxuICAgICAgICAgIHVybDogJy9hZG1pbl9tZW51cy9pdGVtX3Jlb3JkZXInLFxyXG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgIGFsZXJ0ID0gJ1VuZSBlcnJldXJlIGVzdCBzdXJ2ZW51ZS4nO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gIFx0RGVsZXRlSXRlbSA6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICBcdHsgIFxyXG4gICAgICAkaHR0cC5nZXQoJy9hZG1pbl9tZW51cy9pdGVtX2RlbGV0ZS8nK2lkKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sgKGRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgXHR9XHJcbiAgfVxyXG5cclxuIH1dKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=