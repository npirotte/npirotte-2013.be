angular.module('Peaks.Contacts').controller('ContactConfig', ['$scope', '$http', function($scope, $http)
{
	menuControl('messages');

  $scope.editMode = false;

  init_page();

  function getContactInfos ()
  {
    $http.get('/admin_contact/get_contact_info').success(function(data)
      {
        var i = 0;
        angular.forEach(data, function(element){
          data[i].weight = parseInt(data[i].weight);
          data[i].id = parseInt(data[i].id);
          i++;
        });
        $scope.contactItems = data;
      })
  }

  $scope.addContactInfo = function()
  {
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

    $scope.newContactInfo = '';
  }

  $scope.switchEditMode = function(object)
  {
    $scope.editMode = true;
    $scope.editedItem = object;
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
          getContactInfos();
          $scope.editMode = false;
          $scope.alert = data.message;

          var temp = [],
          i = 0;

          angular.forEach($scope.editedItem, function(item) {
            if ( item.id != $scope.editedItem.id ) temp.push(item);

          });
          $scope.editedItem = temp;

      };
    })
  }

  $scope.reorder = function(object, sens)
  {
    var currentWeight = object.weight,
        newWeight,
        i=0,
        modified = 0;


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

  $scope.save = function () {

    console.log($scope.items);

    $http({
            url: '/admin_contact/update_config',
            method: "POST",
            data: $scope.items,
            headers: {'Content-Type': 'application/json'}
        })
      .success(function (data, status, headers, config) {
          console.log(data);

            $scope.alert = 'Modification enregistrées !';
                  showFadeAlert();
                
            })
      .error(function (data, status, headers, config) {
                $scope.alert = 'Une erreure est survenue.';
                showFadeAlert();
            });
    
  }

  getContactInfos();
}]);