angular.module('Peaks.Manager', ['Peaks.Manager.Services', 'Peaks.Manager.Directives', 'Peaks.Manager.Repositories']);
angular.module('Peaks.Manager.Services', []);
angular.module('Peaks.Manager.Directives', []);
angular.module('Peaks.Manager.Repositories', []);
angular.module('Peaks.Manager').controller('GroupEditCtrl', ['$scope', '$stateParams', 'GroupsRepository', function($scope, $stateParams, groupsRepository){
  
  menuControl('manager');
  var id = $stateParams.groupId;

  $scope.mode = id;

  $scope.backUrl = 'manager/groups';

  function getData()
  {
    console.log('ok');
    groupsRepository.GetGroup(id, function(data)
    {
      console.log(data);
      $scope.item = data;
      init_page();
    })
  }

  $scope.save = function(returnToList)
  {
    groupsRepository.SaveGroup($scope.item, function(data)
    {
      if (returnToList && data.error == 0) {
          window.location.hash = $scope.backUrl;
        }
        else if (id == 'new' && data.error == 0)
        {
          window.location.hash = '/manager/groupes/' + data.id;
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
    groupsRepository.DeleteGroup(id, function(){
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
}])
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
angular.module('Peaks.Manager').controller('GroupListCtrl', ['$scope', '$http','$injector', function($scope, $http, $injector){
	var config = {
	    section : "manager/groups",
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
  
}])
// manager /////////////////////// 

angular.module('Peaks.Manager').controller('UserListCtrl', ['$scope', '$http','$injector', function($scope, $http, $injector){
    var config = {
      section : "manager/users",
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
}]);
angular.module('Peaks.Manager.Directives').directive('activationMessage', function(){
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
angular.module('Peaks.Manager.Directives').directive('contactInfos', function(){
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
angular.module('Peaks.Manager.Directives').directive('serveUsage', ['$http', function($http){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div google-chart chart="chart" style="{{chart.cssStyle}}" on-ready="chartReady()"/>',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			
			function serverUsagePie(appSize, assetsSize, cacheSize, total)
			{


				var chart1 = {};
			    chart1.type = "PieChart";
			    chart1.displayed = false;
			    chart1.cssStyle = "height:200px; width:100%;";
			    chart1.data = {"cols": [
			        {id: "disk", label: "Disque", type: "string"},
			        {id: "database", label: "Base de donnée", type: "number"}
			    ], "rows": [
			        {c: [
			            {v: "Application"},
			            {v: appSize, f: appSize/1000000+" Mo"}
			        ]},
			        {c: [
			            {v: "Données"},
			            {v: assetsSize, f: assetsSize/1000000+" Mo"}
			        ]},
			        {c: [
			            {v: "Cache"},
			            {v: cacheSize, f: cacheSize/1000000+" Mo"}
			        ]},
			        {c: [
			            {v: "Libre"},
			            {v: total - appSize - assetsSize - cacheSize , f: ( total - appSize - assetsSize - cacheSize ) /1000000 +" Mo sur " + total/1000000+" Mo"}
			        ]}
			    ]};

			    chart1.options = {
			        "title": "Utilisation du serveur",
			        "isStacked": "true",
			        "fill": 20,
			        "pieHole": 0.3,
			        "pieSliceText": 'none',
			        "animation":{
				        duration: 1000,
				        easing: 'out',
				      },
			        "displayExactValues": true,
			        slices: {
			            0: { color: '#7FFF00' },
			            1: { color: '#9d261d' },
			            2: { color: '#1a1a1a' },
			            3: { color: '#eee' }
			          }
			    };

			    chart1.formatters = {};

			    $scope.chart = chart1;


			    $scope.chartReady = function () {
			        fixGoogleChartsBarsBootstrap();
			    }

			    function fixGoogleChartsBarsBootstrap() {
			        // Google charts uses <img height="12px">, which is incompatible with Twitter
			        // * bootstrap in responsive mode, which inserts a css rule for: img { height: auto; }.
			        // *
			        // * The fix is to use inline style width attributes, ie <img style="height: 12px;">.
			        // * BUT we can't change the way Google Charts renders its bars. Nor can we change
			        // * the Twitter bootstrap CSS and remain future proof.
			        // *
			        // * Instead, this function can be called after a Google charts render to "fix" the
			        // * issue by setting the style attributes dynamically.

			        $(".google-visualization-table-table img[width]").each(function (index, img) {
			            $(img).css("width", $(img).attr("width")).css("height", $(img).attr("height"));
			        });
			    };
			} 

			$http.get('/admin_manager/server_charge').success(function(data) {
				console.log(data);
			      serverUsagePie(parseInt(data.appSize), parseInt(data.assetsSize), parseInt(data.cacheSize), parseInt(data.serverSize));
			      console.log(data);
			 });

		}
	};
}]);

angular.module('Peaks.Manager.Directives').directive('managerUserInfos', ['UsersRepository', function(usersRepository){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: { userId : '=userid'}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs, $transclude) {
			usersRepository.userInfos($scope.userId, function(data)
				{
					$scope.user = data;
				});
		},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<a href="#/manager/users/{{userId}}" >{{user.first_name}} {{user.last_name}}</a>',
		// templateUrl: '',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		//link: function($scope, iElm, iAttrs, controller) {}
	};
}]);
angular.module('Peaks.Manager.Repositories').factory('GroupsRepository', ['$http', function($http){
    var userGroupsCache = [];

    return { 
        GetGroups : function(callback)
        {
          if (userGroupsCache.length > 0) {
            callback(userGroupsCache);
          };

          $http.get('/admin_manager/user_groups_list').success(function(data)
          {
            console.log(data);
            userGroupsCache = data.items; 
            callback(data.items);
          });
        },
        GetGroup : function(id, callback)
        {
          $http.get('/admin_manager/user_group_details/' + id).success(function(data)
          {
            data.ugrp_admin = data.ugrp_admin == 1;
            callback(data);
          });
        },
        SaveGroup : function(data, callback)
        {
          $http({
              url: '/admin_manager/user_group_edit',
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
        DeleteGroup : function(id, callback)
        {
          $http.get('/admin_manager/user_group_delete/' + id).success(function()
          {
            callback();
          });
        }
     }; 
}]);
angular.module('Peaks.Manager.Repositories').factory('UsersRepository', ['$http', function($http){

	var userInfosCache = new Array();

  	return { 
           userInfos: function (id, callback) { 
           		// on regarde si le cache existe
           		if (userInfosCache['user_' + id]) {
           			// on rend l'object
           			callback(userInfosCache['user_' + id]);
           		}
           		else
           		{
           			// sinon on récupère l'info
           			$http.get('/admin_manager/user_infos/'+id)
				    .success(function(data)
				    {
				    	// on stocke l'utilisateur
				    	userInfosCache['user_' + id] = data;
				    	// on traite le callback
				    	callback (data);
				    });
           		}
           } 
     }; 
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9tYW5hZ2VyLm1vZHVsZS5qcyIsImN0cmwuR3JvdXBFZGl0LmpzIiwiY3RybC5Vc2VyRWRpdC5qcyIsImN0cmwuZ3JvdXBMaXN0LmpzIiwiY3RybC51c2VyTGlzdC5qcyIsImRpci5hY3RpdmF0aW9uTWVzc2FnZS5qcyIsImRpci5jb250YWN0SW5mb3MuanMiLCJkaXIuc2VydmVyQ2hhcmdlLmpzIiwiZGlyLnVzZXJJbmZvcy5qcyIsInJlcG8uZ3JvdXBzUmVwb3NpdG9yeS5qcyIsInJlcG8udXNlclJlcG9zaXRvcnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk1hbmFnZXInLCBbJ1BlYWtzLk1hbmFnZXIuU2VydmljZXMnLCAnUGVha3MuTWFuYWdlci5EaXJlY3RpdmVzJywgJ1BlYWtzLk1hbmFnZXIuUmVwb3NpdG9yaWVzJ10pO1xyXG5hbmd1bGFyLm1vZHVsZSgnUGVha3MuTWFuYWdlci5TZXJ2aWNlcycsIFtdKTtcclxuYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk1hbmFnZXIuRGlyZWN0aXZlcycsIFtdKTtcclxuYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk1hbmFnZXIuUmVwb3NpdG9yaWVzJywgW10pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5NYW5hZ2VyJykuY29udHJvbGxlcignR3JvdXBFZGl0Q3RybCcsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdHcm91cHNSZXBvc2l0b3J5JywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIGdyb3Vwc1JlcG9zaXRvcnkpe1xyXG4gIFxyXG4gIG1lbnVDb250cm9sKCdtYW5hZ2VyJyk7XHJcbiAgdmFyIGlkID0gJHN0YXRlUGFyYW1zLmdyb3VwSWQ7XHJcblxyXG4gICRzY29wZS5tb2RlID0gaWQ7XHJcblxyXG4gICRzY29wZS5iYWNrVXJsID0gJ21hbmFnZXIvZ3JvdXBzJztcclxuXHJcbiAgZnVuY3Rpb24gZ2V0RGF0YSgpXHJcbiAge1xyXG4gICAgY29uc29sZS5sb2coJ29rJyk7XHJcbiAgICBncm91cHNSZXBvc2l0b3J5LkdldEdyb3VwKGlkLCBmdW5jdGlvbihkYXRhKVxyXG4gICAge1xyXG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgJHNjb3BlLml0ZW0gPSBkYXRhO1xyXG4gICAgICBpbml0X3BhZ2UoKTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKHJldHVyblRvTGlzdClcclxuICB7XHJcbiAgICBncm91cHNSZXBvc2l0b3J5LlNhdmVHcm91cCgkc2NvcGUuaXRlbSwgZnVuY3Rpb24oZGF0YSlcclxuICAgIHtcclxuICAgICAgaWYgKHJldHVyblRvTGlzdCAmJiBkYXRhLmVycm9yID09IDApIHtcclxuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJHNjb3BlLmJhY2tVcmw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGlkID09ICduZXcnICYmIGRhdGEuZXJyb3IgPT0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvbWFuYWdlci9ncm91cGVzLycgKyBkYXRhLmlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJHNjb3BlLmFsZXJ0ID0gZGF0YS5tZXNzYWdlW2RhdGEubWVzc2FnZS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgIGlmIChkYXRhLm1lc3NhZ2UubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gMDtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgc2hvd0ZhZGVBbGVydCgpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICAkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKVxyXG4gIHtcclxuICAgIGdyb3Vwc1JlcG9zaXRvcnkuRGVsZXRlR3JvdXAoaWQsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJHNjb3BlLmJhY2tVcmw7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGlmIChpZCAhPSAnbmV3Jykge1xyXG4gICAgZ2V0RGF0YSgpO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgJHNjb3BlLml0ZW0gPSB7fVxyXG4gICAgaW5pdF9wYWdlKCk7XHJcbiAgfVxyXG59XSkiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuTWFuYWdlcicpLmNvbnRyb2xsZXIoJ1VzZXJFZGl0Q3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRzdGF0ZVBhcmFtcycsICdHcm91cHNSZXBvc2l0b3J5JywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zLCBncm91cHNSZXBvc2l0b3J5KXtcclxuXHQgXHJcbiAgbWVudUNvbnRyb2woJ21hbmFnZXInKTtcclxuICB2YXIgaWQgPSAkc3RhdGVQYXJhbXMudXNlcklkO1xyXG5cclxuICAkc2NvcGUubW9kZSA9IGlkO1xyXG5cclxuICAkc2NvcGUuYmFja1VybCA9ICdtYW5hZ2VyL3VzZXJzJztcclxuXHJcbiAgJHNjb3BlLnVzZXJHcm91cHMgPSBbXTtcclxuICBncm91cHNSZXBvc2l0b3J5LkdldEdyb3VwcyhmdW5jdGlvbihkYXRhKVxyXG4gIHtcclxuICAgICRzY29wZS51c2VyR3JvdXBzID0gZGF0YTtcclxuICB9KTtcclxuXHJcbiAgIHZhciBnZXRUaGVVc2VyID0gZnVuY3Rpb24oKXtcclxuICAgICAgaWYgKGlkICE9ICduZXcnKSB7XHJcbiAgICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fbWFuYWdlci91c2VyX2RldGFpbHMvJytpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAkc2NvcGUuaXRlbSA9IGRhdGFbMF07XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUuaXRlbSk7XHJcbiAgICAgICAgICBpbml0X3BhZ2UoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBcclxuICAgIH07XHJcblxyXG4gICRzY29wZS5wYW5lcyA9IHtcclxuICAgIHByb2ZpbGUgOiAnYWN0aXZlJyxcclxuICAgIGNvbnRhY3RfaW5mbyA6IGZhbHNlLFxyXG4gICAgY29uZmlnIDogZmFsc2VcclxuICB9XHJcblxyXG5cclxuICAkc2NvcGUuc2VsZWN0UGFuZSA9IGZ1bmN0aW9uKG5hbWVzcGFjZSwgcGFuZSlcclxuICB7XHJcbiAgICAkc2NvcGUucGFuZXMgPSB7XHJcbiAgICAgIHByb2ZpbGUgOiBmYWxzZSxcclxuICAgICAgY29udGFjdF9pbmZvIDogZmFsc2UsXHJcbiAgICAgIGNvbmZpZyA6IGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlW25hbWVzcGFjZV1bcGFuZV0gPSAnYWN0aXZlJztcclxuICB9XHJcblxyXG5cclxuICAkc2NvcGUudXBsb2FkZXIgPSB7XHJcbiAgICB3IDogMjQwLFxyXG4gICAgaCA6IDMwMCxcclxuICAgIGl0ZW1faWQgOiBpZCxcclxuICAgIGZvbGRlciA6ICdhc3NldHMvaW1hZ2VzL3VzZXJzLycraWQrJy90aHVtYnMvJyxcclxuICAgIGFzc2V0UGF0aCA6ICd1c2Vyc34nK2lkKyd+dGh1bWJzJyxcclxuICAgIGNyb3AgOiAxLFxyXG4gICAgdW5pcXVlTmFtZSA6ICB0cnVlXHJcbiAgfVxyXG5cclxuXHJcbiAgICAvL1xyXG5cclxuICAvLyBzYXZlXHJcblxyXG4gICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKHJldHVyblRvTGlzdCkge1xyXG5cclxuICAgIGlmKCAkc2NvcGUuaXRlbS5wd2QxICYmICRzY29wZS5pdGVtLnB3ZDEgIT0gJHNjb3BlLml0ZW0ucHdkMilcclxuICAgIHtcclxuICAgICAgLy8kc2NvcGUuYWxlcnQgPSBcIkxlcyBtb3RzIGRlIHBhc3NlIG5lIHNvbnQgcGFzIGlkZW50aXF1ZXNcIjtcclxuICAgICAgJHNjb3BlLmVycm9ycyA9IG5ldyBBcnJheShcIkxlcyBtb3RzIGRlIHBhc3NlIG5lIHNvbnQgcGFzIGlkZW50aXF1ZXNcIik7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAkc2NvcGUuYWxlcnQgPSBcIlNhdXZlZ2FyZGXigKZcIjtcclxuICAgIHNob3dBbGVydCgpO1xyXG4gICAgY29uc29sZS5sb2coJHNjb3BlLml0ZW0pO1xyXG5cclxuICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW5fbWFuYWdlci91cGRhdGVfdXNlcicsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5pdGVtLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgIGlmIChyZXR1cm5Ub0xpc3QgJiYgZGF0YS5lcnJvciA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvbWFuYWdlci91c2Vycyc7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGVsc2UgaWYgKGlkID09ICduZXcnICYmIGRhdGEuZXJyb3IgPT0gMClcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvbWFuYWdlci91c2Vycy8nICsgZGF0YS51c2VyX2lkO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0ID0gZGF0YS5tZXNzYWdlW2RhdGEubWVzc2FnZS5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLm1lc3NhZ2UubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgc2hvd0ZhZGVBbGVydCgpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0ID0gJ1VuZSBlcnJldXJlIGVzdCBzdXJ2ZW51ZS4nO1xyXG4gICAgICAgICAgICAgICAgc2hvd0ZhZGVBbGVydCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICRodHRwLmdldCgnL2FkbWluX21hbmFnZXIvdXNlcnNfbGlzdCcpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICBpZiAoIGRhdGEubGVuZ3RoIDw9IDEgKSB7XHJcbiAgICAgICAgJHNjb3BlLmFsZXJ0ID0gJ0NldCB1dGlsaXNhdGV1ciBlc3QgbGUgZGVybmllciBlbnJlZ2lzdHLDqS4nO1xyXG4gICAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIHtcclxuICAgICAgICAkaHR0cC5nZXQoJy9hZG1pbl9tYW5hZ2VyL2RlbGV0ZV91c2VyLycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL21hbmFnZXIvdXNlcnMnO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgfSBcclxuXHJcbiAgLy8gY2hhcmdlbWVudCBkdSBjb250ZW51XHJcblxyXG4gIGlmIChpZCAhPSAnbmV3Jykge1xyXG4gICAgZ2V0VGhlVXNlcigpO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgc2V0VGltZW91dChcImluaXRfcGFnZSgpXCIsMTApO1xyXG4gIH0gIFxyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk1hbmFnZXInKS5jb250cm9sbGVyKCdHcm91cExpc3RDdHJsJywgWyckc2NvcGUnLCAnJGh0dHAnLCckaW5qZWN0b3InLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkaW5qZWN0b3Ipe1xyXG5cdHZhciBjb25maWcgPSB7XHJcblx0ICAgIHNlY3Rpb24gOiBcIm1hbmFnZXIvZ3JvdXBzXCIsXHJcblx0ICAgIG1lbnUgOiAnbWFuYWdlcicsXHJcblx0ICAgIGdldFVybCA6ICcvYWRtaW5fbWFuYWdlci91c2VyX2dyb3Vwc19saXN0LycsXHJcblx0ICAgIGRlbGV0ZVVybCA6ICdhZG1pbl9tYW5hZ2VyL3VzZXJfZ3JvdXBfZGVsZXRlLycsXHJcblx0ICAgIGdldENhbGxCYWNrIDogZnVuY3Rpb24oZGF0YSlcclxuXHQgICAge1xyXG5cdCAgICAgIC8vIHRyYWl0ZW1lbnQgZHUgc3RhdHV0IHV0aWxpc2F0ZXVyIFxyXG5cdCAgICAgIHZhciBpID0gMDtcclxuXHQgICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLml0ZW1zLCBmdW5jdGlvbihpdGVtKXtcclxuXHQgICAgICAgICRzY29wZS5pdGVtc1tpXS5zdGF0dXQgPSBpdGVtLmFjdGl2ZSA9PSAxID8gJ3N1Y2Nlc3MnIDogJ3dhcm5pbmcnOyAgICBcclxuXHQgICAgICAgIGlmIChpdGVtLnN1c3BlbmQgPT0gMSkgJHNjb3BlLml0ZW1zW2ldLnN0YXR1dCA9ICdlcnJvcic7XHJcblx0ICAgICAgICBpKys7XHJcblx0ICAgICAgfSk7XHJcblx0ICAgIH1cclxuXHQgIH1cclxuXHJcbiAgJHNjb3BlLnRhYmxlID0gW1xyXG4gICAgICB7dGl0bGUgOiAnTm9tJywgcGFyYW0gOiAndWdycF9uYW1lJywgc3Ryb25nIDogdHJ1ZX0sXHJcbiAgICBdO1xyXG5cclxuICAkc2NvcGUucGFnZVRpdGxlID0gJ0dyb3VwZXMgZFxcJ3V0aWxpc2F0ZXVycyc7XHJcblxyXG4gICRpbmplY3Rvci5pbnZva2UoSXRlbUxpc3QsIHRoaXMsIHskc2NvcGU6ICRzY29wZSwgJGh0dHA6ICRodHRwLCBjb25maWc6IGNvbmZpZ30pO1x0XHJcbiAgXHJcbn1dKSIsIi8vIG1hbmFnZXIgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8gXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnUGVha3MuTWFuYWdlcicpLmNvbnRyb2xsZXIoJ1VzZXJMaXN0Q3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywnJGluamVjdG9yJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJGluamVjdG9yKXtcclxuICAgIHZhciBjb25maWcgPSB7XHJcbiAgICAgIHNlY3Rpb24gOiBcIm1hbmFnZXIvdXNlcnNcIixcclxuICAgICAgbWVudSA6ICdtYW5hZ2VyJyxcclxuICAgICAgZ2V0VXJsIDogJy9hZG1pbl9tYW5hZ2VyL3VzZXJzX2xpc3QvJyxcclxuICAgICAgZGVsZXRlVXJsIDogJ2FkbWluX21hbmFnZXIvZGVsZXRlX3VzZXIvJyxcclxuICAgICAgZ2V0Q2FsbEJhY2sgOiBmdW5jdGlvbihkYXRhKVxyXG4gICAgICB7XHJcbiAgICAgICAgLy8gdHJhaXRlbWVudCBkdSBzdGF0dXQgdXRpbGlzYXRldXIgXHJcbiAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgJHNjb3BlLml0ZW1zW2ldLnN0YXR1dCA9IGl0ZW0uYWN0aXZlID09IDEgPyAnc3VjY2VzcycgOiAnd2FybmluZyc7ICAgIFxyXG4gICAgICAgICAgaWYgKGl0ZW0uc3VzcGVuZCA9PSAxKSAkc2NvcGUuaXRlbXNbaV0uc3RhdHV0ID0gJ2Vycm9yJztcclxuICAgICAgICAgIGkrKztcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS50YWJsZSA9IFtcclxuICAgICAgICB7dGl0bGU6ICcnLCBwYXJhbSA6ICdzcmMnLCB3aWR0aDogJzYwcHgnfSxcclxuICAgICAgICB7dGl0bGUgOiAnTm9tIGRcXCd1dGlsaXNhdGV1cicsIHBhcmFtIDogJ3VzZXJuYW1lJywgc3Ryb25nIDogdHJ1ZX0sXHJcbiAgICAgICAge3RpdGxlOiAnRW1haWwnLCBwYXJhbSA6ICdlbWFpbCd9LFxyXG4gICAgICBdO1xyXG5cclxuICAgICRzY29wZS5wYWdlVGl0bGUgPSAnVXRpbGlzYXRldXJzJztcclxuXHJcbiAgICAkc2NvcGUudGh1bWJQYXRoID0gJ3VzZXJzJztcclxuXHJcbiAgICAkaW5qZWN0b3IuaW52b2tlKEl0ZW1MaXN0LCB0aGlzLCB7JHNjb3BlOiAkc2NvcGUsICRodHRwOiAkaHR0cCwgY29uZmlnOiBjb25maWd9KTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5NYW5hZ2VyLkRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2FjdGl2YXRpb25NZXNzYWdlJywgZnVuY3Rpb24oKXtcclxuICAvLyBSdW5zIGR1cmluZyBjb21waWxlXHJcbiAgcmV0dXJuIHtcclxuICAgIC8vcmVxdWlyZTogJ25nTW9kZWwnLFxyXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtd2FybmluZyBhbGVydC1kaXNtaXNzYWJsZVwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgY2xhc3M9XCJjbG9zZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L2J1dHRvbj5DZSBjb21wdGUgblxcJ2VzdCBwYXMgZW5jb3JlIGFjdGl2w6kuIDxhIGhyZWY9XCJqYXZhc2NyaXB0OnZvaWQoMClcIiBuZy1jbGljaz1cImFjdGl2YXRlVXNlcigpXCI+Rm9yY2VyIGxcXCdhY3RpdmF0aW9uPC9hPjwvZGl2PicsXHJcbiAgICAvLyBuYW1lOiAnJyxcclxuICAgIC8vIHByaW9yaXR5OiAxLFxyXG4gICAgLy8gdGVybWluYWw6IHRydWUsXHJcbiAgICAvLyBzY29wZToge30sIC8vIHt9ID0gaXNvbGF0ZSwgdHJ1ZSA9IGNoaWxkLCBmYWxzZS91bmRlZmluZWQgPSBubyBjaGFuZ2VcclxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRyYW5zY2x1ZGUsICRodHRwKSB7XHJcbiAgICAgICRzY29wZS5hY3RpdmF0ZVVzZXIgPSBmdW5jdGlvbigpXHJcbiAgICAgIHtcclxuICAgICAgICAkc2NvcGUuYWxlcnQgPSBcIkFjdGl2YXRpb27igKZcIjtcclxuICAgICAgICBzaG93QWxlcnQoKTtcclxuXHJcbiAgICAgICAgICAkaHR0cCh7XHJcbiAgICAgICAgICAgIHVybDogJy9hZG1pbl9tYW5hZ2VyL2FjdGl2YXRlX3VzZXIvJyArICRzY29wZS5pdGVtLnVzZXJfaWQsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0ID0gZGF0YS5tZXNzYWdlO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLml0ZW0uYWN0aXZlID0gMTtcclxuICAgICAgICAgICAgICAgIHNob3dGYWRlQWxlcnQoKTsgXHJcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0ID0gJ1VuZSBlcnJldXJlIGVzdCBzdXJ2ZW51ZS4nO1xyXG4gICAgICAgICAgICAgICAgc2hvd0ZhZGVBbGVydCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8gcmVxdWlyZTogJ25nTW9kZWwnLCAvLyBBcnJheSA9IG11bHRpcGxlIHJlcXVpcmVzLCA/ID0gb3B0aW9uYWwsIF4gPSBjaGVjayBwYXJlbnQgZWxlbWVudHNcclxuICAgIC8vIHJlc3RyaWN0OiAnQScsIC8vIEUgPSBFbGVtZW50LCBBID0gQXR0cmlidXRlLCBDID0gQ2xhc3MsIE0gPSBDb21tZW50XHJcbiAgICAvLyB0ZW1wbGF0ZTogJycsXHJcbiAgICAvLyB0ZW1wbGF0ZVVybDogJycsXHJcbiAgICAvLyByZXBsYWNlOiB0cnVlLFxyXG4gICAgLy8gdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgIC8vIGNvbXBpbGU6IGZ1bmN0aW9uKHRFbGVtZW50LCB0QXR0cnMsIGZ1bmN0aW9uIHRyYW5zY2x1ZGUoZnVuY3Rpb24oc2NvcGUsIGNsb25lTGlua2luZ0ZuKXsgcmV0dXJuIGZ1bmN0aW9uIGxpbmtpbmcoc2NvcGUsIGVsbSwgYXR0cnMpe319KSksXHJcbiAgICAvLyBsaW5rOiBmdW5jdGlvbigkc2NvcGUsIGlFbG0sIGlBdHRycywgY29udHJvbGxlcikge1xyXG4gICAgICBcclxuICAgIC8vIH1cclxuICB9O1xyXG59KTsiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuTWFuYWdlci5EaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdjb250YWN0SW5mb3MnLCBmdW5jdGlvbigpe1xyXG4gIC8vIFJ1bnMgZHVyaW5nIGNvbXBpbGVcclxuICByZXR1cm4ge1xyXG4gICAgLy9yZXF1aXJlOiAnbmdNb2RlbCcsXHJcbiAgICAvL3RlbXBsYXRlOiAndGVzdCB1cGxvYWQnLFxyXG4gICAgLy8gbmFtZTogJycsXHJcbiAgICAvLyBwcmlvcml0eTogMSxcclxuICAgIC8vIHRlcm1pbmFsOiB0cnVlLFxyXG4gICAgLy8gc2NvcGU6IHtcclxuICAgIC8vICAgICB3IDogJz13JyxcclxuICAgIC8vICAgICBoIDogJz1oJyxcclxuICAgIC8vIH0sIC8vIHt9ID0gaXNvbGF0ZSwgdHJ1ZSA9IGNoaWxkLCBmYWxzZS91bmRlZmluZWQgPSBubyBjaGFuZ2VcclxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycywgJHRyYW5zY2x1ZGUsICRodHRwKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gZ2VzdGlvbiBkZXMgaW5mb3MgY29udGFjdFxyXG5cclxuICAgICAgICB2YXIgaWQgPSAkc2NvcGUuaXRlbS51c2VyX2lkO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRDb250YWN0SW5mb3MgKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAkaHR0cC5nZXQoJy9hZG1pbl9jb250YWN0L2dldF9jb250YWN0X2luZm8vJytpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbihlbGVtZW50KXtcclxuICAgICAgICAgICAgICAgIGRhdGFbaV0ud2VpZ2h0ID0gcGFyc2VJbnQoZGF0YVtpXS53ZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgZGF0YVtpXS5pZCA9IHBhcnNlSW50KGRhdGFbaV0uaWQpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICRzY29wZS5jb250YWN0SXRlbXMgPSBkYXRhO1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAgJHNjb3BlLnNvcnRhYmxlT3B0aW9ucyA9IHtcclxuICAgICAgICAgIHN0b3A6IGZ1bmN0aW9uKGUsIHVpKSB7IFxyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuY29udGFjdEl0ZW1zLCBmdW5jdGlvbiggaXRlbSApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChpICE9IGl0ZW0ud2VpZ2h0IClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgJHNjb3BlLmNvbnRhY3RJdGVtc1tpXS53ZWlnaHQgPSBpO1xyXG4gICAgICAgICAgICAgICAgICB1cGRhdGVJdGVtKCRzY29wZS5jb250YWN0SXRlbXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGF4aXM6ICd5JyxcclxuICAgICAgICAgIHBsYWNlaG9sZGVyOiBcImJlaW5nRHJhZ2dlZFwiLFxyXG4gICAgICAgICAgdG9sZXJhbmNlOiAncG9pbnRlcicsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgIFxyXG4gICAgICAgICRzY29wZS5hZGRDb250YWN0SW5mbyA9IGZ1bmN0aW9uKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAkc2NvcGUubmV3Q29udGFjdEluZm8ucGFyZW50X2lkID0gaWQ7XHJcbiAgICAgICAgICAkc2NvcGUubmV3Q29udGFjdEluZm8ud2VpZ2h0ID0gJHNjb3BlLmNvbnRhY3RJdGVtcy5sZW5ndGg7XHJcbiAgICAgICAgICAkaHR0cCh7XHJcbiAgICAgICAgICAgICAgICAgIHVybDogJy9hZG1pbl9jb250YWN0L2NyZWF0ZV9jb250YWN0X2luZm8nLFxyXG4gICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICAgICAgICBkYXRhOiAkc2NvcGUubmV3Q29udGFjdEluZm8sXHJcbiAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAgICRzY29wZS5jb250YWN0SXRlbXMucHVzaCh7aWQ6ZGF0YS5pZCwgbmFtZTogZGF0YS5uYW1lLCB2YWx1ZTpkYXRhLnZhbHVlLCB0YXJnZXQ6ZGF0YS50YXJnZXQsIGljb246ZGF0YS5pY29uLCB3ZWlnaHQ6ZGF0YS53ZWlnaHR9KTtcclxuICAgICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSAnVW5lIGVycmV1cmUgZXN0IHN1cnZlbnVlLic7XHJcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICAgICAgfSk7IFxyXG5cclxuICAgICAgICAgICRzY29wZS5uZXdDb250YWN0SW5mbyA9IG51bGw7XHJcbiAgICAgICAgICAkc2NvcGUuZWRpdE1vZGVPcGVuID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuc3dpdGNoRWRpdE1vZGUgPSBmdW5jdGlvbihvYmplY3QpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJHNjb3BlLmVkaXRNb2RlID0gdHJ1ZTtcclxuICAgICAgICAgICRzY29wZS5lZGl0ZWRJdGVtID0gb2JqZWN0O1xyXG4gICAgICAgICAgJCgnI2VkaXQtZnJvbS1hbmNob3InKS5zY3JvbGxUbygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLnVwZGF0ZUNvbnRhY3RJbmZvID0gZnVuY3Rpb24ob2JqZWN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICRodHRwKFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW5fY29udGFjdC9lZGl0X2NvbnRhY3RfaW5mbycsXHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUuZWRpdGVkSXRlbSxcclxuICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLmNvbnRhY3RJdGVtcywgZnVuY3Rpb24oaXRlbSl7XHJcbiAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09ICRzY29wZS5lZGl0ZWRJdGVtLmlkKSB7JHNjb3BlLmNvbnRhY3RJdGVtc1tpXSA9ICRzY29wZS5lZGl0ZWRJdGVtfTtcclxuICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkc2NvcGUuZWRpdE1vZGUgPSBmYWxzZTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkc2NvcGUuZGVsZXRlQ29udGFjdEluZm8gPSBmdW5jdGlvbigpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW5fY29udGFjdC9kZWxldGVfY29udGFjdF9pbmZvJyxcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5lZGl0ZWRJdGVtLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5lcnJvciA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSBkYXRhLm1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRlbXAgPSBbXSxcclxuICAgICAgICAgICAgICAgIGkgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuY29udGFjdEl0ZW1zLCBmdW5jdGlvbihpdGVtKSB7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgICAgaWYgKCBpdGVtLndlaWdodCA+ICRzY29wZS5lZGl0ZWRJdGVtLndlaWdodCApXHJcbiAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLndlaWdodCA9IGl0ZW0ud2VpZ2h0IC0gMTtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVJdGVtKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgIGlmICggaXRlbS5pZCAhPSAkc2NvcGUuZWRpdGVkSXRlbS5pZCApIHRlbXAucHVzaChpdGVtKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jb250YWN0SXRlbXMgPSB0ZW1wO1xyXG5cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVJdGVtKG9iamVjdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkaHR0cChcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdXJsOiAnL2FkbWluX2NvbnRhY3QvZWRpdF9jb250YWN0X2luZm8nLFxyXG4gICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgICAgZGF0YTogb2JqZWN0LFxyXG4gICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHNjb3BlLnJlb3JkZXIgPSBmdW5jdGlvbihvYmplY3QsIHNlbnMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdmFyIGN1cnJlbnRXZWlnaHQgPSBvYmplY3Qud2VpZ2h0LFxyXG4gICAgICAgICAgICAgIG5ld1dlaWdodCxcclxuICAgICAgICAgICAgICBpPTAsXHJcbiAgICAgICAgICAgICAgbW9kaWZpZWQgPSAwO1xyXG5cclxuICAgICAgICAgIGZ1bmN0aW9uIHNldE1pbnVzKClcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5jb250YWN0SXRlbXMsIGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgICAgICAgIGlmIChpdGVtLndlaWdodCA9PT0gY3VycmVudFdlaWdodCsxKSB7ICRzY29wZS5jb250YWN0SXRlbXNbaV0ud2VpZ2h0ID0gY3VycmVudFdlaWdodDsgbW9kaWZpZWQgPSAxfTtcclxuICAgICAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gb2JqZWN0LmlkKSB7ICRzY29wZS5jb250YWN0SXRlbXNbaV0ud2VpZ2h0ID0gY3VycmVudFdlaWdodCsxOyBtb2RpZmllZCA9IDF9O1xyXG4gICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICBpZiAobW9kaWZpZWQgPT09IDEpIHt1cGRhdGVJdGVtKGl0ZW0pfTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gc2V0UGx1cygpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuY29udGFjdEl0ZW1zLCBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICBpZiAoaXRlbS53ZWlnaHQgPT09IGN1cnJlbnRXZWlnaHQtMSkgeyAkc2NvcGUuY29udGFjdEl0ZW1zW2ldLndlaWdodCA9IGN1cnJlbnRXZWlnaHQ7IG1vZGlmaWVkID0gMX07XHJcbiAgICAgICAgICAgICAgaWYgKGl0ZW0uaWQgPT09IG9iamVjdC5pZCkgeyAkc2NvcGUuY29udGFjdEl0ZW1zW2ldLndlaWdodCA9IGN1cnJlbnRXZWlnaHQtMTsgbW9kaWZpZWQgPSAxfTtcclxuICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgICAgaWYgKG1vZGlmaWVkID09PSAxKSB7dXBkYXRlSXRlbShpdGVtKX07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHNlbnMgPT0gJ3BsdXMnID8gc2V0TWludXMoKSA6IHNldFBsdXMoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZ2V0Q29udGFjdEluZm9zKCk7XHJcblxyXG4gICAgfSxcclxuICAgIC8vIHJlcXVpcmU6ICduZ01vZGVsJywgLy8gQXJyYXkgPSBtdWx0aXBsZSByZXF1aXJlcywgPyA9IG9wdGlvbmFsLCBeID0gY2hlY2sgcGFyZW50IGVsZW1lbnRzXHJcbiAgICAvLyByZXN0cmljdDogJ0EnLCAvLyBFID0gRWxlbWVudCwgQSA9IEF0dHJpYnV0ZSwgQyA9IENsYXNzLCBNID0gQ29tbWVudFxyXG4gICAgLy8gdGVtcGxhdGU6ICcnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcvYWRtaW4vdmlld19sb2FkZXIvJyt0ZW1wbGF0ZURpcisnL21hbmFnZXIvd2lkZ2V0cy9jb250YWN0X2luZm9zJyxcclxuICAgIC8vIHJlcGxhY2U6IHRydWUsXHJcbiAgICAvLyB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgLy8gY29tcGlsZTogZnVuY3Rpb24odEVsZW1lbnQsIHRBdHRycywgZnVuY3Rpb24gdHJhbnNjbHVkZShmdW5jdGlvbihzY29wZSwgY2xvbmVMaW5raW5nRm4peyByZXR1cm4gZnVuY3Rpb24gbGlua2luZyhzY29wZSwgZWxtLCBhdHRycyl7fX0pKSxcclxuICAgIC8vIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgaUVsbSwgaUF0dHJzLCBjb250cm9sbGVyKSB7XHJcbiAgICAgIFxyXG4gICAgLy8gfVxyXG4gIH07XHJcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5NYW5hZ2VyLkRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3NlcnZlVXNhZ2UnLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cdC8vIFJ1bnMgZHVyaW5nIGNvbXBpbGVcclxuXHRyZXR1cm4ge1xyXG5cdFx0Ly8gbmFtZTogJycsXHJcblx0XHQvLyBwcmlvcml0eTogMSxcclxuXHRcdC8vIHRlcm1pbmFsOiB0cnVlLFxyXG5cdFx0c2NvcGU6IHt9LCAvLyB7fSA9IGlzb2xhdGUsIHRydWUgPSBjaGlsZCwgZmFsc2UvdW5kZWZpbmVkID0gbm8gY2hhbmdlXHJcblx0XHQvLyBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0cmFuc2NsdWRlKSB7fSxcclxuXHRcdC8vIHJlcXVpcmU6ICduZ01vZGVsJywgLy8gQXJyYXkgPSBtdWx0aXBsZSByZXF1aXJlcywgPyA9IG9wdGlvbmFsLCBeID0gY2hlY2sgcGFyZW50IGVsZW1lbnRzXHJcblx0XHQvLyByZXN0cmljdDogJ0EnLCAvLyBFID0gRWxlbWVudCwgQSA9IEF0dHJpYnV0ZSwgQyA9IENsYXNzLCBNID0gQ29tbWVudFxyXG5cdFx0dGVtcGxhdGU6ICc8ZGl2IGdvb2dsZS1jaGFydCBjaGFydD1cImNoYXJ0XCIgc3R5bGU9XCJ7e2NoYXJ0LmNzc1N0eWxlfX1cIiBvbi1yZWFkeT1cImNoYXJ0UmVhZHkoKVwiLz4nLFxyXG5cdFx0Ly8gdGVtcGxhdGVVcmw6ICcnLFxyXG5cdFx0Ly8gcmVwbGFjZTogdHJ1ZSxcclxuXHRcdC8vIHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHQvLyBjb21waWxlOiBmdW5jdGlvbih0RWxlbWVudCwgdEF0dHJzLCBmdW5jdGlvbiB0cmFuc2NsdWRlKGZ1bmN0aW9uKHNjb3BlLCBjbG9uZUxpbmtpbmdGbil7IHJldHVybiBmdW5jdGlvbiBsaW5raW5nKHNjb3BlLCBlbG0sIGF0dHJzKXt9fSkpLFxyXG5cdFx0bGluazogZnVuY3Rpb24oJHNjb3BlLCBpRWxtLCBpQXR0cnMsIGNvbnRyb2xsZXIpIHtcclxuXHRcdFx0XHJcblx0XHRcdGZ1bmN0aW9uIHNlcnZlclVzYWdlUGllKGFwcFNpemUsIGFzc2V0c1NpemUsIGNhY2hlU2l6ZSwgdG90YWwpXHJcblx0XHRcdHtcclxuXHJcblxyXG5cdFx0XHRcdHZhciBjaGFydDEgPSB7fTtcclxuXHRcdFx0ICAgIGNoYXJ0MS50eXBlID0gXCJQaWVDaGFydFwiO1xyXG5cdFx0XHQgICAgY2hhcnQxLmRpc3BsYXllZCA9IGZhbHNlO1xyXG5cdFx0XHQgICAgY2hhcnQxLmNzc1N0eWxlID0gXCJoZWlnaHQ6MjAwcHg7IHdpZHRoOjEwMCU7XCI7XHJcblx0XHRcdCAgICBjaGFydDEuZGF0YSA9IHtcImNvbHNcIjogW1xyXG5cdFx0XHQgICAgICAgIHtpZDogXCJkaXNrXCIsIGxhYmVsOiBcIkRpc3F1ZVwiLCB0eXBlOiBcInN0cmluZ1wifSxcclxuXHRcdFx0ICAgICAgICB7aWQ6IFwiZGF0YWJhc2VcIiwgbGFiZWw6IFwiQmFzZSBkZSBkb25uw6llXCIsIHR5cGU6IFwibnVtYmVyXCJ9XHJcblx0XHRcdCAgICBdLCBcInJvd3NcIjogW1xyXG5cdFx0XHQgICAgICAgIHtjOiBbXHJcblx0XHRcdCAgICAgICAgICAgIHt2OiBcIkFwcGxpY2F0aW9uXCJ9LFxyXG5cdFx0XHQgICAgICAgICAgICB7djogYXBwU2l6ZSwgZjogYXBwU2l6ZS8xMDAwMDAwK1wiIE1vXCJ9XHJcblx0XHRcdCAgICAgICAgXX0sXHJcblx0XHRcdCAgICAgICAge2M6IFtcclxuXHRcdFx0ICAgICAgICAgICAge3Y6IFwiRG9ubsOpZXNcIn0sXHJcblx0XHRcdCAgICAgICAgICAgIHt2OiBhc3NldHNTaXplLCBmOiBhc3NldHNTaXplLzEwMDAwMDArXCIgTW9cIn1cclxuXHRcdFx0ICAgICAgICBdfSxcclxuXHRcdFx0ICAgICAgICB7YzogW1xyXG5cdFx0XHQgICAgICAgICAgICB7djogXCJDYWNoZVwifSxcclxuXHRcdFx0ICAgICAgICAgICAge3Y6IGNhY2hlU2l6ZSwgZjogY2FjaGVTaXplLzEwMDAwMDArXCIgTW9cIn1cclxuXHRcdFx0ICAgICAgICBdfSxcclxuXHRcdFx0ICAgICAgICB7YzogW1xyXG5cdFx0XHQgICAgICAgICAgICB7djogXCJMaWJyZVwifSxcclxuXHRcdFx0ICAgICAgICAgICAge3Y6IHRvdGFsIC0gYXBwU2l6ZSAtIGFzc2V0c1NpemUgLSBjYWNoZVNpemUgLCBmOiAoIHRvdGFsIC0gYXBwU2l6ZSAtIGFzc2V0c1NpemUgLSBjYWNoZVNpemUgKSAvMTAwMDAwMCArXCIgTW8gc3VyIFwiICsgdG90YWwvMTAwMDAwMCtcIiBNb1wifVxyXG5cdFx0XHQgICAgICAgIF19XHJcblx0XHRcdCAgICBdfTtcclxuXHJcblx0XHRcdCAgICBjaGFydDEub3B0aW9ucyA9IHtcclxuXHRcdFx0ICAgICAgICBcInRpdGxlXCI6IFwiVXRpbGlzYXRpb24gZHUgc2VydmV1clwiLFxyXG5cdFx0XHQgICAgICAgIFwiaXNTdGFja2VkXCI6IFwidHJ1ZVwiLFxyXG5cdFx0XHQgICAgICAgIFwiZmlsbFwiOiAyMCxcclxuXHRcdFx0ICAgICAgICBcInBpZUhvbGVcIjogMC4zLFxyXG5cdFx0XHQgICAgICAgIFwicGllU2xpY2VUZXh0XCI6ICdub25lJyxcclxuXHRcdFx0ICAgICAgICBcImFuaW1hdGlvblwiOntcclxuXHRcdFx0XHQgICAgICAgIGR1cmF0aW9uOiAxMDAwLFxyXG5cdFx0XHRcdCAgICAgICAgZWFzaW5nOiAnb3V0JyxcclxuXHRcdFx0XHQgICAgICB9LFxyXG5cdFx0XHQgICAgICAgIFwiZGlzcGxheUV4YWN0VmFsdWVzXCI6IHRydWUsXHJcblx0XHRcdCAgICAgICAgc2xpY2VzOiB7XHJcblx0XHRcdCAgICAgICAgICAgIDA6IHsgY29sb3I6ICcjN0ZGRjAwJyB9LFxyXG5cdFx0XHQgICAgICAgICAgICAxOiB7IGNvbG9yOiAnIzlkMjYxZCcgfSxcclxuXHRcdFx0ICAgICAgICAgICAgMjogeyBjb2xvcjogJyMxYTFhMWEnIH0sXHJcblx0XHRcdCAgICAgICAgICAgIDM6IHsgY29sb3I6ICcjZWVlJyB9XHJcblx0XHRcdCAgICAgICAgICB9XHJcblx0XHRcdCAgICB9O1xyXG5cclxuXHRcdFx0ICAgIGNoYXJ0MS5mb3JtYXR0ZXJzID0ge307XHJcblxyXG5cdFx0XHQgICAgJHNjb3BlLmNoYXJ0ID0gY2hhcnQxO1xyXG5cclxuXHJcblx0XHRcdCAgICAkc2NvcGUuY2hhcnRSZWFkeSA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ICAgICAgICBmaXhHb29nbGVDaGFydHNCYXJzQm9vdHN0cmFwKCk7XHJcblx0XHRcdCAgICB9XHJcblxyXG5cdFx0XHQgICAgZnVuY3Rpb24gZml4R29vZ2xlQ2hhcnRzQmFyc0Jvb3RzdHJhcCgpIHtcclxuXHRcdFx0ICAgICAgICAvLyBHb29nbGUgY2hhcnRzIHVzZXMgPGltZyBoZWlnaHQ9XCIxMnB4XCI+LCB3aGljaCBpcyBpbmNvbXBhdGlibGUgd2l0aCBUd2l0dGVyXHJcblx0XHRcdCAgICAgICAgLy8gKiBib290c3RyYXAgaW4gcmVzcG9uc2l2ZSBtb2RlLCB3aGljaCBpbnNlcnRzIGEgY3NzIHJ1bGUgZm9yOiBpbWcgeyBoZWlnaHQ6IGF1dG87IH0uXHJcblx0XHRcdCAgICAgICAgLy8gKlxyXG5cdFx0XHQgICAgICAgIC8vICogVGhlIGZpeCBpcyB0byB1c2UgaW5saW5lIHN0eWxlIHdpZHRoIGF0dHJpYnV0ZXMsIGllIDxpbWcgc3R5bGU9XCJoZWlnaHQ6IDEycHg7XCI+LlxyXG5cdFx0XHQgICAgICAgIC8vICogQlVUIHdlIGNhbid0IGNoYW5nZSB0aGUgd2F5IEdvb2dsZSBDaGFydHMgcmVuZGVycyBpdHMgYmFycy4gTm9yIGNhbiB3ZSBjaGFuZ2VcclxuXHRcdFx0ICAgICAgICAvLyAqIHRoZSBUd2l0dGVyIGJvb3RzdHJhcCBDU1MgYW5kIHJlbWFpbiBmdXR1cmUgcHJvb2YuXHJcblx0XHRcdCAgICAgICAgLy8gKlxyXG5cdFx0XHQgICAgICAgIC8vICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBjYW4gYmUgY2FsbGVkIGFmdGVyIGEgR29vZ2xlIGNoYXJ0cyByZW5kZXIgdG8gXCJmaXhcIiB0aGVcclxuXHRcdFx0ICAgICAgICAvLyAqIGlzc3VlIGJ5IHNldHRpbmcgdGhlIHN0eWxlIGF0dHJpYnV0ZXMgZHluYW1pY2FsbHkuXHJcblxyXG5cdFx0XHQgICAgICAgICQoXCIuZ29vZ2xlLXZpc3VhbGl6YXRpb24tdGFibGUtdGFibGUgaW1nW3dpZHRoXVwiKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgaW1nKSB7XHJcblx0XHRcdCAgICAgICAgICAgICQoaW1nKS5jc3MoXCJ3aWR0aFwiLCAkKGltZykuYXR0cihcIndpZHRoXCIpKS5jc3MoXCJoZWlnaHRcIiwgJChpbWcpLmF0dHIoXCJoZWlnaHRcIikpO1xyXG5cdFx0XHQgICAgICAgIH0pO1xyXG5cdFx0XHQgICAgfTtcclxuXHRcdFx0fSBcclxuXHJcblx0XHRcdCRodHRwLmdldCgnL2FkbWluX21hbmFnZXIvc2VydmVyX2NoYXJnZScpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cdFx0XHQgICAgICBzZXJ2ZXJVc2FnZVBpZShwYXJzZUludChkYXRhLmFwcFNpemUpLCBwYXJzZUludChkYXRhLmFzc2V0c1NpemUpLCBwYXJzZUludChkYXRhLmNhY2hlU2l6ZSksIHBhcnNlSW50KGRhdGEuc2VydmVyU2l6ZSkpO1xyXG5cdFx0XHQgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHRcdFx0IH0pO1xyXG5cclxuXHRcdH1cclxuXHR9O1xyXG59XSk7IiwiXHJcbmFuZ3VsYXIubW9kdWxlKCdQZWFrcy5NYW5hZ2VyLkRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ21hbmFnZXJVc2VySW5mb3MnLCBbJ1VzZXJzUmVwb3NpdG9yeScsIGZ1bmN0aW9uKHVzZXJzUmVwb3NpdG9yeSl7XHJcblx0Ly8gUnVucyBkdXJpbmcgY29tcGlsZVxyXG5cdHJldHVybiB7XHJcblx0XHQvLyBuYW1lOiAnJyxcclxuXHRcdC8vIHByaW9yaXR5OiAxLFxyXG5cdFx0Ly8gdGVybWluYWw6IHRydWUsXHJcblx0XHRzY29wZTogeyB1c2VySWQgOiAnPXVzZXJpZCd9LCAvLyB7fSA9IGlzb2xhdGUsIHRydWUgPSBjaGlsZCwgZmFsc2UvdW5kZWZpbmVkID0gbm8gY2hhbmdlXHJcblx0XHRjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0cmFuc2NsdWRlKSB7XHJcblx0XHRcdHVzZXJzUmVwb3NpdG9yeS51c2VySW5mb3MoJHNjb3BlLnVzZXJJZCwgZnVuY3Rpb24oZGF0YSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQkc2NvcGUudXNlciA9IGRhdGE7XHJcblx0XHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0Ly8gcmVxdWlyZTogJ25nTW9kZWwnLCAvLyBBcnJheSA9IG11bHRpcGxlIHJlcXVpcmVzLCA/ID0gb3B0aW9uYWwsIF4gPSBjaGVjayBwYXJlbnQgZWxlbWVudHNcclxuXHRcdHJlc3RyaWN0OiAnRScsIC8vIEUgPSBFbGVtZW50LCBBID0gQXR0cmlidXRlLCBDID0gQ2xhc3MsIE0gPSBDb21tZW50XHJcblx0XHR0ZW1wbGF0ZTogJzxhIGhyZWY9XCIjL21hbmFnZXIvdXNlcnMve3t1c2VySWR9fVwiID57e3VzZXIuZmlyc3RfbmFtZX19IHt7dXNlci5sYXN0X25hbWV9fTwvYT4nLFxyXG5cdFx0Ly8gdGVtcGxhdGVVcmw6ICcnLFxyXG5cdFx0cmVwbGFjZTogdHJ1ZSxcclxuXHRcdC8vIHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHQvLyBjb21waWxlOiBmdW5jdGlvbih0RWxlbWVudCwgdEF0dHJzLCBmdW5jdGlvbiB0cmFuc2NsdWRlKGZ1bmN0aW9uKHNjb3BlLCBjbG9uZUxpbmtpbmdGbil7IHJldHVybiBmdW5jdGlvbiBsaW5raW5nKHNjb3BlLCBlbG0sIGF0dHJzKXt9fSkpLFxyXG5cdFx0Ly9saW5rOiBmdW5jdGlvbigkc2NvcGUsIGlFbG0sIGlBdHRycywgY29udHJvbGxlcikge31cclxuXHR9O1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLk1hbmFnZXIuUmVwb3NpdG9yaWVzJykuZmFjdG9yeSgnR3JvdXBzUmVwb3NpdG9yeScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcbiAgICB2YXIgdXNlckdyb3Vwc0NhY2hlID0gW107XHJcblxyXG4gICAgcmV0dXJuIHsgXHJcbiAgICAgICAgR2V0R3JvdXBzIDogZnVuY3Rpb24oY2FsbGJhY2spXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWYgKHVzZXJHcm91cHNDYWNoZS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKHVzZXJHcm91cHNDYWNoZSk7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICRodHRwLmdldCgnL2FkbWluX21hbmFnZXIvdXNlcl9ncm91cHNfbGlzdCcpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgIHVzZXJHcm91cHNDYWNoZSA9IGRhdGEuaXRlbXM7IFxyXG4gICAgICAgICAgICBjYWxsYmFjayhkYXRhLml0ZW1zKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgR2V0R3JvdXAgOiBmdW5jdGlvbihpZCwgY2FsbGJhY2spXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fbWFuYWdlci91c2VyX2dyb3VwX2RldGFpbHMvJyArIGlkKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGRhdGEudWdycF9hZG1pbiA9IGRhdGEudWdycF9hZG1pbiA9PSAxO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgU2F2ZUdyb3VwIDogZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICAgIHVybDogJy9hZG1pbl9tYW5hZ2VyL3VzZXJfZ3JvdXBfZWRpdCcsXHJcbiAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgICBhbGVydCA9ICdVbmUgZXJyZXVyZSBlc3Qgc3VydmVudWUuJztcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIERlbGV0ZUdyb3VwIDogZnVuY3Rpb24oaWQsIGNhbGxiYWNrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICRodHRwLmdldCgnL2FkbWluX21hbmFnZXIvdXNlcl9ncm91cF9kZWxldGUvJyArIGlkKS5zdWNjZXNzKGZ1bmN0aW9uKClcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICB9OyBcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5NYW5hZ2VyLlJlcG9zaXRvcmllcycpLmZhY3RvcnkoJ1VzZXJzUmVwb3NpdG9yeScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG5cdHZhciB1c2VySW5mb3NDYWNoZSA9IG5ldyBBcnJheSgpO1xyXG5cclxuICBcdHJldHVybiB7IFxyXG4gICAgICAgICAgIHVzZXJJbmZvczogZnVuY3Rpb24gKGlkLCBjYWxsYmFjaykgeyBcclxuICAgICAgICAgICBcdFx0Ly8gb24gcmVnYXJkZSBzaSBsZSBjYWNoZSBleGlzdGVcclxuICAgICAgICAgICBcdFx0aWYgKHVzZXJJbmZvc0NhY2hlWyd1c2VyXycgKyBpZF0pIHtcclxuICAgICAgICAgICBcdFx0XHQvLyBvbiByZW5kIGwnb2JqZWN0XHJcbiAgICAgICAgICAgXHRcdFx0Y2FsbGJhY2sodXNlckluZm9zQ2FjaGVbJ3VzZXJfJyArIGlkXSk7XHJcbiAgICAgICAgICAgXHRcdH1cclxuICAgICAgICAgICBcdFx0ZWxzZVxyXG4gICAgICAgICAgIFx0XHR7XHJcbiAgICAgICAgICAgXHRcdFx0Ly8gc2lub24gb24gcsOpY3Vww6hyZSBsJ2luZm9cclxuICAgICAgICAgICBcdFx0XHQkaHR0cC5nZXQoJy9hZG1pbl9tYW5hZ2VyL3VzZXJfaW5mb3MvJytpZClcclxuXHRcdFx0XHQgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuXHRcdFx0XHQgICAge1xyXG5cdFx0XHRcdCAgICBcdC8vIG9uIHN0b2NrZSBsJ3V0aWxpc2F0ZXVyXHJcblx0XHRcdFx0ICAgIFx0dXNlckluZm9zQ2FjaGVbJ3VzZXJfJyArIGlkXSA9IGRhdGE7XHJcblx0XHRcdFx0ICAgIFx0Ly8gb24gdHJhaXRlIGxlIGNhbGxiYWNrXHJcblx0XHRcdFx0ICAgIFx0Y2FsbGJhY2sgKGRhdGEpO1xyXG5cdFx0XHRcdCAgICB9KTtcclxuICAgICAgICAgICBcdFx0fVxyXG4gICAgICAgICAgIH0gXHJcbiAgICAgfTsgXHJcbn1dKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=