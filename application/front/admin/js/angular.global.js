//angular

function StylecheetsListCtrl($scope, $http, $injector)
{

  var config = {
    section : "configuration/stylesheets",
    menu : 'configuration',
    getUrl : '/admin_global/stylesheets_list/',
    deleteUrl : 'admin_banners/delete_stylesheets/'
  }

  $scope.table = [
      {title : 'Nom', param : 'name'},
      {title : 'Versions', param : 'versions'}
    ];

  $scope.pageTitle = 'Styles csss';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}


function StylecheetEdit($scope, $http, $routeParams, StylesheetsRespository, _) {

  $scope.section = "configuration/stylesheets";
  $scope.backUrl = "configuration/stylesheets";
  menuControl('configuration');

  var id = $routeParams.id;
  $scope.mode =  id;

  $scope.activeChild = false;


  $scope.aceLoaded = function(_editor)
  {
     aceeditorConfig(_editor);
  };

 
  var getTheItem = function(){
    StylesheetsRespository.StyleSheetDetails(id, function(data)
    {
      console.log(data);
      data.item.is_active = data.item.is_active == 1;
      $scope.item = data.item;
      $scope.childs = data.childs;

      if (data.childs.length === 0) {
        $scope.childs.push({id : 'new', version : 1, content : '', stylesheet_id : id});
      }
      else
      {
        StylesheetsRespository.ContentDetails($scope.childs[0].id, function(data)
        {
          console.log(data);
          $scope.childs[0] = data;
        });
      }

      $scope.activeChild = $scope.childs[0];

      init_page();
    });
  }

  $scope.save = function (returnToParent) {

    $scope.alert = 'Sauvegarde…';
    showAlert();

    var data = {item: $scope.item, childs: $scope.childs}

    StylesheetsRespository.StyleSheetSave(data, function(data)
    {
      console.log(data);
      if (returnToParent && data.errors.length === 0) {
        window.location.hash = $scope.backUrl;
      }
      else if (id === 'new' && data.errors.length === 0)
      {
        window.location.hash = '/configuration/stylesheets/edit/'+data.id;
      }
      else
      {
        $scope.alert = data.message;
        $scope.errors = data.errors;
        showFadeAlert();
        if (data.errors.length === 0) {
          getTheItem();
        };
      }
    });
  }

  $scope.delete = function () {
   
  }

  $scope.createNewVersion = function()
  {
    if ($scope.childs[$scope.childs.length - 1].id != 'new') 
    {
      $scope.childs.unshift({id : 'new', version : Number($scope.childs[0].version) + 1, content : '', stylesheet_id : id});
    };
    console.log($scope.childs);
    $scope.activeChild = $scope.childs[0];
  }

  $scope.getVersion = function(id)
  {
    console.log(id);
    var i = 0, j;
    angular.forEach($scope.childs, function(item)
    {
      if (item.id === id) {
        $scope.activeChild = $scope.childs[i];
        j = i;
      };
      i++;
    });

    // on récupère le contenu s'il n'est pas chargé
    if (!$scope.activeChild.content) {
      StylesheetsRespository.ContentDetails($scope.activeChild.id, function(data)
      {
        $scope.childs[j] = data;
        $scope.activeChild = $scope.childs[j];
      });
    };
  }

  if ($scope.mode != 'new') {
    getTheItem();
  } 
  else {
    $scope.hideForNew = true;
    $scope.item = {};
    $scope.childs = [{id : 'new', version : 1, content : '', stylesheet_id : id}];
    $scope.activeChild = $scope.childs[0];
    init_page();
    console.log('ok');
  }
}