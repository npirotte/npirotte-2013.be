angular.module('Peaks.Pages').controller('MenuEditCtrl', ['$scope', '$stateParams', 'MenusMenusRepository', function($scope, $stateParams, menusMenusRepository){
  menuControl('pages');
  $scope.backUrl = "pages/menus";

  var id = $stateParams.id
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
}])