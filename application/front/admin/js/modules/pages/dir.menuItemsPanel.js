angular.module('Peaks.Pages.Directives').directive('menusItemsPanel', ['MenusItemsRepository', 'UrlService', function(menusItemsRepository, urlService){
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
        menusItemsRepository.GetItems($scope.menuId).then(function(result)
        {
          $scope.itemsList = result.data.items;
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
            data.menu_id = $scope.menuId;

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