// manager /////////////////////// 

function UserListCtrl($scope, $http, $injector)
{

  var config = {
    section : "manager/comptes",
    menu : 'manager',
    getUrl : '/admin_manager/users_list/',
    deleteUrl : 'admin_manager/delete_user/',
    getCallBack : function(data)
    {
      // traitement du statut utilisateur 
      var i = 0;
      angular.forEach($scope.items, function(item){
        $scope.items[i].statut = item.active == 1 ? 'success' : 'warning';    
        if (item.suspend == 1) $scope.items[i].statut = 'error';
        i++;
      });
    }
  }

  $scope.table = [
      {title: '', param : 'src', width: '60px'},
      {title : 'Nom d\'utilisateur', param : 'username', strong : true},
      {title: 'Email', param : 'email'},
    ];

  $scope.pageTitle = 'Utilisateurs';

  $scope.thumbPath = 'users';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}


function EditUser($scope, $http, $routeParams, groupsRespository) {

  menuControl('manager');
  var id = $routeParams.userId;

  $scope.mode = id;

  $scope.backUrl = 'manager/comptes';

  $scope.userGroups = [];
  groupsRespository.GetGroups(function(data)
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
                window.location.hash = '/manager/comptes';
              }
              else if (id == 'new' && data.error == 0)
              {
                window.location.hash = '/manager/comptes/edit/' + data.user_id;
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
          window.location.hash = '/manager/comptes';
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
}


function GroupsListCtrl($scope, $http, $injector)
{
  var config = {
    section : "manager/groupes",
    menu : 'manager',
    getUrl : '/admin_manager/user_groups_list/',
    deleteUrl : 'admin_manager/user_group_delete/',
    getCallBack : function(data)
    {
      // traitement du statut utilisateur 
      var i = 0;
      angular.forEach($scope.items, function(item){
        $scope.items[i].statut = item.active == 1 ? 'success' : 'warning';    
        if (item.suspend == 1) $scope.items[i].statut = 'error';
        i++;
      });
    }
  }

  $scope.table = [
      {title : 'Nom', param : 'ugrp_name', strong : true},
    ];

  $scope.pageTitle = 'Groupes d\'utilisateurs';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});
}

