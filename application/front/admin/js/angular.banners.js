//angular

function BannerZoneListCtrl($scope, $http, $injector)
{

  var config = {
    section : "banner-zones",
    menu : 'banners',
    getUrl : '/admin_banners/bannerzone_list/',
    deleteUrl : 'admin_banners/delete_bannerzone/'
  }

  $scope.table = [
      {title : 'Nom', param : 'name'},
      {title : 'Nombre de bannières', param : 'childs_count'}
    ];

  $scope.pageTitle = 'Zones de bannière';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}

function BannerZoneEditCtrl($scope, $http, $routeParams) {

  $scope.section = "banners";
  $scope.backUrl = "banner-zones/list";
  menuControl('banners');

   $scope.tinymceOptions = {
    plugins: [
        "autolink link image",
        "searchreplace visualblocks code fullscreen",
        "table contextmenu paste"
    ],
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image"
  }

  init_page();
  

  $scope.getView = function(id)
  {
    window.location.hash = '/banner-zones/banner/'+id;
    block();
  }

  var id = $routeParams.id;
  $scope.mode =  id;

  $scope.editHide = true;
  $scope.editShow = false;

  $scope.assetsList = {
    assetPath : 'banners~'+id,
    editPath : 'banner-zones/banner/',
    controllerPath : 'admin_banners/update_banner'
  }
 
  var getTheItem = function(){
    $http.get('/admin_banners/get_item/'+id).success(function(data) {
      $scope.item = data.content_items;
      init_page();
    });
  }

  var getTheMedia = function(){
    $http.get('/admin_banners/banner_list/'+id).success(function(data) {
      $scope.assets = data;
    });
  }

  $scope.save = function (returnToParent) {

    $scope.alert = 'Sauvegarde…';
    showAlert();


    $http({
          url: '/admin_banners/update_bannerzone',
          method: "POST",
          data: $scope.item,
          headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {
        console.log(data);
              if (returnToParent && data.errors.length === 0) {
                window.location.hash = '/banner-zones/list';
              }
              else if (id === 'new' && data.errors.length === 0)
              {
                window.location.hash = '/banner-zones/edit/'+data.id;
              }
              else
              {
                $scope.alert = data.message;
                $scope.errors = data.errors;
                showFadeAlert();
                //getTheItem();
              }
          }).error(function (data, status, headers, config) {
              $scope.alert = 'Une erreure est survenue.';
              showFadeAlert();
          });
         
  }

  $scope.delete = function () {
    bootbox.confirm('Etes vous sur de vouloir supprimer cette bannière ?', function(result)
    {
      if (result) {
        {
          $http.get('/admin_banners/delete/'+id).success(function(data) {
            window.location.hash = '/banner-zones/list';
          });
       }
      };
    });
  }

  if ($scope.mode != 'new') {
    getTheItem();
    getTheMedia();
  } 
  else {
    $scope.hideForNew = true;
    $scope.item = {};
  }
}


//medias

function BannerEditCtrl($scope, $http, $routeParams) {


  menuControl('banners');
  $scope.section = 'banners/banners';
  $scope.backUrl = 'banner-zones/list'

  $scope.tinymceOptions = {
    plugins: [
        "autolink link image",
        "searchreplace visualblocks code fullscreen",
        "table contextmenu paste"
    ],
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image"
  }

  var id = $routeParams.id,
      parent_id = $routeParams['parent_id'];

  $scope.mode = id;

  if (id === 'new') {
    $scope.uploader = {
      w : 0,
      h : 0,
      item_id : 0,
      folder : 'assets/images/banners/'+parent_id+'/',
      assetPath : 'banners~'+parent_id,
      crop : 1,
      uniqueName : true
    }
  };

  var getTheParent = function(){
    //contenu
    $http.get('/admin_banners/get_item/' + $scope.item.parent_id).success(function(data) {
      $scope.parent = data.content_items;

      $scope.uploader.w = $scope.parent.width;
      $scope.uploader.h = $scope.parent.height;

    });
  }

  var getTheItem = function(){
    $http.get('/admin_banners/get_banner/'+id).success(function(data) {
      $scope.item = data.content_items[0];

      $scope.backUrl = "banner-zones/edit/"+ $scope.item.parent_id;

      $scope.uploader = {
        w : 0,
        h : 0,
        item_id : 0,
        folder : 'assets/images/banners/'+$scope.item.parent_id+'/',
        assetPath : 'banners~'+$scope.item.parent_id,
        crop : 1,
        uniqueName : true
      }

      init_page();
      getTheParent();
    });
  }

    //


  $scope.save = function (returnToParent) {

    $scope.alert = 'Sauvegarde…';
    showAlert();

    if ( id === 'new' ) {
      $scope.item.parent_id = parent_id;
    }
    console.log($scope.item);
    $http({
          url: '/admin_banners/update_banner',
          method: "POST",
          data: $scope.item,
          headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {

              console.log(data);

              if (returnToParent && data.errors.length === 0) {
                window.location.hash = '/banner-zones/edit/'+$scope.item.parent_id;
              }
              else if (id === 'new' && data.errors.length === 0)
              {
                window.location.hash = '/banner-zones/banner/'+data.id;
              }
              else
              {
                $scope.alert = data.message;
                $scope.errors = data.errors;
                showFadeAlert();
                //getTheItem();
              }

          }).error(function (data, status, headers, config) {
              $scope.alert = 'Une erreure est survenue.';
              showFadeAlert();
          });
  }

  $scope.delete = function () {
    bootbox.confirm('Etes vous sur de vouloir supprimer cette bannière ?', function(result)
    {
      if (result) 
      {
          $http.get('/admin_banners/delete_banner/'+id).success(function(data) {
                window.location.hash = '#/banner-zones/edit/'+$scope.item.parent_id;
          });
      };
    });
  }

  if ( id != 'new') {
    getTheItem();
  }
  else
  {
    $scope.item = {
      parent_id : parent_id
    }
    init_page();
    getTheParent();
    $scope.backUrl = "banner-zones/edit/"+ $scope.item.parent_id;
  }
}

