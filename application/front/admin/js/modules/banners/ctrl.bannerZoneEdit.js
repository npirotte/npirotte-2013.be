angular.module('Peaks.Banners').controller('BannerZoneEditCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams){

	$scope.section = "banners";
  $scope.backUrl = "banners/zones";
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

  var id = $stateParams.id;
  $scope.mode =  id;

  $scope.editHide = true;
  $scope.editShow = false;

  $scope.assetsList = {
    assetPath : 'banners~'+id,
    editPath : 'banners/banners/',
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
}])