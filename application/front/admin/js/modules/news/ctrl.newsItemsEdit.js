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