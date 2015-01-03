angular.module('Peaks.Manager').controller('UserEditCtrl', ['$scope', '$http', '$stateParams', 'GroupsRepository', function($scope, $http, $stateParams, groupsRepository){
	 
  menuControl('manager');
  var id = $stateParams.userId;

  $scope.mode = id;

  $scope.backUrl = 'manager/users';

  $scope.userGroups = [];
  groupsRepository.GetGroups(function(data)
  {
    $scope.userGroups = data;
  });

   var getTheUser = function(){
      if (id != 'new') {
        $http.get('/admin_manager/user_details/'+id).success(function(data) {
          $scope.item = data[0];
          console.log($scope.item);
          init_page();
        });
      } 
    };

  $scope.panes = {
    profile : 'active',
    contact_info : false,
    config : false
  }


  $scope.selectPane = function(namespace, pane)
  {
    $scope.panes = {
      profile : false,
      contact_info : false,
      config : false
    }

    $scope[namespace][pane] = 'active';
  }


  $scope.uploader = {
    w : 240,
    h : 300,
    item_id : id,
    folder : 'assets/images/users/'+id+'/thumbs/',
    assetPath : 'users~'+id+'~thumbs',
    crop : 1,
    uniqueName :  true
  }


    //

  // save

  $scope.save = function (returnToList) {

    if( $scope.item.pwd1 && $scope.item.pwd1 != $scope.item.pwd2)
    {
      //$scope.alert = "Les mots de passe ne sont pas identiques";
      $scope.errors = new Array("Les mots de passe ne sont pas identiques");
      return false;
    }

    $scope.alert = "Sauvegarde…";
    showAlert();
    console.log($scope.item);

      $http({
            url: '/admin_manager/update_user',
            method: "POST",
            data: $scope.item,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
              console.log(data);
              if (returnToList && data.error == 0) {
                window.location.hash = '/manager/users';
              }
              else if (id == 'new' && data.error == 0)
              {
                window.location.hash = '/manager/users/' + data.user_id;
              }
              else
              {
                $scope.alert = data.message[data.message.length - 1];
                if (data.message.length > 1) {
                  $scope.errors = data.message;
                }
                else
                {
                  $scope.errors = 0;
                }
                
                showFadeAlert();
              }
            
              
            }).error(function (data, status, headers, config) {
                $scope.alert = 'Une erreure est survenue.';
                showFadeAlert();
                console.log(data);
            });
  }

  $scope.delete = function () {
    $http.get('/admin_manager/users_list').success(function(data) {
      if ( data.length <= 1 ) {
        $scope.alert = 'Cet utilisateur est le dernier enregistré.';
        showFadeAlert();
      }
      else {
        $http.get('/admin_manager/delete_user/'+id).success(function(data) {
          window.location.hash = '/manager/users';
        });
      }
    });

  } 

  // chargement du contenu

  if (id != 'new') {
    getTheUser();
  }
  else
  {
    setTimeout("init_page()",10);
  }  
}]);