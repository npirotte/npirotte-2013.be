function MenusListCtrl($scope, $http, $injector)
{

  var config = {
    section : "pages/menus",
    menu : 'pages',
    getUrl : '/admin_menus/menus_list/',
    deleteUrl : 'admin_menus/menu_delete/',
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
      {title : 'Nom', param : 'name', strong : true}
    ];

  $scope.pageTitle = 'Utilisateurs';

  $scope.thumbPath = 'users';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}

function MenuEditCtrl($scope, $routeParams, menusMenusRepository) 
{
  menuControl('pages');
  $scope.backUrl = "pages/menus";

  var id = $routeParams.id
  $scope.mode = id;

  var getThePage = function(getTheChilds)
  {
    menusMenusRepository.GetItem(id, function(data)
    {
      $scope.item = data;
      init_page();

      if (getTheChilds) {

      };
    });
  }

  $scope.save = function(returnToList)
  {
    $scope.alert = 'Sauvegarde';
    showAlert();

    menusMenusRepository.SaveItem($scope.item, function(data)
    {

      if (returnToList && data.errors.length === 0) {
        window.location.hash = $scope.backUrl;
      }
      else if (id == 'new' && data.errors.length === 0)
      {
        window.location.hash = $scope.backUrl + '/edit/' + data.id;
      }
      else
      {
        $scope.alert = data.message;
        $scope.errors = data.errors;
        if(data.errors.length === 0) getThePage();
      }

      showFadeAlert();
    });
  }

  $scope.delete = function()
  {
    menusMenusRepository.DeleteItem(id, function(data)
      {
        window.location.hash = $scope.backUrl;
      });
  }


  if (id === 'new') {
    $scope.item = {
      name : '',
      cssclass : ''
    }
    init_page();
  }
  else
  {
    getThePage();
  }
}


admin.directive('menusItemsPanel', ['menusItemsRepository', 'UrlService', function(menusItemsRepository, urlService){
  // Runs during compile
  return {
    // name: '',
    // priority: 1,
    // terminal: true,
    scope: { menuId : '=menuId'}, // {} = isolate, true = child, false/undefined = no change
    controller: function($scope, $element, $attrs, $transclude) {

      var runing = false;

      $scope.urlOptions = [];

      function getItem(id)
      {
        menusItemsRepository.GetItem(id, function(data)
        {
          data.target = data.target == 1 ? true : false;
          $scope.item = data;
        })
      }

      $scope.getItem = function(id) { getItem(id) };

      function resetItem(parentId)
      {
        $scope.item = {
          menu_id : $scope.menuId,
          parent_id : parentId ? parentId : null
        }

        $scope.urlOptions = [];

        $scope.itemForm.$setPristine();
      }

      function getItemList()
      {
        menusItemsRepository.GetItemsTree($scope.menuId, function(data)
        {
          $scope.itemsTree = data;
        });
      }

      getItemList();

      $scope.resetItem = function() { resetItem() };
      
      $scope.save = function(endEdit)
      {
        if(runing) return false;

        runing = true;
        if (!$scope.item.menu_id) {
          $scope.item.menu_id = $scope.menuId;
        };
        console.log('run');
        menusItemsRepository.SaveItem($scope.item, function(data)
        {
          runing = false;
          if (data.errors.length === 0) {
            endEdit ? resetItem() : getItem(data.id);
            getItemList();
          };
        });
      }

      $scope.newSubItem = function(parentId)
      {
        resetItem(parentId);
      }

      $scope.deleteItem = function(id, reset)
      {
        bootbox.confirm('Etes vous sur de vouloir supprimer cet élément ?', function(invoke)
        {
          if (invoke) 
          {
            menusItemsRepository.DeleteItem(id, function()
            {
              getItemList();
              if (reset) resetItem();
            });
          }
        });
      }

      $scope.$watch('item.module', function(newValue)
      {
        $scope.urlOptions.UrlFunctions = urlService.GetFunctions(newValue);
        /*if ($scope.item) {
          $scope.item.function = $scope.item.module === 'pages' ? 'page' : null;
        };*/
      });

      $scope.$watch('item.function', function(newValue)
      {
        if ($scope.item) {
          urlService.GetElements($scope.item.module, newValue, function(data)
          {
            console.log(data);
            $scope.urlOptions.UrlElements = data;
          });
        };
      });

      $scope.treeOptions = {
        dropped: function(event) {
            var data = {},
              parentChildsList;

            try 
            {
              data.parent_id = event.dest.nodesScope.$nodeScope.$modelValue.id;
            }
            catch(e)
            {
              data.parent_id = 0;
            }

            try 
            {
              data.old_parent_id = event.source.nodesScope.$nodeScope.$modelValue.id;
            }
            catch(e)
            {
              data.old_parent_id = 0;
            }

            data.new_index = event.dest.index;

            parentChildsList = event.dest.nodesScope.$modelValue;
            data.id = parentChildsList[data.new_index].id;
            data.manu_id = $scope.menuId;

            if (event.source.index != data.new_index || data.parent_id != data.old_parent_id) {

              menusItemsRepository.ReorderItem(data, function()
              {
              });

            };

            return true;
        },
      }
    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    //template: '<a href="#manager/comptes/edit/{{userId}}" >{{user.first_name}} {{user.last_name}}</a>',
    templateUrl: '/admin/view_loader/desktop/menus/items/edit',
    replace: false,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    //link: function($scope, iElm, iAttrs, controller) {}
  };
}]);