function GroupsEditCtrl($scope, $routeParams, groupsRespository)
{
  menuControl('manager');
  var id = $routeParams.groupId;

  $scope.mode = id;

  $scope.backUrl = 'manager/groupes';

  function getData()
  {
    console.log('ok');
    groupsRespository.GetGroup(id, function(data)
    {
      console.log(data);
      $scope.item = data;
      init_page();
    })
  }

  $scope.save = function(returnToList)
  {
    groupsRespository.SaveGroup($scope.item, function(data)
    {
      if (returnToList && data.error == 0) {
          window.location.hash = $scope.backUrl;
        }
        else if (id == 'new' && data.error == 0)
        {
          window.location.hash = '/manager/groupes/edit/' + data.id;
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
    })
  }

  $scope.delete = function()
  {
    groupsRespository.DeleteGroup(id, function(){
      window.location.hash = $scope.backUrl;
    });
  }

  if (id != 'new') {
    getData();
  }
  else
  {
    $scope.item = {}
    init_page();
  }
}

admin.directive('activationMessage', function(){
  // Runs during compile
  return {
    //require: 'ngModel',
    template: '<div class="alert alert-warning alert-dismissable"><button type="button" data-dismiss="alert" class="close" aria-hidden="true">&times;</button>Ce compte n\'est pas encore activé. <a href="javascript:void(0)" ng-click="activateUser()">Forcer l\'activation</a></div>',
    // name: '',
    // priority: 1,
    // terminal: true,
    // scope: {}, // {} = isolate, true = child, false/undefined = no change
    controller: function($scope, $element, $attrs, $transclude, $http) {
      $scope.activateUser = function()
      {
        $scope.alert = "Activation…";
        showAlert();

          $http({
            url: '/admin_manager/activate_user/' + $scope.item.user_id,
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
                console.log(data);
                $scope.alert = data.message;
                $scope.item.active = 1;
                showFadeAlert(); 
            }).error(function (data, status, headers, config) {
                $scope.alert = 'Une erreure est survenue.';
                showFadeAlert();
                console.log(data);
            });
      }
    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    // templateUrl: '',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    // link: function($scope, iElm, iAttrs, controller) {
      
    // }
  };
});

admin.directive('contactInfos', function(){
  // Runs during compile
  return {
    //require: 'ngModel',
    //template: 'test upload',
    // name: '',
    // priority: 1,
    // terminal: true,
    // scope: {
    //     w : '=w',
    //     h : '=h',
    // }, // {} = isolate, true = child, false/undefined = no change
    controller: function($scope, $element, $attrs, $transclude, $http) {
        
        // gestion des infos contact

        var id = $scope.item.user_id;

        function getContactInfos ()
        {
          $http.get('/admin_contact/get_contact_info/'+id).success(function(data)
            {
              var i = 0;
              angular.forEach(data, function(element){
                data[i].weight = parseInt(data[i].weight);
                data[i].id = parseInt(data[i].id);
                i++;
              });
              $scope.contactItems = data;
              console.log(data);

            });
        }

         $scope.sortableOptions = {
          stop: function(e, ui) { 
            var i = 0;
            angular.forEach($scope.contactItems, function( item )
            {
                if (i != item.weight )
                {
                  $scope.contactItems[i].weight = i;
                  updateItem($scope.contactItems[i]);
                }
                i++;
            })
          },
          axis: 'y',
          placeholder: "beingDragged",
          tolerance: 'pointer',
        };

      
        $scope.addContactInfo = function()
        {
          $scope.newContactInfo.parent_id = id;
          $scope.newContactInfo.weight = $scope.contactItems.length;
          $http({
                  url: '/admin_contact/create_contact_info',
                  method: "POST",
                  data: $scope.newContactInfo,
                  headers: {'Content-Type': 'application/json'}
              }).success(function (data, status, headers, config) {
                  $scope.contactItems.push({id:data.id, name: data.name, value:data.value, target:data.target, icon:data.icon, weight:data.weight});
                  }).error(function (data, status, headers, config) {
                      $scope.alert = 'Une erreure est survenue.';
                      console.log(data);
                  }); 

          $scope.newContactInfo = null;
          $scope.editModeOpen = false;
        }

        $scope.switchEditMode = function(object)
        {
          $scope.editMode = true;
          $scope.editedItem = object;
          $('#edit-from-anchor').scrollTo();
        }

        $scope.updateContactInfo = function(object)
        {
          $http(
          {
            url: '/admin_contact/edit_contact_info',
            method: 'POST',
            data: $scope.editedItem,
            headers: {'Content-Type': 'application/json'}
          }).success(function(data) {
            var i = 0;
            angular.forEach($scope.contactItems, function(item){
              if (item.id === $scope.editedItem.id) {$scope.contactItems[i] = $scope.editedItem};
              i++;
            });
            $scope.editMode = false;
          })
        }

        $scope.deleteContactInfo = function()
        {
          $http({
            url: '/admin_contact/delete_contact_info',
            method: 'POST',
            data: $scope.editedItem,
            headers: {'Content-Type': 'application/json'}
          }).success(function(data) {
            if (data.error === 0) {
                $scope.editMode = false;
                $scope.alert = data.message;

                var temp = [],
                i = 0;

                angular.forEach($scope.contactItems, function(item) {


                  if ( item.weight > $scope.editedItem.weight )
                  {
                    item.weight = item.weight - 1;
                    updateItem(item);
                  }

                  console.log(item);

                  if ( item.id != $scope.editedItem.id ) temp.push(item);

                });
                $scope.contactItems = temp;

            };
          })
        }

        function updateItem(object)
        {
                $http(
                {
                  url: '/admin_contact/edit_contact_info',
                  method: 'POST',
                  data: object,
                  headers: {'Content-Type': 'application/json'}
                });
        }

        $scope.reorder = function(object, sens)
        {
          var currentWeight = object.weight,
              newWeight,
              i=0,
              modified = 0;

          function setMinus()
          {
            angular.forEach($scope.contactItems, function(item){
              if (item.weight === currentWeight+1) { $scope.contactItems[i].weight = currentWeight; modified = 1};
              if (item.id === object.id) { $scope.contactItems[i].weight = currentWeight+1; modified = 1};
              i++;
              if (modified === 1) {updateItem(item)};
            });
          }

          function setPlus()
          {
            angular.forEach($scope.contactItems, function(item){
              if (item.weight === currentWeight-1) { $scope.contactItems[i].weight = currentWeight; modified = 1};
              if (item.id === object.id) { $scope.contactItems[i].weight = currentWeight-1; modified = 1};
              i++;
              if (modified === 1) {updateItem(item)};
            });
          }

          sens == 'plus' ? setMinus() : setPlus();

        }


        getContactInfos();

    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    templateUrl: '/admin/view_loader/'+templateDir+'/manager/widgets/contact_infos',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    // link: function($scope, iElm, iAttrs, controller) {
      
    // }
  };
});


function LogsList($scope, logsRepository, $sce)
{

  $scope.details = new Array();

  function getLogs(getOld)
  {
    logsRepository.logList(true, function(data, total_items)
    {
      $scope.items = data;
      $scope.total_items = total_items;
    });
  }

  $scope.refresh = function()
  {
    getLogs(false);
  }

  $scope.getMore = function()
  {
    getLogs(true)
  }

  $scope.getDetails = function(name)
  {
    $scope.details = new Array();

    $scope.details.fileName = name;

    logsRepository.logDetails(name, function(data)
    {
      $scope.details.content = data.content;
      console.log($scope.details);
    })
  }

  $scope.to_trusted = function(html_code) {
    return $sce.trustAsHtml(html_code);
  }

  $scope.deleteLogs = function()
  {
    logsRepository.deleteLogs(function()
    {
      $scope.items = null,
      $scope.total_items = 0;
      $scope.details = new Array();
    })
  }

  getLogs(false);
}

function LogsDetails($scope, logsRepository)
{

}
