//angular

function MessagesListCtrl($scope, $http, contactsRepository, $routeParams, _ ) {

  menuControl('messages');

  $scope.isSpam = $routeParams.filter == 'messages' ? 0 : 1;
  var loadMessage = $routeParams.messageId;

  console.log(loadMessage);

  function getTheMessages(){

    //contenu
    contactsRepository.messagesList($scope.isSpam, function(data, total_items)
    {
      $scope.items = data;
      $scope.total_items = total_items;
      init_page();

      if (loadMessage)
      {
        $scope.getResume(loadMessage);
      }
  
    });
  }

  $scope.getMore = function()
  {
    contactsRepository.messagesList($scope.isSpam, function(data, total_items)
    {
      $scope.items = data;
      $('.item-list').minSize();
    }, true);
  }
    
  $scope.setGetPage = function (pageNo) {
    $scope.currentPage = pageNo;
    $scope.offset = $scope.currentPage * $scope.itemPerPage - $scope.itemPerPage;
    getTheItems($scope.itemPerPage, $scope.offset);
  };

  $scope.getView = function(id)
  {
    window.location.hash = '#/contacts/messages/'+id;
    block();
  }

  $scope.search = function()
  {
    if($scope.query.length >= 2)
    {
      console.log($scope.query);
      contactsRepository.searchItem(0, $scope.query, function(data)
      {
        $scope.total_items = data.total_items;
        $scope.items = data.items;
      }, false);
    }
    else
    {
      getTheMessages();
    }
  }

  $scope.getResume = function(id)
  {
    //contenu
    $('.item-list').find('.active').removeClass('active');
    $('#item-'+id).addClass('active');

    contactsRepository.messageDetails(id, function(data)
    {
        $scope.resume = _.findWhere($scope.items, {id : id});
        $scope.resume.fields = data.content_items;

        var i = 0;

        angular.forEach($scope.items, function(item)
        {
          if (item.id == id) {
            $scope.items[i].read_on = true;
          }
          i++;
        });
    });
  }

  $scope.validation = function (id) {
    $scope.deleteId = id;
    $('#validation-popup').showModal();
  }

  $scope.deleteItem = function (id) {
    $http.get('/admin_contact/delete_message/'+id).success(
      function(data)
      {
        if (data['error'] == '0') {
            //deleteItemInArray(id);

            $scope.items = _.filter($scope.items, function(item){ return item.id != id });

            if ($scope.resume.id = id) { $scope.resume = '' };
        }
      }
    );
  }

  $scope.refresh = function () {
    getTheMessages();
  }

  getTheMessages();
}

ViewMessage = function($scope, $http, $location, $routeParams){

  var id = $routeParams.messageId;

  getTheMessages = function(){
    //contenu
    $http.get('/admin_contact/message/'+id).success(function(data) {
      $scope.item = data[0];
      setTimeout("init_page()",10);
    });
  }

  $scope.validation = function (id, index) {
    $scope.deleteId = id;
    $scope.$index = index;
    $('#validation-popup').fadeIn();
  }

  $scope.deleteMessage = function (id, index) {
    $http.get('/admin_contact/delete/'+id).success(getTheMessages());
  }

  getTheMessages();
}

function ContactConfigCtrl($scope, $http) {
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

}


// ************** edition des formulaires ******************************//


function ContactFormsListCtrl($scope, $http, $injector)
{
  var config = {
    section : "contacts/forms",
    menu : 'messages',
    getUrl : '/admin_forms/forms_list/',
    deleteUrl : '/admin_forms/form_delete/',
  }

  $scope.table = [
      {title : 'Nom', param : 'name'}
    ];

  $scope.pageTitle = 'Formulaires de contact';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}

function ContactFormsEditCtrl($scope, $http, $routeParams, FormsRespository)
{
  $scope.section = "contacts/forms/list";
  $scope.backurl = 'contacts/forms/list';
  menuControl('messages');

  var id = $routeParams.id;
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
              window.location.hash = '/contacts/forms/list';
            }
            else if (id === 'new' && data.errors.length === 0)
            {
              window.location.hash = '/contacts/forms/edit/' + data.id;
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
    
}


// plats

admin.directive('formsFields', function(){
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
    controller: function($scope, $element, $attrs, $transclude, $http, $routeParams, $modal, FormsFieldsRespository) {
        
        // gestion des infos contact

        var id = $routeParams.id;

        function getFormFields ()
        {
         
          FormsFieldsRespository.GetAll(id)
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
                  FormsFieldsRespository.Save(item);
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
            controller: EditFormModalCtrl,
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

function EditFormModalCtrl($scope, $modalInstance, FormsFieldsRespository, item)
{
  $scope.item = item;

  $scope.save = function () {
    FormsFieldsRespository.Save(item)
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
        FormsFieldsRespository.Delete(item.id)
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

}