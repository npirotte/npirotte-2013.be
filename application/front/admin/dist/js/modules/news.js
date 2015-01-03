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

  $scope.tinymceOptions = {
    plugins: [
        "autolink link image",
        "searchreplace visualblocks code fullscreen",
        "table contextmenu paste"
    ],
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image"
  }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9uZXdzLm1vZHVsZS5qcyIsImN0cmwuY2F0ZWdvcmllc0VkaXQuanMiLCJjdHJsLmNhdGVnb3JpZXNMaXN0LmpzIiwiY3RybC5uZXdzSXRlbXNFZGl0LmpzIiwiY3RybC5uZXdzTGlzdC5qcyIsInJlcG8uY2F0ZWdvcmllcy5qcyIsInJlcG8uaXRlbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibmV3cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5OZXdzJywgWydQZWFrcy5OZXdzLlJlcG9zaXRvcmllcyddKTtcclxuLy9hbmd1bGFyLm1vZHVsZSgnUGVha3MuTmV3cy5TZXJ2aWNlcycsIFtdKTtcclxuLy9hbmd1bGFyLm1vZHVsZSgnUGVha3MuTmV3cy5EaXJlY3RpdmVzJywgW10pO1xyXG5hbmd1bGFyLm1vZHVsZSgnUGVha3MuTmV3cy5SZXBvc2l0b3JpZXMnLCBbXSkiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuTmV3cycpLmNvbnRyb2xsZXIoJ05ld3NDYXRlZ29yaWVzRWRpdEN0cmwnLCBbJyRzY29wZScsICckaHR0cCcsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMpe1xyXG5cclxuICAkc2NvcGUuc2VjdGlvbiA9IFwibmV3cy9jYXRlZ29yaWVzXCI7XHJcbiAgbWVudUNvbnRyb2woJ25ld3MnKTtcclxuXHJcbiAgdmFyIGlkID0gJHN0YXRlUGFyYW1zLmlkXHJcbiAgJHNjb3BlLm1vZGUgPSBpZDtcclxuXHJcbiAgdmFyIGdldFRoZVBhZ2UgPSBmdW5jdGlvbigpXHJcbiAge1xyXG4gICAgJGh0dHAuZ2V0KCcvYWRtaW5fbmV3cy9nZXRfY2F0ZWdvcnkvJytpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAkc2NvcGUuaXRlbSA9IGRhdGEuY29udGVudF9pdGVtcztcclxuICAgICAgaW5pdF9wYWdlKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHZhciBnZXRUaGVJdGVtcyA9IGZ1bmN0aW9uKGxpbWl0LCBvZmZzZXQpXHJcbiAge1xyXG4gICAgJGh0dHAuZ2V0KCcvYWRtaW5fbmV3cy9jYXRlZ29yeV9jaGlsZHMvJytpZCArJy8nK2xpbWl0KycvJytvZmZzZXQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAkc2NvcGUudG90YWxJdGVtcyA9IGRhdGEudG90YWxfaXRlbXM7XHJcbiAgICAgICRzY29wZS5jaGlsZHMgPSBkYXRhLml0ZW1zO1xyXG4gICAgICBpbml0X3BhZ2UoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gcGFnaW5hdGlvblxyXG4gIFxyXG4gICRzY29wZS5jdXJyZW50UGFnZSA9IDA7XHJcbiAgJHNjb3BlLm1heFNpemUgPSA1O1xyXG4gICRzY29wZS5pdGVtUGVyUGFnZSA9IDIwO1xyXG4gICRzY29wZS5vZmZzZXQgPSAwO1xyXG4gIFxyXG4gICRzY29wZS5zZXRHZXRQYWdlID0gZnVuY3Rpb24gKHBhZ2VObykge1xyXG4gICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gcGFnZU5vO1xyXG4gICAgJHNjb3BlLm9mZnNldCA9ICRzY29wZS5jdXJyZW50UGFnZSAqICRzY29wZS5pdGVtUGVyUGFnZSAtICRzY29wZS5pdGVtUGVyUGFnZTtcclxuICAgIGdldFRoZUl0ZW1zKCRzY29wZS5pdGVtUGVyUGFnZSwgJHNjb3BlLm9mZnNldCk7XHJcbiAgfTtcclxuXHJcbiAgJHNjb3BlLmdldFZpZXcgPSBmdW5jdGlvbihpZClcclxuICB7XHJcbiAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvbmV3cy9pdGVtcy8nK2lkO1xyXG4gICAgYmxvY2soKTtcclxuICB9XHJcblxyXG4gICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICRzY29wZS5hbGVydCA9IFwiU2F1dmVnYXJkZVwiO1xyXG4gICAgc2hvd0FsZXJ0KCk7XHJcblxyXG4gICAgJGh0dHAoe1xyXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW5fbmV3cy9jYXRlZ29yeV9lZGl0JyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgZGF0YTogJHNjb3BlLml0ZW0sXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaWQgPT0gJ25ldycgJiYgZGF0YS5lcnJvcnMubGVuZ3RoID09PSAwKSB7IHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJy9uZXdzL2NhdGVnb3JpZXMvZWRpdC8nK2RhdGEuaWQ7IH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICRzY29wZS5hbGVydCA9IGRhdGEubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBkYXRhLmVycm9ycztcclxuICAgICAgICAgICAgICAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgICAgLy9mb3JtYXRTdGF0dXQoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydCA9ICdVbmUgZXJyZXVyZSBlc3Qgc3VydmVudWUuJztcclxuICAgICAgICAgICAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICB9XHJcblxyXG4gICRzY29wZS5kZWxldGUgPSBmdW5jdGlvbigpXHJcbiAge1xyXG4gICAgJHNjb3BlLmFsZXJ0ID0gJ1N1cHJlc3Npb24nO1xyXG4gICAgc2hvd0FsZXJ0KCk7XHJcblxyXG4gICAgJGh0dHAuZ2V0KCcvYWRtaW5fbmV3cy9jYXRlZ29yeV9kZWxldGUvJyArIGlkKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJy9uZXdzL2NhdGVnb3JpZXMnO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRUaGVQYWdlKCk7XHJcbiAgZ2V0VGhlSXRlbXMoJHNjb3BlLml0ZW1QZXJQYWdlLCAwKTtcclxuXHJcbn1dKSIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5OZXdzJykuY29udHJvbGxlcignTmV3c0NhdGVnb3JpZXNMaXN0Q3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRpbmplY3RvcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRpbmplY3Rvcil7XHJcblx0XHJcbiAgdmFyIGNvbmZpZyA9IHtcclxuICAgIHNlY3Rpb24gOiBcIm5ld3MvY2F0ZWdvcmllc1wiLFxyXG4gICAgbWVudSA6ICduZXdzJyxcclxuICAgIGdldFVybCA6ICcvYWRtaW5fbmV3cy9jYXRlZ29yaWVzX2xpc3QvJyxcclxuICAgIGRlbGV0ZVVybCA6ICdhZG1pbl9uZXdzL2NhdGVnb3J5X2RlbGV0ZS8nLFxyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnRhYmxlID0gW1xyXG4gICAgICB7dGl0bGUgOiAnTm9tJywgcGFyYW0gOiAnbmFtZSd9LFxyXG4gICAgICB7dGl0bGU6ICdOYnIgZGUgbmV3cycsIHBhcmFtIDogJ2NoaWxkc19jb3VudCd9XHJcbiAgICBdO1xyXG5cclxuICAkc2NvcGUucGFnZVRpdGxlID0gJ0NhdMOpZ29yaWVzIGRlIG5ld3MnO1xyXG5cclxuICAkaW5qZWN0b3IuaW52b2tlKEl0ZW1MaXN0LCB0aGlzLCB7JHNjb3BlOiAkc2NvcGUsICRodHRwOiAkaHR0cCwgY29uZmlnOiBjb25maWd9KTtcclxuXHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuTmV3cycpLmNvbnRyb2xsZXIoJ05ld3NJdGVtc0VkaXRDdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnJHN0YXRlUGFyYW1zJywgJ1RhZ3NSZXNwb3NpdG9yeScsICdOZXdzQ2F0ZWdvcmllc1JlcG9zaXRvcnknLCBcclxuXHRmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkc3RhdGVQYXJhbXMsIHRhZ3NSZXNwb3NpdG9yeSwgbmV3c0NhdGVnb3JpZXNSZXBvc2l0b3J5KXtcclxuXHJcbiAgaW5pdF9wYWdlKCk7XHJcbiAgXHJcblxyXG4gICRzY29wZS5zZWN0aW9uID0gXCJuZXdzL2l0ZW1zXCI7XHJcbiAgbWVudUNvbnRyb2woJ25ld3MnKTtcclxuXHJcbiAgdmFyIGlkID0gJHN0YXRlUGFyYW1zLmlkO1xyXG4gICRzY29wZS5tb2RlID0gIGlkO1xyXG5cclxuICAkc2NvcGUuZmFJY29ucyA9IFsnZmEtaG9tZScsICdmYS1wZW5jaWwnLCAnZmEtbWFwLW1hcmtlciddO1xyXG5cclxuICAkc2NvcGUudGlueW1jZU9wdGlvbnMgPSB7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgXCJhdXRvbGluayBsaW5rIGltYWdlXCIsXHJcbiAgICAgICAgXCJzZWFyY2hyZXBsYWNlIHZpc3VhbGJsb2NrcyBjb2RlIGZ1bGxzY3JlZW5cIixcclxuICAgICAgICBcInRhYmxlIGNvbnRleHRtZW51IHBhc3RlXCJcclxuICAgIF0sXHJcbiAgICB0b29sYmFyOiBcImluc2VydGZpbGUgdW5kbyByZWRvIHwgc3R5bGVzZWxlY3QgfCBib2xkIGl0YWxpYyB8IGFsaWdubGVmdCBhbGlnbmNlbnRlciBhbGlnbnJpZ2h0IGFsaWduanVzdGlmeSB8IGJ1bGxpc3QgbnVtbGlzdCB8IGxpbmsgaW1hZ2VcIlxyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnVwbG9hZGVyID0ge1xyXG4gICAgICAgIHcgOiAyMDAsXHJcbiAgICAgICAgaCA6IDIwMCxcclxuICAgICAgICBpdGVtX2lkIDogMCxcclxuICAgICAgICBmb2xkZXIgOiAnYXNzZXRzL2ltYWdlcy9uZXdzLycraWQrJy90aHVtYnMvJyxcclxuICAgICAgICBhc3NldFBhdGggOiAnbmV3c34nK2lkKyd+dGh1bWJzJyxcclxuICAgICAgICBjcm9wIDogMSxcclxuICAgICAgICB1bmlxdWVOYW1lIDogdHJ1ZVxyXG4gIH1cclxuXHJcbiAgICRzY29wZS5zZWxlY3QyVGFncyA9IHtcclxuICAgICAgICAnbXVsdGlwbGUnOiB0cnVlLFxyXG4gICAgICAgICdzaW1wbGVfdGFncyc6IHRydWUsXHJcbiAgICAgICAgLy8ndGFncyc6IHRydWUsICAvLyBDYW4gYmUgZW1wdHkgbGlzdC5cclxuICAgICAgICAndG9rZW5TZXBhcmF0b3JzJyA6IFtcIixcIl0sXHJcbiAgICAgICAgaW5pdFNlbGVjdGlvbiA6IGZ1bmN0aW9uKGVsZW1lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgdGFnc1Jlc3Bvc2l0b3J5LnRhZ05hbWVzTGlzdChmdW5jdGlvbihkYXRhKVxyXG4gIHtcclxuICAgICRzY29wZS5zZWxlY3QyVGFncy50YWdzID0gZGF0YTtcclxuICB9KTtcclxuXHJcbiAgJHNjb3BlLmFzc2V0c0xpc3QgPSB7XHJcbiAgICBmb2xkZXIgOiAnYXNzZXRzL2ltYWdlcy9uZXdzLycraWQrJy8nLFxyXG4gICAgYXNzZXRQYXRoIDogJ25ld3N+JytpZCxcclxuICAgIHBhcmVudElkZW50aXR5IDogJ25ld3NfaXRlbSdcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldENhdGFnb3J5RGF0YShjYXRlZ29yeUlkKVxyXG4gIHtcclxuICAgIG5ld3NDYXRlZ29yaWVzUmVwb3NpdG9yeS5HZXRJdGVtKGNhdGVnb3J5SWQsIGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgICRzY29wZS51cGxvYWRlci5oID0gZGF0YS50aHVtYl9oO1xyXG4gICAgICAkc2NvcGUudXBsb2FkZXIudyA9IGRhdGEudGh1bWJfdztcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAkc2NvcGUuJHdhdGNoKCdpdGVtLnBhcmVudF9pZCcsIGZ1bmN0aW9uKG5ld1ZhbHVlKVxyXG4gIHtcclxuICAgIGdldENhdGFnb3J5RGF0YShuZXdWYWx1ZSk7XHJcbiAgfSk7XHJcblxyXG4gIGZ1bmN0aW9uIGdldFRoZVBhZ2UoKXtcclxuICAgICRodHRwLmdldCgnL2FkbWluX25ld3MvZ2V0X25ld3MvJytpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAkc2NvcGUuaXRlbSA9IGRhdGEuY29udGVudF9pdGVtcztcclxuICAgICAgJHNjb3BlLnBlcnNvbiAgPSBkYXRhLnBlcnNvbl9pbmZvO1xyXG4gICAgICAkc2NvcGUudG9kYXkgPSBkYXRhLnRvZGF5O1xyXG5cclxuICAgICAgZ2V0Q2F0YWdvcnlEYXRhKGRhdGEuY29udGVudF9pdGVtcy5wYXJlbnRfaWQpO1xyXG5cclxuICAgICAgZm9ybWF0U3RhdHV0KCk7XHJcbiAgICAgIGluaXRfcGFnZSgpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gZm9ybWF0U3RhdHV0KClcclxuICB7XHJcblxyXG4gICAgaWYgKCRzY29wZS5pdGVtLnB1Ymxpc2hlZF9vbiA9PSBudWxsKSB7JHNjb3BlLnN0YXR1dCA9ICdkcmFmdCd9XHJcbiAgICBlbHNlIGlmIChEYXRlLnBhcnNlKCRzY29wZS5pdGVtLnB1Ymxpc2hlZF9vbikgPiBEYXRlLnBhcnNlKCRzY29wZS50b2RheSkpIHskc2NvcGUuc3RhdHV0ID0gJ3BlbmRpbmcnfVxyXG4gICAgZWxzZSBpZiAoRGF0ZS5wYXJzZSgkc2NvcGUuaXRlbS5hcmNoaXZlZF9vbikgPD0gRGF0ZS5wYXJzZSgkc2NvcGUudG9kYXkpKSB7JHNjb3BlLnN0YXR1dCA9ICdhcmNoaXZlZCd9XHJcbiAgICBlbHNlIHskc2NvcGUuc3RhdHV0ID0gJ29ubGluZSd9OyBcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0Q2F0ZWdvcmllcygpXHJcbiAge1xyXG4gICAgJGh0dHAuZ2V0KCcvYWRtaW5fbmV3cy9jYXRlZ29yaWVzX2xpc3QnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgICAkc2NvcGUuY2F0ZWdvcmllcyA9IGRhdGEuaXRlbXM7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldENhdGVnb3JpZXMoKTtcclxuXHJcbiAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgaWYgKCBpZCA9PSAnbmV3Jykge1xyXG4gICAgICAkc2NvcGUuaXRlbS5jcmVhdGVkX2J5ID0gZ2xvYmFsVmFycy51c2VyX2lkO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuaXRlbSk7XHJcblxyXG4gICAgJGh0dHAoe1xyXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW5fbmV3cy9uZXdzX2VkaXQnLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuaXRlbSxcclxuICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgIGlmIChpZCA9PSAnbmV3JyAmJiBkYXRhLmVycm9ycy5sZW5ndGggPT09IDApIHsgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL25ld3MvZWRpdC8nK2RhdGEuaWQ7IH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICRzY29wZS5hbGVydCA9IGRhdGEubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBkYXRhLmVycm9ycztcclxuICAgICAgICAgICAgICAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgICAgICAgICAgICAgICAgZm9ybWF0U3RhdHV0KClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSAnVW5lIGVycmV1cmUgZXN0IHN1cnZlbnVlLic7XHJcbiAgICAgICAgICAgICAgICBzaG93RmFkZUFsZXJ0KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICRodHRwLmdldCgnL2FkbWluX25ld3MvZGVsZXRlLycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvbmV3cy9saXN0JztcclxuICAgIH0pO1xyXG4gIH0gXHJcblxyXG4gICRzY29wZS5wdXNoT25saW5lID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJGh0dHAuZ2V0KCcvYWRtaW5fbmV3cy9wdXNoX29ubGluZS8nK2lkKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgJHNjb3BlLmFsZXJ0ID0gXCJOZXdzIG1pc2UgZW4gbGlnbmUuXCI7XHJcbiAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgICAgJHNjb3BlLml0ZW1bJ3B1Ymxpc2hlZF9vbiddID0gJHNjb3BlLnRvZGF5O1xyXG4gICAgICBmb3JtYXRTdGF0dXQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnB1c2hPZmZsaW5lID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICRodHRwLmdldCgnL2FkbWluX25ld3MvcHVzaF9vZmZsaW5lLycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAkc2NvcGUuYWxlcnQgPSBcIk5ld3MgYXJjaGl2w6llLlwiO1xyXG4gICAgICBzaG93RmFkZUFsZXJ0KCk7XHJcbiAgICAgICRzY29wZS5pdGVtWydhcmNoaXZlZF9vbiddID0gJHNjb3BlLnRvZGF5O1xyXG4gICAgICBmb3JtYXRTdGF0dXQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJCgnaW5wdXQnKS5jbGljayhmdW5jdGlvbigkc2NvcGUpXHJcbiAge1xyXG4gICAkKCcuYWxlcnQtY29udGFpbmVyJykuZmFkZU91dCgpO1xyXG4gIH0pO1xyXG5cclxuICBpZiAoaWQgIT0gJ25ldycpIHtcclxuICAgIGdldFRoZVBhZ2UoKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICAkc2NvcGUuaGlkZUZvck5ldyA9IHRydWU7XHJcbiAgICAkc2NvcGUuaXRlbSA9IHtcclxuICAgICAgbWV0YV90YWdzIDogW11cclxuICAgIH1cclxuICB9XHJcblxyXG59XSkiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuTmV3cycpLmNvbnRyb2xsZXIoJ05ld3NJdGVtc0xpc3RDdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnJGluamVjdG9yJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJGluamVjdG9yKXtcclxuXHJcbiAgdmFyIGNvbmZpZyA9IHtcclxuICAgIHNlY3Rpb24gOiBcIm5ld3MvaXRlbXNcIixcclxuICAgIG1lbnUgOiAnbmV3cycsXHJcbiAgICBnZXRVcmwgOiAnL2FkbWluX25ld3MvbmV3c19saXN0LycsXHJcbiAgICBkZWxldGVVcmwgOiAnYWRtaW5fbmV3cy9kZWxldGVfbmV3cy8nLFxyXG4gICAgZ2V0Q2FsbEJhY2sgOiBmdW5jdGlvbihkYXRhKVxyXG4gICAge1xyXG4gICAgICAgIC8vIHRyYWl0ZW1lbnQgZHUgc3RhdHV0IHV0aWxpc2F0ZXVyIFxyXG4gICAgICB2YXIgaSA9IDA7XHJcblxyXG4gICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLml0ZW1zLCBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICBpZiAoJHNjb3BlLml0ZW1zW2ldLnB1Ymxpc2hlZF9vbiA9PSBudWxsKSB7JHNjb3BlLml0ZW1zW2ldLnN0YXR1dCA9ICd3YXJuaW5nJ31cclxuICAgICAgICBlbHNlIGlmIChEYXRlLnBhcnNlKCRzY29wZS5pdGVtc1tpXS5wdWJsaXNoZWRfb24pID4gRGF0ZS5wYXJzZShkYXRhLnRvZGF5KSkgeyRzY29wZS5pdGVtc1tpXS5zdGF0dXQgPSAnaW5mbyd9XHJcbiAgICAgICAgZWxzZSBpZiAoRGF0ZS5wYXJzZSgkc2NvcGUuaXRlbXNbaV0uYXJjaGl2ZWRfb24pIDw9IERhdGUucGFyc2UoZGF0YS50b2RheSkpIHskc2NvcGUuaXRlbXNbaV0uc3RhdHV0ID0gJ29mZmxpbmUnfVxyXG4gICAgICAgIGVsc2UgeyRzY29wZS5pdGVtc1tpXS5zdGF0dXQgPSAnc3VjY2Vzcyd9OyBcclxuICAgICAgICBpKys7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnRhYmxlID0gW1xyXG4gICAgICB7dGl0bGUgOiAnVGl0cmUnLCBwYXJhbSA6ICd0aXRsZSd9LFxyXG4gICAgICB7dGl0bGUgOiAnQ2F0w6lnb3JpZScsIHBhcmFtIDogJ2NhdGVnb3J5X25hbWUnfSxcclxuICAgICAge3RpdGxlIDogJ0F1dGV1cicsIHBhcmFtIDogJ2NyZWF0ZWRfYnknfVxyXG4gICAgXTtcclxuXHJcbiAgJHNjb3BlLnBhZ2VUaXRsZSA9ICdOZXdzJztcclxuXHJcbiAgJGluamVjdG9yLmludm9rZShJdGVtTGlzdCwgdGhpcywgeyRzY29wZTogJHNjb3BlLCAkaHR0cDogJGh0dHAsIGNvbmZpZzogY29uZmlnfSk7XHJcbiAgXHJcbn1dKSIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5OZXdzLlJlcG9zaXRvcmllcycpLmZhY3RvcnkoJ05ld3NDYXRlZ29yaWVzUmVwb3NpdG9yeScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG4gIHJldHVybiB7IFxyXG4gIFx0R2V0SXRlbSA6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICBcdHtcclxuICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fbmV3cy9nZXRfY2F0ZWdvcnkvJytpZClcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChkYXRhLmNvbnRlbnRfaXRlbXMpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgXHR9LFxyXG4gIFx0LypTYXZlSXRlbSA6IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKVxyXG4gIFx0e1xyXG4gICAgICAkaHR0cCh7XHJcbiAgICAgICAgICB1cmw6ICcvYWRtaW5fbWVudXMvbWVudV9lZGl0JyxcclxuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICBhbGVydCA9ICdVbmUgZXJyZXVyZSBlc3Qgc3VydmVudWUuJztcclxuICAgICAgICAgIH0pO1xyXG4gIFx0fSxcclxuICBcdERlbGV0ZUl0ZW0gOiBmdW5jdGlvbihpZCwgY2FsbGJhY2spXHJcbiAgXHR7XHJcbiAgICAgICRodHRwLmdldCgnL2FkbWluX21lbnVzL21lbnVfZGVsZXRlLycraWQpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjYWxsYmFjayAoZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICBcdH0qL1xyXG4gIH1cclxuXHJcbiB9XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk5ld3MuUmVwb3NpdG9yaWVzJykuZmFjdG9yeSgnTmV3c0l0ZW1zUmVwb3NpdG9yeScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG4gIHJldHVybiB7IFxyXG4gIFx0R2V0SXRlbSA6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICBcdHtcclxuICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fbWVudXMvaXRlbV9kZXRhaWxzLycraWQpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjYWxsYmFjayAoZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICBcdH0sXHJcbiAgXHRTYXZlSXRlbSA6IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKVxyXG4gIFx0e1xyXG4gICAgICAkaHR0cCh7XHJcbiAgICAgICAgICB1cmw6ICcvYWRtaW5fbWVudXMvaXRlbV9lZGl0JyxcclxuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICBhbGVydCA9ICdVbmUgZXJyZXVyZSBlc3Qgc3VydmVudWUuJztcclxuICAgICAgICAgIH0pO1xyXG4gIFx0fSxcclxuICAgIFJlb3JkZXJJdGVtIDogZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spXHJcbiAgICB7XHJcbiAgICAgICRodHRwKHtcclxuICAgICAgICAgIHVybDogJy9hZG1pbl9tZW51cy9pdGVtX3Jlb3JkZXInLFxyXG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgIGFsZXJ0ID0gJ1VuZSBlcnJldXJlIGVzdCBzdXJ2ZW51ZS4nO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gIFx0RGVsZXRlSXRlbSA6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICBcdHsgIFxyXG4gICAgICAkaHR0cC5nZXQoJy9hZG1pbl9tZW51cy9pdGVtX2RlbGV0ZS8nK2lkKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sgKGRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgXHR9XHJcbiAgfVxyXG5cclxuIH1dKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=