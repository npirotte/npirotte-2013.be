angular.module('Peaks.Contacts').controller('ContactFormsEdit', ['$scope', '$http', '$stateParams', 'FormsRespository', function($scope, $http, $stateParams, FormsRespository)
{
  $scope.section = "contacts/forms";
  $scope.backurl = 'contacts/forms';
  menuControl('messages');

  var id = $stateParams.id;
  $scope.mode =  id;

  var getThePage = function(){

    FormsRespository.Get(id)
      .success(function(data)
      {
        $scope.item = data.items[0];
        init_page();
      });
   };

  if (id == 'new') 
  {
    $scope.item = {};
    init_page();
  } 
  else 
  {
    getThePage();
  }

  $scope.delete = function()
  {
    if (confirm('Supprimer cette catégories et tout ses éléments ?')) {
      FormsRespository.Delete(id)
        .success(function(data)
        {
          window.location.hash = $scope.backurl;
        });
    };
  }

    $scope.save = function(returnToList)
    {
      $scope.alert = "Sauvegarde...";
      showAlert();

      FormsRespository.Save($scope.item)
        .success(function (data, status, headers, config) {

          console.log(data);

            if (returnToList && data.errors.length === 0) {
              window.location.hash = '/contacts/forms';
            }
            else if (id === 'new' && data.errors.length === 0)
            {
              window.location.hash = '/contacts/forms/' + data.id;
            }
            else
            {
              $scope.alert = data.message;
              $scope.errors = data.errors;
              showFadeAlert();
              getThePage();
            }
                  
          })
        .error(function (data, status, headers, config) {
                  $scope.alert = 'Une erreure est survenue.';
                  showFadeAlert();
              });
    }
    
}]);