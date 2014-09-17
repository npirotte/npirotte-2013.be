// module de menu restaurant


function CarteCategoriesListCtrl($scope, $http, $injector)
{

  var config = {
    section : "carte",
    menu : 'carte',
    getUrl : '/admin_carte/categories_list/',
    deleteUrl : 'admin_carte/category_delete',
  }

  $scope.table = [
      {title : 'Nom', param : 'name'},
      {title: 'Nbr de plats', param : 'childs_count'}
    ];

  $scope.pageTitle = 'Catégories de news';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}

function CarteCategorieEditCtrl($scope, $http, $routeParams)
{
  $scope.section = "carte/edit";
    menuControl('carte');

    var id = $routeParams.id;
  $scope.mode =  id;

  var getThePage = function(){
      $http.get('/admin_carte/category_details/'+id).success(function(data) {
        $scope.item = data.items[0];        
        console.log(data);
        init_page();
      });
   };

  if (id == 'new') 
  {
    init_page();
  } 
  else 
  {
    getThePage();
  }

  $scope.delete = function()
  {
    if (confirm('Supprimer cette catégories et tout ses éléments ?')) {
      $http.get('/admin_carte/category_delete/'+id).success(function(data) {
          window.location.hash = '/carte/list';
      });
    };
  }

    $scope.save = function()
    {
      $http({
            url: '/admin_carte/category_edit',
            method: "POST",
            data: $scope.item,
            headers: {'Content-Type': 'application/json'}
        })
      .success(function (data, status, headers, config) {
          console.log(data);

          if (id == 'new') {
            window.location.hash = '/carte/edit/' + data.id;
          }
          else
          {
            $scope.alert = 'Modification enregistrées !';
                  showFadeAlert();
          }
                
            })
      .error(function (data, status, headers, config) {
                $scope.alert = 'Une erreure est survenue.';
                showFadeAlert();
            });
    }
    
}


// plats

admin.directive('carteItems', function(){
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
    controller: function($scope, $element, $attrs, $transclude, $http, $routeParams) {
        
        // gestion des infos contact

        var id = $routeParams.id;

        function getCarteItems ()
        {
          $http.get('/admin_carte/items_list/'+id).success(function(data)
            {
              var i = 0;
              data = data.items;
              angular.forEach(data, function(element){
                data[i].weight = parseInt(data[i].weight);
                data[i].id = parseInt(data[i].id);
                i++;
              });
              $scope.carteItems = data;
              console.log(data);

            });
        }

        $scope.sortableOptions = {
          stop: function(e, ui) { 
            var i = 0;
            angular.forEach($scope.carteItems, function( item )
            {
                if (i != item.weight )
                {
                  $scope.carteItems[i].weight = i;
                  updateItem($scope.carteItems[i]);
                }
                i++;
            })
          },
          axis: 'y',
          placeholder: "beingDragged",
          tolerance: 'pointer',
        };

      
        $scope.addCarteItem = function()
        {
          console.log('ok');
          $scope.newCarteItem.parent_id = id;
          $scope.newCarteItem.weight = $scope.carteItems.length;
          $http({
                  url: '/admin_carte/item_edit',
                  method: "POST",
                  data: $scope.newCarteItem,
                  headers: {'Content-Type': 'application/json'}
              }).success(function (data, status, headers, config) {
                  $scope.carteItems.push({id:data.item.id, name: data.item.name, desc: data.item.desc, price:data.item.price, weight:data.item.weight});

                  $scope.alert = "Modifications enregistrées";
                  showFadeAlert();
                  }).error(function (data, status, headers, config) {
                      $scope.alert = 'Une erreure est survenue.';
                      console.log(data);
                      showFadeAlert();
                  }); 

          $scope.newCarteItem = null;
          $scope.editModeOpen = false;
        }

        $scope.switchEditMode = function(object)
        {
          $scope.editMode = true;
          $scope.editModeOpen = true;
          $scope.editedItem =clone(object);
          //$('#edit-form-anchor').scrollTo();
        }

        $scope.updateCarteItem = function(object)
        {

          $scope.alert = 'Sauvegarde';
          showAlert();
          $http(
          {
            url: '/admin_carte/item_edit',
            method: 'POST',
            data: $scope.editedItem,
            headers: {'Content-Type': 'application/json'}
          }).success(function(data) {
            var i = 0;
            angular.forEach($scope.carteItems, function(item){
              if (item.id === $scope.editedItem.id) {$scope.carteItems[i] = $scope.editedItem};
              i++;
            });
            $scope.editMode = false;
            $scope.editModeOpen = false;

            $scope.alert = "Modifications enregistrées";
            showFadeAlert();
          })
        }

        $scope.deleteCarteItem = function()
        {
          $http({
            url: '/admin_carte/item_delete/' + $scope.editedItem.id,
            method: 'POST',
            data: $scope.editedItem,
            headers: {'Content-Type': 'application/json'}
          }).success(function(data) {
            console.log(data);
            if (data.error == 0) {
                $scope.editMode = false;
                $scope.editModeOpen = false;
                $scope.alert = data.message;
                showFadeAlert();


                var temp = [],
                i = 0;

                angular.forEach($scope.carteItems, function(item) {

                  if ( item.weight > $scope.editedItem.weight )
                  {
                    item.weight = item.weight - 1;
                    updateItem(item);
                  }
                
                  if ( item.id != $scope.editedItem.id ) temp.push(item);

                });

                $scope.carteItems = temp;

            };
          })
        }

         function updateItem(object)
        {
            $http(
            {
              url: '/admin_carte/item_edit',
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
            angular.forEach($scope.carteItems, function(item){
              if (item.weight === currentWeight+1) { $scope.carteItems[i].weight = currentWeight; modified = 1};
              if (item.id === object.id) { $scope.carteItems[i].weight = currentWeight+1; modified = 1};
              i++;
              if (modified === 1) {updateItem(item)};
            });
          }

          function setPlus()
          {
            angular.forEach($scope.carteItems, function(item){
              if (item.weight === currentWeight-1) { $scope.carteItems[i].weight = currentWeight; modified = 1};
              if (item.id === object.id) { $scope.carteItems[i].weight = currentWeight-1; modified = 1};
              i++;
              if (modified === 1) {updateItem(item)};
            });
          }

          sens == 'plus' ? setMinus() : setPlus();

        }


        getCarteItems();

    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    templateUrl: '/admin/view_loader/'+templateDir+'/carte/widgets/carte_items',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    // link: function($scope, iElm, iAttrs, controller) {
      
    // }
  };
});