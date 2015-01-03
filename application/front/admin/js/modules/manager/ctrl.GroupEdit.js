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