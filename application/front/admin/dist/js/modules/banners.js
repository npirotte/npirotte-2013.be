angular.module('Peaks.Banners', ['Peaks.Banners.Services', 'Peaks.Banners.Directives', 'Peaks.Banners.Repositories']);
angular.module('Peaks.Banners.Services', []);
angular.module('Peaks.Banners.Directives', []);
angular.module('Peaks.Banners.Repositories', [])
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
angular.module('Peaks.Banners').controller('BannerZoneListCtrl', ['$scope', '$http','$injector', function($scope, $http, $injector){
	  var config = {
	    section : "banners/zones",
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
}]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9iYW5uZXJzLm1vZHVsZS5qcyIsImN0cmwuYmFubmVyRWRpdC5qcyIsImN0cmwuYmFubmVyWm9uZUVkaXQuanMiLCJjdHJsLmJhbm5lclpvbmVMaXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJiYW5uZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkJhbm5lcnMnLCBbJ1BlYWtzLkJhbm5lcnMuU2VydmljZXMnLCAnUGVha3MuQmFubmVycy5EaXJlY3RpdmVzJywgJ1BlYWtzLkJhbm5lcnMuUmVwb3NpdG9yaWVzJ10pO1xyXG5hbmd1bGFyLm1vZHVsZSgnUGVha3MuQmFubmVycy5TZXJ2aWNlcycsIFtdKTtcclxuYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkJhbm5lcnMuRGlyZWN0aXZlcycsIFtdKTtcclxuYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkJhbm5lcnMuUmVwb3NpdG9yaWVzJywgW10pIiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkJhbm5lcnMnKS5jb250cm9sbGVyKCdCYW5uZXJFZGl0Q3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRzdGF0ZVBhcmFtcyl7XHJcblxyXG4gIG1lbnVDb250cm9sKCdiYW5uZXJzJyk7XHJcbiAgJHNjb3BlLnNlY3Rpb24gPSAnYmFubmVycy9iYW5uZXJzJztcclxuICAkc2NvcGUuYmFja1VybCA9ICdiYW5uZXJzL3pvbmVzLyc7XHJcblxyXG4gICRzY29wZS50aW55bWNlT3B0aW9ucyA9IHRpbnltY2VDb25maWc7XHJcblxyXG4gIHZhciBpZCA9ICRzdGF0ZVBhcmFtcy5pZCxcclxuICAgICAgcGFyZW50X2lkID0gJHN0YXRlUGFyYW1zWydwYXJlbnRfaWQnXTtcclxuXHJcbiAgJHNjb3BlLm1vZGUgPSBpZDtcclxuXHJcbiAgaWYgKGlkID09PSAnbmV3Jykge1xyXG4gICAgJHNjb3BlLnVwbG9hZGVyID0ge1xyXG4gICAgICB3IDogMCxcclxuICAgICAgaCA6IDAsXHJcbiAgICAgIGl0ZW1faWQgOiAwLFxyXG4gICAgICBmb2xkZXIgOiAnYXNzZXRzL2ltYWdlcy9iYW5uZXJzLycrcGFyZW50X2lkKycvJyxcclxuICAgICAgYXNzZXRQYXRoIDogJ2Jhbm5lcnN+JytwYXJlbnRfaWQsXHJcbiAgICAgIGNyb3AgOiAxLFxyXG4gICAgICB1bmlxdWVOYW1lIDogdHJ1ZVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIHZhciBnZXRUaGVQYXJlbnQgPSBmdW5jdGlvbigpe1xyXG4gICAgLy9jb250ZW51XHJcbiAgICAkaHR0cC5nZXQoJy9hZG1pbl9iYW5uZXJzL2dldF9pdGVtLycgKyAkc2NvcGUuaXRlbS5wYXJlbnRfaWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAkc2NvcGUucGFyZW50ID0gZGF0YS5jb250ZW50X2l0ZW1zO1xyXG5cclxuICAgICAgJHNjb3BlLnVwbG9hZGVyLncgPSAkc2NvcGUucGFyZW50LndpZHRoO1xyXG4gICAgICAkc2NvcGUudXBsb2FkZXIuaCA9ICRzY29wZS5wYXJlbnQuaGVpZ2h0O1xyXG5cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmFyIGdldFRoZUl0ZW0gPSBmdW5jdGlvbigpe1xyXG4gICAgJGh0dHAuZ2V0KCcvYWRtaW5fYmFubmVycy9nZXRfYmFubmVyLycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAkc2NvcGUuaXRlbSA9IGRhdGEuY29udGVudF9pdGVtc1swXTtcclxuXHJcbiAgICAgICRzY29wZS5iYWNrVXJsID0gXCJiYW5uZXJzL3pvbmVzL1wiKyAkc2NvcGUuaXRlbS5wYXJlbnRfaWQ7XHJcblxyXG4gICAgICAkc2NvcGUudXBsb2FkZXIgPSB7XHJcbiAgICAgICAgdyA6IDAsXHJcbiAgICAgICAgaCA6IDAsXHJcbiAgICAgICAgaXRlbV9pZCA6IDAsXHJcbiAgICAgICAgZm9sZGVyIDogJ2Fzc2V0cy9pbWFnZXMvYmFubmVycy8nKyRzY29wZS5pdGVtLnBhcmVudF9pZCsnLycsXHJcbiAgICAgICAgYXNzZXRQYXRoIDogJ2Jhbm5lcnN+Jyskc2NvcGUuaXRlbS5wYXJlbnRfaWQsXHJcbiAgICAgICAgY3JvcCA6IDEsXHJcbiAgICAgICAgdW5pcXVlTmFtZSA6IHRydWVcclxuICAgICAgfVxyXG5cclxuICAgICAgaW5pdF9wYWdlKCk7XHJcbiAgICAgIGdldFRoZVBhcmVudCgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAgIC8vXHJcblxyXG5cclxuICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIChyZXR1cm5Ub1BhcmVudCkge1xyXG5cclxuICAgICRzY29wZS5hbGVydCA9ICdTYXV2ZWdhcmRl4oCmJztcclxuICAgIHNob3dBbGVydCgpO1xyXG5cclxuICAgIGlmICggaWQgPT09ICduZXcnICkge1xyXG4gICAgICAkc2NvcGUuaXRlbS5wYXJlbnRfaWQgPSBwYXJlbnRfaWQ7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuaXRlbSk7XHJcbiAgICAkaHR0cCh7XHJcbiAgICAgICAgICB1cmw6ICcvYWRtaW5fYmFubmVycy91cGRhdGVfYmFubmVyJyxcclxuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICBkYXRhOiAkc2NvcGUuaXRlbSxcclxuICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG5cclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHJldHVyblRvUGFyZW50ICYmIGRhdGEuZXJyb3JzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL2Jhbm5lcnMvem9uZXMvJyskc2NvcGUuaXRlbS5wYXJlbnRfaWQ7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGlkID09PSAnbmV3JyAmJiBkYXRhLmVycm9ycy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL2Jhbm5lcnMvYmFubmVycy8nK2RhdGEuaWQ7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gZGF0YS5lcnJvcnM7XHJcbiAgICAgICAgICAgICAgICBzaG93RmFkZUFsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAvL2dldFRoZUl0ZW0oKTtcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0ID0gJ1VuZSBlcnJldXJlIGVzdCBzdXJ2ZW51ZS4nO1xyXG4gICAgICAgICAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgICAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGJvb3Rib3guY29uZmlybSgnRXRlcyB2b3VzIHN1ciBkZSB2b3Vsb2lyIHN1cHByaW1lciBjZXR0ZSBiYW5uacOocmUgPycsIGZ1bmN0aW9uKHJlc3VsdClcclxuICAgIHtcclxuICAgICAgaWYgKHJlc3VsdCkgXHJcbiAgICAgIHtcclxuICAgICAgICAgICRodHRwLmdldCgnL2FkbWluX2Jhbm5lcnMvZGVsZXRlX2Jhbm5lci8nK2lkKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJyMvYmFubmVycy96b25lcy8nKyRzY29wZS5pdGVtLnBhcmVudF9pZDtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAoIGlkICE9ICduZXcnKSB7XHJcbiAgICBnZXRUaGVJdGVtKCk7XHJcbiAgfVxyXG4gIGVsc2VcclxuICB7XHJcbiAgICAkc2NvcGUuaXRlbSA9IHtcclxuICAgICAgcGFyZW50X2lkIDogcGFyZW50X2lkXHJcbiAgICB9XHJcbiAgICBpbml0X3BhZ2UoKTtcclxuICAgIGdldFRoZVBhcmVudCgpO1xyXG4gICAgJHNjb3BlLmJhY2tVcmwgPSBcImJhbm5lcnMvem9uZXMvXCIrICRzY29wZS5pdGVtLnBhcmVudF9pZDtcclxuICB9XHJcbn1dKSIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5CYW5uZXJzJykuY29udHJvbGxlcignQmFubmVyWm9uZUVkaXRDdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zKXtcclxuXHJcblx0JHNjb3BlLnNlY3Rpb24gPSBcImJhbm5lcnNcIjtcclxuICAkc2NvcGUuYmFja1VybCA9IFwiYmFubmVycy96b25lc1wiO1xyXG4gIG1lbnVDb250cm9sKCdiYW5uZXJzJyk7XHJcblxyXG4gICAkc2NvcGUudGlueW1jZU9wdGlvbnMgPSB7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgXCJhdXRvbGluayBsaW5rIGltYWdlXCIsXHJcbiAgICAgICAgXCJzZWFyY2hyZXBsYWNlIHZpc3VhbGJsb2NrcyBjb2RlIGZ1bGxzY3JlZW5cIixcclxuICAgICAgICBcInRhYmxlIGNvbnRleHRtZW51IHBhc3RlXCJcclxuICAgIF0sXHJcbiAgICB0b29sYmFyOiBcImluc2VydGZpbGUgdW5kbyByZWRvIHwgc3R5bGVzZWxlY3QgfCBib2xkIGl0YWxpYyB8IGFsaWdubGVmdCBhbGlnbmNlbnRlciBhbGlnbnJpZ2h0IGFsaWduanVzdGlmeSB8IGJ1bGxpc3QgbnVtbGlzdCB8IGxpbmsgaW1hZ2VcIlxyXG4gIH1cclxuXHJcbiAgaW5pdF9wYWdlKCk7XHJcbiAgXHJcblxyXG4gICRzY29wZS5nZXRWaWV3ID0gZnVuY3Rpb24oaWQpXHJcbiAge1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL2Jhbm5lci16b25lcy9iYW5uZXIvJytpZDtcclxuICAgIGJsb2NrKCk7XHJcbiAgfVxyXG5cclxuICB2YXIgaWQgPSAkc3RhdGVQYXJhbXMuaWQ7XHJcbiAgJHNjb3BlLm1vZGUgPSAgaWQ7XHJcblxyXG4gICRzY29wZS5lZGl0SGlkZSA9IHRydWU7XHJcbiAgJHNjb3BlLmVkaXRTaG93ID0gZmFsc2U7XHJcblxyXG4gICRzY29wZS5hc3NldHNMaXN0ID0ge1xyXG4gICAgYXNzZXRQYXRoIDogJ2Jhbm5lcnN+JytpZCxcclxuICAgIGVkaXRQYXRoIDogJ2Jhbm5lcnMvYmFubmVycy8nLFxyXG4gICAgY29udHJvbGxlclBhdGggOiAnYWRtaW5fYmFubmVycy91cGRhdGVfYmFubmVyJ1xyXG4gIH1cclxuIFxyXG4gIHZhciBnZXRUaGVJdGVtID0gZnVuY3Rpb24oKXtcclxuICAgICRodHRwLmdldCgnL2FkbWluX2Jhbm5lcnMvZ2V0X2l0ZW0vJytpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICRzY29wZS5pdGVtID0gZGF0YS5jb250ZW50X2l0ZW1zO1xyXG4gICAgICBpbml0X3BhZ2UoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdmFyIGdldFRoZU1lZGlhID0gZnVuY3Rpb24oKXtcclxuICAgICRodHRwLmdldCgnL2FkbWluX2Jhbm5lcnMvYmFubmVyX2xpc3QvJytpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICRzY29wZS5hc3NldHMgPSBkYXRhO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uIChyZXR1cm5Ub1BhcmVudCkge1xyXG5cclxuICAgICRzY29wZS5hbGVydCA9ICdTYXV2ZWdhcmRl4oCmJztcclxuICAgIHNob3dBbGVydCgpO1xyXG5cclxuXHJcbiAgICAkaHR0cCh7XHJcbiAgICAgICAgICB1cmw6ICcvYWRtaW5fYmFubmVycy91cGRhdGVfYmFubmVyem9uZScsXHJcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgZGF0YTogJHNjb3BlLml0ZW0sXHJcbiAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICBpZiAocmV0dXJuVG9QYXJlbnQgJiYgZGF0YS5lcnJvcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvYmFubmVyLXpvbmVzL2xpc3QnO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlIGlmIChpZCA9PT0gJ25ldycgJiYgZGF0YS5lcnJvcnMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJy9iYW5uZXItem9uZXMvZWRpdC8nK2RhdGEuaWQ7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gZGF0YS5lcnJvcnM7XHJcbiAgICAgICAgICAgICAgICBzaG93RmFkZUFsZXJ0KCk7XHJcbiAgICAgICAgICAgICAgICAvL2dldFRoZUl0ZW0oKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSAnVW5lIGVycmV1cmUgZXN0IHN1cnZlbnVlLic7XHJcbiAgICAgICAgICAgICAgc2hvd0ZhZGVBbGVydCgpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgIFxyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGJvb3Rib3guY29uZmlybSgnRXRlcyB2b3VzIHN1ciBkZSB2b3Vsb2lyIHN1cHByaW1lciBjZXR0ZSBiYW5uacOocmUgPycsIGZ1bmN0aW9uKHJlc3VsdClcclxuICAgIHtcclxuICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICRodHRwLmdldCgnL2FkbWluX2Jhbm5lcnMvZGVsZXRlLycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvYmFubmVyLXpvbmVzL2xpc3QnO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlmICgkc2NvcGUubW9kZSAhPSAnbmV3Jykge1xyXG4gICAgZ2V0VGhlSXRlbSgpO1xyXG4gICAgZ2V0VGhlTWVkaWEoKTtcclxuICB9IFxyXG4gIGVsc2Uge1xyXG4gICAgJHNjb3BlLmhpZGVGb3JOZXcgPSB0cnVlO1xyXG4gICAgJHNjb3BlLml0ZW0gPSB7fTtcclxuICB9XHJcbn1dKSIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5CYW5uZXJzJykuY29udHJvbGxlcignQmFubmVyWm9uZUxpc3RDdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCckaW5qZWN0b3InLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkaW5qZWN0b3Ipe1xyXG5cdCAgdmFyIGNvbmZpZyA9IHtcclxuXHQgICAgc2VjdGlvbiA6IFwiYmFubmVycy96b25lc1wiLFxyXG5cdCAgICBtZW51IDogJ2Jhbm5lcnMnLFxyXG5cdCAgICBnZXRVcmwgOiAnL2FkbWluX2Jhbm5lcnMvYmFubmVyem9uZV9saXN0LycsXHJcblx0ICAgIGRlbGV0ZVVybCA6ICdhZG1pbl9iYW5uZXJzL2RlbGV0ZV9iYW5uZXJ6b25lLydcclxuXHQgIH1cclxuXHJcblx0ICAkc2NvcGUudGFibGUgPSBbXHJcblx0ICAgICAge3RpdGxlIDogJ05vbScsIHBhcmFtIDogJ25hbWUnfSxcclxuXHQgICAgICB7dGl0bGUgOiAnTm9tYnJlIGRlIGJhbm5pw6hyZXMnLCBwYXJhbSA6ICdjaGlsZHNfY291bnQnfVxyXG5cdCAgICBdO1xyXG5cclxuXHQgICRzY29wZS5wYWdlVGl0bGUgPSAnWm9uZXMgZGUgYmFubmnDqHJlJztcclxuXHJcblx0ICAkaW5qZWN0b3IuaW52b2tlKEl0ZW1MaXN0LCB0aGlzLCB7JHNjb3BlOiAkc2NvcGUsICRodHRwOiAkaHR0cCwgY29uZmlnOiBjb25maWd9KTtcdFxyXG59XSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==