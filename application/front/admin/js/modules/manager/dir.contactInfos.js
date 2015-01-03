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