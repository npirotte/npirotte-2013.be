angular.module('Peaks.Contacts').controller('EditFormModalCtrl', ['$scope', '$modalInstance', 'FormFieldsRespository', 'item', function($scope, $modalInstance, formFieldsRespository, item)
{
  $scope.item = item;

  $scope.save = function () {
    formFieldsRespository.Save(item)
      .success(function(data){
        if (data.error > 0) {
          $scope.errors = data.errors
        }
        else
        {
           $modalInstance.close({ action : 'edit', item : $scope.item });
        }
      }); 
  };

  $scope.deleteField = function()
  {
    bootbox.confirm('Etes vous sur de vouloir supprimer ce champ ?', function(result)
    {
      if (result) {
        formFieldsRespository.Delete(item.id)
          .success(function()
          {
             $modalInstance.close({ action : 'delete', item : $scope.item});
          });
      };
    });
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.fieldvalues = {
    add : function()
    {

      try 
      {
        $scope.item.field_values.push({ field_value : 'valeur', field_display_value : 'texte affiché'});
      }
      catch(e)
      {
        $scope.item.field_values = [{ field_value : 'valeur', field_display_value : 'texte affiché'}];
      }
         
    },
    remove: function(index)
    {
      $scope.item.field_values.splice(index, 1);
    }
  }

}]);