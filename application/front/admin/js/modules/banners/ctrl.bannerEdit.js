angular.module('Peaks.Banners').controller('BannerEditCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams){

  menuControl('banners');
  $scope.section = 'banners/banners';
  $scope.backUrl = 'banners/zones/';

  $scope.tinymceOptions = tinymceConfig;

  var id = $stateParams.id,
      parent_id = $stateParams['parent_id'];

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

      $scope.backUrl = "banners/zones/"+ $scope.item.parent_id;

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
                window.location.hash = '/banners/zones/'+$scope.item.parent_id;
              }
              else if (id === 'new' && data.errors.length === 0)
              {
                window.location.hash = '/banners/banners/'+data.id;
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
                window.location.hash = '#/banners/zones/'+$scope.item.parent_id;
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
    $scope.backUrl = "banners/zones/"+ $scope.item.parent_id;
  }
}])