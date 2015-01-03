angular.module('Peaks.Contacts.Directives').directive('formsFields', function(){
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
    controller: function($scope, $element, $attrs, $transclude, $http, $stateParams, $modal, FormFieldsRespository) {
        
        // gestion des infos contact

        var id = $stateParams.id;

        function getFormFields ()
        {
         
          FormFieldsRespository.GetAll(id)
            .success(function(data)
            {
              var i = 0;
              data = data.items;
              angular.forEach(data, function(element){
                data[i].weight = parseInt(data[i].weight);
                data[i].id = parseInt(data[i].id);
                i++;
              });
              $scope.formFields = data;
            });
        }

        getFormFields();

        // drag-n-drop

        /*var formFieldsSamples = [
          {name : 'text_field', display_name : "Champ texte", field_type : 'text'}
        ];

        $scope.formFieldsSamples = formFieldsSamples.slice();
*/
        $scope.sortableOptions = {
          connectWith: ".form-preview",
          stop: function(e, ui) { 
            var i = 0;
            //$scope.formFieldsSamples = formFieldsSamples.slice();
            angular.forEach($scope.formFields, function( item )
            {
              console.log(item);
              console.log(i);
                if (i != item.weight )
                {
                  item.weight = i;
                  updateItem(item);
                  FormFieldsRespository.Save(item);
                }
                i++;
            })
          },
          axis: 'y',
          placeholder: "beingDragged",
          tolerance: 'pointer',
          selector: '.item'
        };

      

        $scope.openModal = function(object)
        {
          if (!object.parent_id) { object.parent_id = id };
           if (!object.weight) { object.weight = $scope.formFields.length };

          var modalInstance = $modal.open({
            templateUrl: '/admin/view_loader/'+templateDir+'/contacts/widgets/edit_modal',
            controller: 'EditFormModalCtrl',
            size: 'lg',
            resolve: {
              item: function () {
                return angular.copy(object);
              }
            }
          });

          modalInstance.result.then(function(resultObj)
          {
            getFormFields();
          });
        }

    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    templateUrl: '/admin/view_loader/'+templateDir+'/contacts/widgets/forms_fields',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    // link: function($scope, iElm, iAttrs, controller) {
      
    // }
  };
});