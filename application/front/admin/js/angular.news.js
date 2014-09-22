function NewsCategoriesList($scope, $http, $injector)
{

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

}


function NewsCategoriesEdit($scope, $http, $routeParams)
{

  $scope.section = "news/categories";
  menuControl('news');

  var id = $routeParams.id
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
    window.location.hash = '/news/edit/'+id;
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
}


function NewsListCtrl($scope, $http, $injector)
{

  var config = {
    section : "news",
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

}


function EditNews($scope, $http, $routeParams, tagsRespository, newsCategoriesRepository) {
  init_page();
  

  $scope.section = "news";
  menuControl('news');

  var id = $routeParams.id;
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
}