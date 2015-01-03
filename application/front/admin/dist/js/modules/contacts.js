angular.module('Peaks.Contacts', ['Peaks.Contacts.Services', 'Peaks.Contacts.Directives', 'Peaks.Contacts.Repositories']);
angular.module('Peaks.Contacts.Services', []);
angular.module('Peaks.Contacts.Directives', []);
angular.module('Peaks.Contacts.Repositories', [])
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
angular.module('Peaks.Contacts').controller('ContactFormsList', ['$scope', '$http', '$injector', function($scope, $http, $injector)
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
}]);
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
angular.module('Peaks.Contacts').controller('MessagesList', ['$scope', '$http', 'ContactsRepository', '_', function($scope, $http, contactsRepository , _ )
{

  menuControl('messages');

  $scope.isSpam = 0;//$routeParams.filter == 'messages' ? 0 : 1;
  var loadMessage = ''//$stateParams.messageId;

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

}]);
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
angular.module('Peaks.Contacts.Directives').directive('lastMessages', ['ContactsRepository', function(contactsRepository){

	return {
		scope: {},
		templateUrl: '/admin/view_loader/desktop/contacts/widgets/last_messages',
		link: function(scope, iElm, iAttr, controller)
		{
			function getData()
			{
				contactsRepository.lastMessage(function(data)
				{
					console.log(data);
					scope.items = data.items;
				});
			}

			getData();
		}

	}
}]);
angular.module('Peaks.Contacts.Directives').directive('unreadMessagesNbr', ['ContactsRepository', '$interval', function(contactsRepository, $interval){
	// Runs during compile

	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<div><span class="number">{{messagesNbr}}</span><br /><small>Nouveau(x) message(s)</small></div>',
		// templateUrl: '',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, iElm, iAttrs, controller) {

			function getData()
			{
				contactsRepository.unreadMessagesNbr(function(data)
				{
					scope.messagesNbr = data.count;
				});
			}

			getData();

			var interval = $interval(function(){getData()}, 30000);

			scope.$on('$destroy', function()
			{
				$interval.cancel(interval);
			})
		}
	};
}]);
angular.module('Peaks.Contacts.Repositories').factory('ContactsRepository', ['$http', '_', function($http){

  var messagesListCache = new Array();
  var messageDetailsCache = new Array();

  // stockage des données quand on quite la page

  function storeData(data)
  {
    //alert('ok');
  }

	return { 
         messagesList: function (isSpam, callback, getOld) { 

          var max_id,
              offset,
              url;

         		// récupère ce qui existe dans le cache
            if (messagesListCache.length > 0 && !getOld) {
              callback(messagesListCache);
              max_id = _.max(messagesListCache, function(item){ return item.id });
              max_id = max_id.id;
            };

          if (getOld) {
            offset = _.min(messagesListCache, function(item){ return item.id });
            offset = offset.id
          };

           url = max_id ? '/admin_contact/messages_list/'+isSpam+'?max_id='+max_id : '/admin_contact/messages_list/'+isSpam+'/5/' + offset;

         			// on récupère l'info du serveur
       			$http.get(url)
				    .success(function(data)
				    {

              data.items.forEach(function(item)
              {
                var sender = _.findWhere(item.fields[0], {field_name : 'Email'});
                item.sender = sender ? sender.field_value : 'Inconnu';
                messagesListCache.push(item);
              });

				    	callback(messagesListCache, data.total_items);
              storeData(messagesListCache);
              
				    });
         		
         },

         searchItem : function(isSpam, query, callback, getOld)
         {
          var url, 
            offset;

          if (getOld) {
            offset = _.min($scope.items, function(item){ return item.id });
            offset = offset.id
          };

          url = '/admin_contact/messages_list/'+isSpam+'?query='+query;

          $http.get(url)
          .success(function(data)
          {
            var i = 0;
            data.items.forEach(function(item)
            {
              var sender = _.findWhere(item.fields[0], {field_name : 'Email'});
              item.sender = sender ? sender.field_value : 'Inconnu';
              data.items[i++] = item;
            });

            callback(data);
          });
         },

         messageDetails: function(id, callback)
         {
            if (messageDetailsCache[id]) 
            {
              callback(messageDetailsCache[id]);
            }
            else
            {
              $http.get('/admin_contact/message/'+id)
              .success(function(data)
              {
                callback(data);
                messageDetailsCache[id] = data;
              })
            }
         },

         unreadMessagesNbr: function(callback)
         {
          $http.get('/admin_contact/unread_messages_nbr')
          .success(function(data)
          {
            data.count = parseInt(data.count);
            callback(data);
          })
         },

         lastMessage: function(callback)
         {
          $http.get('/admin_contact/messages_list/0/2/0')
          .success(function(data)
          {
            var i = 0;
            data.items.forEach(function(item)
            {
              var sender = _.findWhere(item.fields[0], {field_name : 'Email'});
              item.sender = sender ? sender.field_value : 'Inconnu';
              data.items[i++] = item;
            });
            
            callback(data);
          });
         }
     }; 
}]);
angular.module('Peaks.Contacts.Repositories').factory('FormFieldsRespository', ['$http', function($http){
  return {
    GetAll : function(parentId)
    {
      return $http.get('/admin_forms/fields_list/'+parentId);
    },
    Delete : function(id)
    {
      return $http.get('/admin_forms/field_delete/'+id);
    },
    Save : function(data)
    {
      return $http({
        url: '/admin_forms/field_edit',
        method: "POST",
        data: data,
        headers: {'Content-Type': 'application/json'}
        });
    }
  }
}]);
angular.module('Peaks.Contacts.Repositories').factory('FormsRespository', ['$http', function($http){
  return {
    Get : function(id)
    {
      return $http.get('/admin_forms/form_details/'+id);
    },
    Delete : function(id)
    {
      return $http.get('/admin_forms/form_delete/'+id);
    },
    Save : function(data)
    {
      return $http({
        url: '/admin_forms/form_edit',
        method: "POST",
        data: data,
        headers: {'Content-Type': 'application/json'}
        });
    }
  }
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9jb250YWN0cy5tb2R1bGUuanMiLCJjdHJsLkNvbnRhY3RDb25maWcuanMiLCJjdHJsLkNvbnRhY3RGb3Jtc0VkaXQuanMiLCJjdHJsLkNvbnRhY3RGb3Jtc0xpc3QuanMiLCJjdHJsLkVkaXRGb3JtTW9kYWwuanMiLCJjdHJsLk1lc3NhZ2VMaXN0LmpzIiwiZGlyLkZvcm1zRmllbGRzLmpzIiwiZGlyLkxhc3RNZXNzYWdlcy5qcyIsImRpci5VbnJlYWRNZXNzYWdlc05ici5qcyIsInJlcG8uQ29udGFjdHNSZXBvc2l0b3J5LmpzIiwicmVwby5Gb3Jtc0ZpZWxkc1JlcG9zaXRvcnkuanMiLCJyZXBvLkZvcm1zUmVwb3NpdG9yeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29udGFjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnUGVha3MuQ29udGFjdHMnLCBbJ1BlYWtzLkNvbnRhY3RzLlNlcnZpY2VzJywgJ1BlYWtzLkNvbnRhY3RzLkRpcmVjdGl2ZXMnLCAnUGVha3MuQ29udGFjdHMuUmVwb3NpdG9yaWVzJ10pO1xyXG5hbmd1bGFyLm1vZHVsZSgnUGVha3MuQ29udGFjdHMuU2VydmljZXMnLCBbXSk7XHJcbmFuZ3VsYXIubW9kdWxlKCdQZWFrcy5Db250YWN0cy5EaXJlY3RpdmVzJywgW10pO1xyXG5hbmd1bGFyLm1vZHVsZSgnUGVha3MuQ29udGFjdHMuUmVwb3NpdG9yaWVzJywgW10pIiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkNvbnRhY3RzJykuY29udHJvbGxlcignQ29udGFjdENvbmZpZycsIFsnJHNjb3BlJywgJyRodHRwJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cClcclxue1xyXG5cdG1lbnVDb250cm9sKCdtZXNzYWdlcycpO1xyXG5cclxuICAkc2NvcGUuZWRpdE1vZGUgPSBmYWxzZTtcclxuXHJcbiAgaW5pdF9wYWdlKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGdldENvbnRhY3RJbmZvcyAoKVxyXG4gIHtcclxuICAgICRodHRwLmdldCgnL2FkbWluX2NvbnRhY3QvZ2V0X2NvbnRhY3RfaW5mbycpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAge1xyXG4gICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICBhbmd1bGFyLmZvckVhY2goZGF0YSwgZnVuY3Rpb24oZWxlbWVudCl7XHJcbiAgICAgICAgICBkYXRhW2ldLndlaWdodCA9IHBhcnNlSW50KGRhdGFbaV0ud2VpZ2h0KTtcclxuICAgICAgICAgIGRhdGFbaV0uaWQgPSBwYXJzZUludChkYXRhW2ldLmlkKTtcclxuICAgICAgICAgIGkrKztcclxuICAgICAgICB9KTtcclxuICAgICAgICAkc2NvcGUuY29udGFjdEl0ZW1zID0gZGF0YTtcclxuICAgICAgfSlcclxuICB9XHJcblxyXG4gICRzY29wZS5hZGRDb250YWN0SW5mbyA9IGZ1bmN0aW9uKClcclxuICB7XHJcbiAgICAkc2NvcGUubmV3Q29udGFjdEluZm8ud2VpZ2h0ID0gJHNjb3BlLmNvbnRhY3RJdGVtcy5sZW5ndGg7XHJcbiAgICAkaHR0cCh7XHJcbiAgICAgICAgICAgIHVybDogJy9hZG1pbl9jb250YWN0L2NyZWF0ZV9jb250YWN0X2luZm8nLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBkYXRhOiAkc2NvcGUubmV3Q29udGFjdEluZm8sXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5jb250YWN0SXRlbXMucHVzaCh7aWQ6ZGF0YS5pZCwgbmFtZTogZGF0YS5uYW1lLCB2YWx1ZTpkYXRhLnZhbHVlLCB0YXJnZXQ6ZGF0YS50YXJnZXQsIGljb246ZGF0YS5pY29uLCB3ZWlnaHQ6ZGF0YS53ZWlnaHR9KTtcclxuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSAnVW5lIGVycmV1cmUgZXN0IHN1cnZlbnVlLic7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgfSk7IFxyXG5cclxuICAgICRzY29wZS5uZXdDb250YWN0SW5mbyA9ICcnO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnN3aXRjaEVkaXRNb2RlID0gZnVuY3Rpb24ob2JqZWN0KVxyXG4gIHtcclxuICAgICRzY29wZS5lZGl0TW9kZSA9IHRydWU7XHJcbiAgICAkc2NvcGUuZWRpdGVkSXRlbSA9IG9iamVjdDtcclxuICB9XHJcblxyXG4gICRzY29wZS51cGRhdGVDb250YWN0SW5mbyA9IGZ1bmN0aW9uKG9iamVjdClcclxuICB7XHJcbiAgICAkaHR0cChcclxuICAgIHtcclxuICAgICAgdXJsOiAnL2FkbWluX2NvbnRhY3QvZWRpdF9jb250YWN0X2luZm8nLFxyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgZGF0YTogJHNjb3BlLmVkaXRlZEl0ZW0sXHJcbiAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgfSkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgIHZhciBpID0gMDtcclxuICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5jb250YWN0SXRlbXMsIGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgIGlmIChpdGVtLmlkID09PSAkc2NvcGUuZWRpdGVkSXRlbS5pZCkgeyRzY29wZS5jb250YWN0SXRlbXNbaV0gPSAkc2NvcGUuZWRpdGVkSXRlbX07XHJcbiAgICAgICAgaSsrO1xyXG4gICAgICB9KTtcclxuICAgICAgJHNjb3BlLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmRlbGV0ZUNvbnRhY3RJbmZvID0gZnVuY3Rpb24oKVxyXG4gIHtcclxuICAgICRodHRwKHtcclxuICAgICAgdXJsOiAnL2FkbWluX2NvbnRhY3QvZGVsZXRlX2NvbnRhY3RfaW5mbycsXHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBkYXRhOiAkc2NvcGUuZWRpdGVkSXRlbSxcclxuICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgaWYgKGRhdGEuZXJyb3IgPT09IDApIHtcclxuICAgICAgICAgIGdldENvbnRhY3RJbmZvcygpO1xyXG4gICAgICAgICAgJHNjb3BlLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgICAgICAkc2NvcGUuYWxlcnQgPSBkYXRhLm1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgdmFyIHRlbXAgPSBbXSxcclxuICAgICAgICAgIGkgPSAwO1xyXG5cclxuICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZWRpdGVkSXRlbSwgZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICBpZiAoIGl0ZW0uaWQgIT0gJHNjb3BlLmVkaXRlZEl0ZW0uaWQgKSB0ZW1wLnB1c2goaXRlbSk7XHJcblxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICAkc2NvcGUuZWRpdGVkSXRlbSA9IHRlbXA7XHJcblxyXG4gICAgICB9O1xyXG4gICAgfSlcclxuICB9XHJcblxyXG4gICRzY29wZS5yZW9yZGVyID0gZnVuY3Rpb24ob2JqZWN0LCBzZW5zKVxyXG4gIHtcclxuICAgIHZhciBjdXJyZW50V2VpZ2h0ID0gb2JqZWN0LndlaWdodCxcclxuICAgICAgICBuZXdXZWlnaHQsXHJcbiAgICAgICAgaT0wLFxyXG4gICAgICAgIG1vZGlmaWVkID0gMDtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlSXRlbShvYmplY3QpXHJcbiAgICB7XHJcbiAgICAgICAgICAkaHR0cChcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdXJsOiAnL2FkbWluX2NvbnRhY3QvZWRpdF9jb250YWN0X2luZm8nLFxyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgZGF0YTogb2JqZWN0LFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNldE1pbnVzKClcclxuICAgIHtcclxuICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS5jb250YWN0SXRlbXMsIGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICAgIGlmIChpdGVtLndlaWdodCA9PT0gY3VycmVudFdlaWdodCsxKSB7ICRzY29wZS5jb250YWN0SXRlbXNbaV0ud2VpZ2h0ID0gY3VycmVudFdlaWdodDsgbW9kaWZpZWQgPSAxfTtcclxuICAgICAgICBpZiAoaXRlbS5pZCA9PT0gb2JqZWN0LmlkKSB7ICRzY29wZS5jb250YWN0SXRlbXNbaV0ud2VpZ2h0ID0gY3VycmVudFdlaWdodCsxOyBtb2RpZmllZCA9IDF9O1xyXG4gICAgICAgIGkrKztcclxuICAgICAgICBpZiAobW9kaWZpZWQgPT09IDEpIHt1cGRhdGVJdGVtKGl0ZW0pfTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0UGx1cygpXHJcbiAgICB7XHJcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuY29udGFjdEl0ZW1zLCBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICBpZiAoaXRlbS53ZWlnaHQgPT09IGN1cnJlbnRXZWlnaHQtMSkgeyAkc2NvcGUuY29udGFjdEl0ZW1zW2ldLndlaWdodCA9IGN1cnJlbnRXZWlnaHQ7IG1vZGlmaWVkID0gMX07XHJcbiAgICAgICAgaWYgKGl0ZW0uaWQgPT09IG9iamVjdC5pZCkgeyAkc2NvcGUuY29udGFjdEl0ZW1zW2ldLndlaWdodCA9IGN1cnJlbnRXZWlnaHQtMTsgbW9kaWZpZWQgPSAxfTtcclxuICAgICAgICBpKys7XHJcbiAgICAgICAgaWYgKG1vZGlmaWVkID09PSAxKSB7dXBkYXRlSXRlbShpdGVtKX07XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbnMgPT0gJ3BsdXMnID8gc2V0TWludXMoKSA6IHNldFBsdXMoKTtcclxuXHJcbiAgfVxyXG5cclxuICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zb2xlLmxvZygkc2NvcGUuaXRlbXMpO1xyXG5cclxuICAgICRodHRwKHtcclxuICAgICAgICAgICAgdXJsOiAnL2FkbWluX2NvbnRhY3QvdXBkYXRlX2NvbmZpZycsXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgICAgIGRhdGE6ICRzY29wZS5pdGVtcyxcclxuICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgICAgfSlcclxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5hbGVydCA9ICdNb2RpZmljYXRpb24gZW5yZWdpc3Ryw6llcyAhJztcclxuICAgICAgICAgICAgICAgICAgc2hvd0ZhZGVBbGVydCgpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgIC5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydCA9ICdVbmUgZXJyZXVyZSBlc3Qgc3VydmVudWUuJztcclxuICAgICAgICAgICAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIGdldENvbnRhY3RJbmZvcygpO1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkNvbnRhY3RzJykuY29udHJvbGxlcignQ29udGFjdEZvcm1zRWRpdCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRzdGF0ZVBhcmFtcycsICdGb3Jtc1Jlc3Bvc2l0b3J5JywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zLCBGb3Jtc1Jlc3Bvc2l0b3J5KVxyXG57XHJcbiAgJHNjb3BlLnNlY3Rpb24gPSBcImNvbnRhY3RzL2Zvcm1zXCI7XHJcbiAgJHNjb3BlLmJhY2t1cmwgPSAnY29udGFjdHMvZm9ybXMnO1xyXG4gIG1lbnVDb250cm9sKCdtZXNzYWdlcycpO1xyXG5cclxuICB2YXIgaWQgPSAkc3RhdGVQYXJhbXMuaWQ7XHJcbiAgJHNjb3BlLm1vZGUgPSAgaWQ7XHJcblxyXG4gIHZhciBnZXRUaGVQYWdlID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgICBGb3Jtc1Jlc3Bvc2l0b3J5LkdldChpZClcclxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAge1xyXG4gICAgICAgICRzY29wZS5pdGVtID0gZGF0YS5pdGVtc1swXTtcclxuICAgICAgICBpbml0X3BhZ2UoKTtcclxuICAgICAgfSk7XHJcbiAgIH07XHJcblxyXG4gIGlmIChpZCA9PSAnbmV3JykgXHJcbiAge1xyXG4gICAgJHNjb3BlLml0ZW0gPSB7fTtcclxuICAgIGluaXRfcGFnZSgpO1xyXG4gIH0gXHJcbiAgZWxzZSBcclxuICB7XHJcbiAgICBnZXRUaGVQYWdlKCk7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKVxyXG4gIHtcclxuICAgIGlmIChjb25maXJtKCdTdXBwcmltZXIgY2V0dGUgY2F0w6lnb3JpZXMgZXQgdG91dCBzZXMgw6lsw6ltZW50cyA/JykpIHtcclxuICAgICAgRm9ybXNSZXNwb3NpdG9yeS5EZWxldGUoaWQpXHJcbiAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICRzY29wZS5iYWNrdXJsO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbihyZXR1cm5Ub0xpc3QpXHJcbiAgICB7XHJcbiAgICAgICRzY29wZS5hbGVydCA9IFwiU2F1dmVnYXJkZS4uLlwiO1xyXG4gICAgICBzaG93QWxlcnQoKTtcclxuXHJcbiAgICAgIEZvcm1zUmVzcG9zaXRvcnkuU2F2ZSgkc2NvcGUuaXRlbSlcclxuICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuXHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXR1cm5Ub0xpc3QgJiYgZGF0YS5lcnJvcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL2NvbnRhY3RzL2Zvcm1zJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpZCA9PT0gJ25ldycgJiYgZGF0YS5lcnJvcnMubGVuZ3RoID09PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL2NvbnRhY3RzL2Zvcm1zLycgKyBkYXRhLmlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICRzY29wZS5hbGVydCA9IGRhdGEubWVzc2FnZTtcclxuICAgICAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gZGF0YS5lcnJvcnM7XHJcbiAgICAgICAgICAgICAgc2hvd0ZhZGVBbGVydCgpO1xyXG4gICAgICAgICAgICAgIGdldFRoZVBhZ2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSAnVW5lIGVycmV1cmUgZXN0IHN1cnZlbnVlLic7XHJcbiAgICAgICAgICAgICAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIFxyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkNvbnRhY3RzJykuY29udHJvbGxlcignQ29udGFjdEZvcm1zTGlzdCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRpbmplY3RvcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRpbmplY3Rvcilcclxue1xyXG5cdHZhciBjb25maWcgPSB7XHJcblx0ICAgIHNlY3Rpb24gOiBcImNvbnRhY3RzL2Zvcm1zXCIsXHJcblx0ICAgIG1lbnUgOiAnbWVzc2FnZXMnLFxyXG5cdCAgICBnZXRVcmwgOiAnL2FkbWluX2Zvcm1zL2Zvcm1zX2xpc3QvJyxcclxuXHQgICAgZGVsZXRlVXJsIDogJy9hZG1pbl9mb3Jtcy9mb3JtX2RlbGV0ZS8nLFxyXG5cdCAgfVxyXG5cclxuXHQgICRzY29wZS50YWJsZSA9IFtcclxuXHQgICAgICB7dGl0bGUgOiAnTm9tJywgcGFyYW0gOiAnbmFtZSd9XHJcblx0ICAgIF07XHJcblxyXG5cdCAgJHNjb3BlLnBhZ2VUaXRsZSA9ICdGb3JtdWxhaXJlcyBkZSBjb250YWN0JztcclxuXHJcblx0ICAkaW5qZWN0b3IuaW52b2tlKEl0ZW1MaXN0LCB0aGlzLCB7JHNjb3BlOiAkc2NvcGUsICRodHRwOiAkaHR0cCwgY29uZmlnOiBjb25maWd9KTtcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5Db250YWN0cycpLmNvbnRyb2xsZXIoJ0VkaXRGb3JtTW9kYWxDdHJsJywgWyckc2NvcGUnLCAnJG1vZGFsSW5zdGFuY2UnLCAnRm9ybUZpZWxkc1Jlc3Bvc2l0b3J5JywgJ2l0ZW0nLCBmdW5jdGlvbigkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBmb3JtRmllbGRzUmVzcG9zaXRvcnksIGl0ZW0pXHJcbntcclxuICAkc2NvcGUuaXRlbSA9IGl0ZW07XHJcblxyXG4gICRzY29wZS5zYXZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgZm9ybUZpZWxkc1Jlc3Bvc2l0b3J5LlNhdmUoaXRlbSlcclxuICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgaWYgKGRhdGEuZXJyb3IgPiAwKSB7XHJcbiAgICAgICAgICAkc2NvcGUuZXJyb3JzID0gZGF0YS5lcnJvcnNcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSh7IGFjdGlvbiA6ICdlZGl0JywgaXRlbSA6ICRzY29wZS5pdGVtIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7IFxyXG4gIH07XHJcblxyXG4gICRzY29wZS5kZWxldGVGaWVsZCA9IGZ1bmN0aW9uKClcclxuICB7XHJcbiAgICBib290Ym94LmNvbmZpcm0oJ0V0ZXMgdm91cyBzdXIgZGUgdm91bG9pciBzdXBwcmltZXIgY2UgY2hhbXAgPycsIGZ1bmN0aW9uKHJlc3VsdClcclxuICAgIHtcclxuICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgIGZvcm1GaWVsZHNSZXNwb3NpdG9yeS5EZWxldGUoaXRlbS5pZClcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKClcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKHsgYWN0aW9uIDogJ2RlbGV0ZScsIGl0ZW0gOiAkc2NvcGUuaXRlbX0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcclxuICB9O1xyXG5cclxuICAkc2NvcGUuZmllbGR2YWx1ZXMgPSB7XHJcbiAgICBhZGQgOiBmdW5jdGlvbigpXHJcbiAgICB7XHJcblxyXG4gICAgICB0cnkgXHJcbiAgICAgIHtcclxuICAgICAgICAkc2NvcGUuaXRlbS5maWVsZF92YWx1ZXMucHVzaCh7IGZpZWxkX3ZhbHVlIDogJ3ZhbGV1cicsIGZpZWxkX2Rpc3BsYXlfdmFsdWUgOiAndGV4dGUgYWZmaWNow6knfSk7XHJcbiAgICAgIH1cclxuICAgICAgY2F0Y2goZSlcclxuICAgICAge1xyXG4gICAgICAgICRzY29wZS5pdGVtLmZpZWxkX3ZhbHVlcyA9IFt7IGZpZWxkX3ZhbHVlIDogJ3ZhbGV1cicsIGZpZWxkX2Rpc3BsYXlfdmFsdWUgOiAndGV4dGUgYWZmaWNow6knfV07XHJcbiAgICAgIH1cclxuICAgICAgICAgXHJcbiAgICB9LFxyXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihpbmRleClcclxuICAgIHtcclxuICAgICAgJHNjb3BlLml0ZW0uZmllbGRfdmFsdWVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5Db250YWN0cycpLmNvbnRyb2xsZXIoJ01lc3NhZ2VzTGlzdCcsIFsnJHNjb3BlJywgJyRodHRwJywgJ0NvbnRhY3RzUmVwb3NpdG9yeScsICdfJywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgY29udGFjdHNSZXBvc2l0b3J5ICwgXyApXHJcbntcclxuXHJcbiAgbWVudUNvbnRyb2woJ21lc3NhZ2VzJyk7XHJcblxyXG4gICRzY29wZS5pc1NwYW0gPSAwOy8vJHJvdXRlUGFyYW1zLmZpbHRlciA9PSAnbWVzc2FnZXMnID8gMCA6IDE7XHJcbiAgdmFyIGxvYWRNZXNzYWdlID0gJycvLyRzdGF0ZVBhcmFtcy5tZXNzYWdlSWQ7XHJcblxyXG4gIGNvbnNvbGUubG9nKGxvYWRNZXNzYWdlKTtcclxuXHJcbiAgZnVuY3Rpb24gZ2V0VGhlTWVzc2FnZXMoKXtcclxuXHJcbiAgICAvL2NvbnRlbnVcclxuICAgIGNvbnRhY3RzUmVwb3NpdG9yeS5tZXNzYWdlc0xpc3QoJHNjb3BlLmlzU3BhbSwgZnVuY3Rpb24oZGF0YSwgdG90YWxfaXRlbXMpXHJcbiAgICB7XHJcbiAgICAgICRzY29wZS5pdGVtcyA9IGRhdGE7XHJcbiAgICAgICRzY29wZS50b3RhbF9pdGVtcyA9IHRvdGFsX2l0ZW1zO1xyXG4gICAgICBpbml0X3BhZ2UoKTtcclxuXHJcbiAgICAgIGlmIChsb2FkTWVzc2FnZSlcclxuICAgICAge1xyXG4gICAgICAgICRzY29wZS5nZXRSZXN1bWUobG9hZE1lc3NhZ2UpO1xyXG4gICAgICB9XHJcbiAgXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICRzY29wZS5nZXRNb3JlID0gZnVuY3Rpb24oKVxyXG4gIHtcclxuICAgIGNvbnRhY3RzUmVwb3NpdG9yeS5tZXNzYWdlc0xpc3QoJHNjb3BlLmlzU3BhbSwgZnVuY3Rpb24oZGF0YSwgdG90YWxfaXRlbXMpXHJcbiAgICB7XHJcbiAgICAgICRzY29wZS5pdGVtcyA9IGRhdGE7XHJcbiAgICAgICQoJy5pdGVtLWxpc3QnKS5taW5TaXplKCk7XHJcbiAgICB9LCB0cnVlKTtcclxuICB9XHJcbiAgICBcclxuICAkc2NvcGUuc2V0R2V0UGFnZSA9IGZ1bmN0aW9uIChwYWdlTm8pIHtcclxuICAgICRzY29wZS5jdXJyZW50UGFnZSA9IHBhZ2VObztcclxuICAgICRzY29wZS5vZmZzZXQgPSAkc2NvcGUuY3VycmVudFBhZ2UgKiAkc2NvcGUuaXRlbVBlclBhZ2UgLSAkc2NvcGUuaXRlbVBlclBhZ2U7XHJcbiAgICBnZXRUaGVJdGVtcygkc2NvcGUuaXRlbVBlclBhZ2UsICRzY29wZS5vZmZzZXQpO1xyXG4gIH07XHJcblxyXG4gICRzY29wZS5nZXRWaWV3ID0gZnVuY3Rpb24oaWQpXHJcbiAge1xyXG4gICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnIy9jb250YWN0cy9tZXNzYWdlcy8nK2lkO1xyXG4gICAgYmxvY2soKTtcclxuICB9XHJcblxyXG4gICRzY29wZS5zZWFyY2ggPSBmdW5jdGlvbigpXHJcbiAge1xyXG4gICAgaWYoJHNjb3BlLnF1ZXJ5Lmxlbmd0aCA+PSAyKVxyXG4gICAge1xyXG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUucXVlcnkpO1xyXG4gICAgICBjb250YWN0c1JlcG9zaXRvcnkuc2VhcmNoSXRlbSgwLCAkc2NvcGUucXVlcnksIGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgIHtcclxuICAgICAgICAkc2NvcGUudG90YWxfaXRlbXMgPSBkYXRhLnRvdGFsX2l0ZW1zO1xyXG4gICAgICAgICRzY29wZS5pdGVtcyA9IGRhdGEuaXRlbXM7XHJcbiAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgZ2V0VGhlTWVzc2FnZXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gICRzY29wZS5nZXRSZXN1bWUgPSBmdW5jdGlvbihpZClcclxuICB7XHJcbiAgICAvL2NvbnRlbnVcclxuICAgICQoJy5pdGVtLWxpc3QnKS5maW5kKCcuYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgJCgnI2l0ZW0tJytpZCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgIGNvbnRhY3RzUmVwb3NpdG9yeS5tZXNzYWdlRGV0YWlscyhpZCwgZnVuY3Rpb24oZGF0YSlcclxuICAgIHtcclxuICAgICAgICAkc2NvcGUucmVzdW1lID0gXy5maW5kV2hlcmUoJHNjb3BlLml0ZW1zLCB7aWQgOiBpZH0pO1xyXG4gICAgICAgICRzY29wZS5yZXN1bWUuZmllbGRzID0gZGF0YS5jb250ZW50X2l0ZW1zO1xyXG5cclxuICAgICAgICB2YXIgaSA9IDA7XHJcblxyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuaXRlbXMsIGZ1bmN0aW9uKGl0ZW0pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWYgKGl0ZW0uaWQgPT0gaWQpIHtcclxuICAgICAgICAgICAgJHNjb3BlLml0ZW1zW2ldLnJlYWRfb24gPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaSsrO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUudmFsaWRhdGlvbiA9IGZ1bmN0aW9uIChpZCkge1xyXG4gICAgJHNjb3BlLmRlbGV0ZUlkID0gaWQ7XHJcbiAgICAkKCcjdmFsaWRhdGlvbi1wb3B1cCcpLnNob3dNb2RhbCgpO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmRlbGV0ZUl0ZW0gPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICRodHRwLmdldCgnL2FkbWluX2NvbnRhY3QvZGVsZXRlX21lc3NhZ2UvJytpZCkuc3VjY2VzcyhcclxuICAgICAgZnVuY3Rpb24oZGF0YSlcclxuICAgICAge1xyXG4gICAgICAgIGlmIChkYXRhWydlcnJvciddID09ICcwJykge1xyXG4gICAgICAgICAgICAvL2RlbGV0ZUl0ZW1JbkFycmF5KGlkKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5pdGVtcyA9IF8uZmlsdGVyKCRzY29wZS5pdGVtcywgZnVuY3Rpb24oaXRlbSl7IHJldHVybiBpdGVtLmlkICE9IGlkIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCRzY29wZS5yZXN1bWUuaWQgPSBpZCkgeyAkc2NvcGUucmVzdW1lID0gJycgfTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUucmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGdldFRoZU1lc3NhZ2VzKCk7XHJcbiAgfVxyXG5cclxuICBnZXRUaGVNZXNzYWdlcygpO1xyXG5cclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5Db250YWN0cy5EaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdmb3Jtc0ZpZWxkcycsIGZ1bmN0aW9uKCl7XHJcbiAgLy8gUnVucyBkdXJpbmcgY29tcGlsZVxyXG4gIHJldHVybiB7XHJcbiAgICAvL3JlcXVpcmU6ICduZ01vZGVsJyxcclxuICAgIC8vdGVtcGxhdGU6ICd0ZXN0IHVwbG9hZCcsXHJcbiAgICAvLyBuYW1lOiAnJyxcclxuICAgIC8vIHByaW9yaXR5OiAxLFxyXG4gICAgLy8gdGVybWluYWw6IHRydWUsXHJcbiAgICAvLyBzY29wZToge1xyXG4gICAgLy8gICAgIHcgOiAnPXcnLFxyXG4gICAgLy8gICAgIGggOiAnPWgnLFxyXG4gICAgLy8gfSwgLy8ge30gPSBpc29sYXRlLCB0cnVlID0gY2hpbGQsIGZhbHNlL3VuZGVmaW5lZCA9IG5vIGNoYW5nZVxyXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdHJhbnNjbHVkZSwgJGh0dHAsICRzdGF0ZVBhcmFtcywgJG1vZGFsLCBGb3JtRmllbGRzUmVzcG9zaXRvcnkpIHtcclxuICAgICAgICBcclxuICAgICAgICAvLyBnZXN0aW9uIGRlcyBpbmZvcyBjb250YWN0XHJcblxyXG4gICAgICAgIHZhciBpZCA9ICRzdGF0ZVBhcmFtcy5pZDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0Rm9ybUZpZWxkcyAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgXHJcbiAgICAgICAgICBGb3JtRmllbGRzUmVzcG9zaXRvcnkuR2V0QWxsKGlkKVxyXG4gICAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICAgIGRhdGEgPSBkYXRhLml0ZW1zO1xyXG4gICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbihlbGVtZW50KXtcclxuICAgICAgICAgICAgICAgIGRhdGFbaV0ud2VpZ2h0ID0gcGFyc2VJbnQoZGF0YVtpXS53ZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgZGF0YVtpXS5pZCA9IHBhcnNlSW50KGRhdGFbaV0uaWQpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICRzY29wZS5mb3JtRmllbGRzID0gZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRGb3JtRmllbGRzKCk7XHJcblxyXG4gICAgICAgIC8vIGRyYWctbi1kcm9wXHJcblxyXG4gICAgICAgIC8qdmFyIGZvcm1GaWVsZHNTYW1wbGVzID0gW1xyXG4gICAgICAgICAge25hbWUgOiAndGV4dF9maWVsZCcsIGRpc3BsYXlfbmFtZSA6IFwiQ2hhbXAgdGV4dGVcIiwgZmllbGRfdHlwZSA6ICd0ZXh0J31cclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICAkc2NvcGUuZm9ybUZpZWxkc1NhbXBsZXMgPSBmb3JtRmllbGRzU2FtcGxlcy5zbGljZSgpO1xyXG4qL1xyXG4gICAgICAgICRzY29wZS5zb3J0YWJsZU9wdGlvbnMgPSB7XHJcbiAgICAgICAgICBjb25uZWN0V2l0aDogXCIuZm9ybS1wcmV2aWV3XCIsXHJcbiAgICAgICAgICBzdG9wOiBmdW5jdGlvbihlLCB1aSkgeyBcclxuICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICAvLyRzY29wZS5mb3JtRmllbGRzU2FtcGxlcyA9IGZvcm1GaWVsZHNTYW1wbGVzLnNsaWNlKCk7XHJcbiAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaCgkc2NvcGUuZm9ybUZpZWxkcywgZnVuY3Rpb24oIGl0ZW0gKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coaXRlbSk7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coaSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSAhPSBpdGVtLndlaWdodCApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIGl0ZW0ud2VpZ2h0ID0gaTtcclxuICAgICAgICAgICAgICAgICAgdXBkYXRlSXRlbShpdGVtKTtcclxuICAgICAgICAgICAgICAgICAgRm9ybUZpZWxkc1Jlc3Bvc2l0b3J5LlNhdmUoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgYXhpczogJ3knLFxyXG4gICAgICAgICAgcGxhY2Vob2xkZXI6IFwiYmVpbmdEcmFnZ2VkXCIsXHJcbiAgICAgICAgICB0b2xlcmFuY2U6ICdwb2ludGVyJyxcclxuICAgICAgICAgIHNlbGVjdG9yOiAnLml0ZW0nXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgIFxyXG5cclxuICAgICAgICAkc2NvcGUub3Blbk1vZGFsID0gZnVuY3Rpb24ob2JqZWN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGlmICghb2JqZWN0LnBhcmVudF9pZCkgeyBvYmplY3QucGFyZW50X2lkID0gaWQgfTtcclxuICAgICAgICAgICBpZiAoIW9iamVjdC53ZWlnaHQpIHsgb2JqZWN0LndlaWdodCA9ICRzY29wZS5mb3JtRmllbGRzLmxlbmd0aCB9O1xyXG5cclxuICAgICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9hZG1pbi92aWV3X2xvYWRlci8nK3RlbXBsYXRlRGlyKycvY29udGFjdHMvd2lkZ2V0cy9lZGl0X21vZGFsJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRGb3JtTW9kYWxDdHJsJyxcclxuICAgICAgICAgICAgc2l6ZTogJ2xnJyxcclxuICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgIGl0ZW06IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhbmd1bGFyLmNvcHkob2JqZWN0KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24ocmVzdWx0T2JqKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRGb3JtRmllbGRzKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIC8vIHJlcXVpcmU6ICduZ01vZGVsJywgLy8gQXJyYXkgPSBtdWx0aXBsZSByZXF1aXJlcywgPyA9IG9wdGlvbmFsLCBeID0gY2hlY2sgcGFyZW50IGVsZW1lbnRzXHJcbiAgICAvLyByZXN0cmljdDogJ0EnLCAvLyBFID0gRWxlbWVudCwgQSA9IEF0dHJpYnV0ZSwgQyA9IENsYXNzLCBNID0gQ29tbWVudFxyXG4gICAgLy8gdGVtcGxhdGU6ICcnLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcvYWRtaW4vdmlld19sb2FkZXIvJyt0ZW1wbGF0ZURpcisnL2NvbnRhY3RzL3dpZGdldHMvZm9ybXNfZmllbGRzJyxcclxuICAgIC8vIHJlcGxhY2U6IHRydWUsXHJcbiAgICAvLyB0cmFuc2NsdWRlOiB0cnVlLFxyXG4gICAgLy8gY29tcGlsZTogZnVuY3Rpb24odEVsZW1lbnQsIHRBdHRycywgZnVuY3Rpb24gdHJhbnNjbHVkZShmdW5jdGlvbihzY29wZSwgY2xvbmVMaW5raW5nRm4peyByZXR1cm4gZnVuY3Rpb24gbGlua2luZyhzY29wZSwgZWxtLCBhdHRycyl7fX0pKSxcclxuICAgIC8vIGxpbms6IGZ1bmN0aW9uKCRzY29wZSwgaUVsbSwgaUF0dHJzLCBjb250cm9sbGVyKSB7XHJcbiAgICAgIFxyXG4gICAgLy8gfVxyXG4gIH07XHJcbn0pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5Db250YWN0cy5EaXJlY3RpdmVzJykuZGlyZWN0aXZlKCdsYXN0TWVzc2FnZXMnLCBbJ0NvbnRhY3RzUmVwb3NpdG9yeScsIGZ1bmN0aW9uKGNvbnRhY3RzUmVwb3NpdG9yeSl7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRzY29wZToge30sXHJcblx0XHR0ZW1wbGF0ZVVybDogJy9hZG1pbi92aWV3X2xvYWRlci9kZXNrdG9wL2NvbnRhY3RzL3dpZGdldHMvbGFzdF9tZXNzYWdlcycsXHJcblx0XHRsaW5rOiBmdW5jdGlvbihzY29wZSwgaUVsbSwgaUF0dHIsIGNvbnRyb2xsZXIpXHJcblx0XHR7XHJcblx0XHRcdGZ1bmN0aW9uIGdldERhdGEoKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Y29udGFjdHNSZXBvc2l0b3J5Lmxhc3RNZXNzYWdlKGZ1bmN0aW9uKGRhdGEpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coZGF0YSk7XHJcblx0XHRcdFx0XHRzY29wZS5pdGVtcyA9IGRhdGEuaXRlbXM7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGdldERhdGEoKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkNvbnRhY3RzLkRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ3VucmVhZE1lc3NhZ2VzTmJyJywgWydDb250YWN0c1JlcG9zaXRvcnknLCAnJGludGVydmFsJywgZnVuY3Rpb24oY29udGFjdHNSZXBvc2l0b3J5LCAkaW50ZXJ2YWwpe1xyXG5cdC8vIFJ1bnMgZHVyaW5nIGNvbXBpbGVcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdC8vIG5hbWU6ICcnLFxyXG5cdFx0Ly8gcHJpb3JpdHk6IDEsXHJcblx0XHQvLyB0ZXJtaW5hbDogdHJ1ZSxcclxuXHRcdHNjb3BlOiB7fSwgLy8ge30gPSBpc29sYXRlLCB0cnVlID0gY2hpbGQsIGZhbHNlL3VuZGVmaW5lZCA9IG5vIGNoYW5nZVxyXG5cdFx0Ly8gY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdHJhbnNjbHVkZSkge30sXHJcblx0XHQvLyByZXF1aXJlOiAnbmdNb2RlbCcsIC8vIEFycmF5ID0gbXVsdGlwbGUgcmVxdWlyZXMsID8gPSBvcHRpb25hbCwgXiA9IGNoZWNrIHBhcmVudCBlbGVtZW50c1xyXG5cdFx0Ly8gcmVzdHJpY3Q6ICdBJywgLy8gRSA9IEVsZW1lbnQsIEEgPSBBdHRyaWJ1dGUsIEMgPSBDbGFzcywgTSA9IENvbW1lbnRcclxuXHRcdHRlbXBsYXRlOiAnPGRpdj48c3BhbiBjbGFzcz1cIm51bWJlclwiPnt7bWVzc2FnZXNOYnJ9fTwvc3Bhbj48YnIgLz48c21hbGw+Tm91dmVhdSh4KSBtZXNzYWdlKHMpPC9zbWFsbD48L2Rpdj4nLFxyXG5cdFx0Ly8gdGVtcGxhdGVVcmw6ICcnLFxyXG5cdFx0cmVwbGFjZTogdHJ1ZSxcclxuXHRcdC8vIHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHQvLyBjb21waWxlOiBmdW5jdGlvbih0RWxlbWVudCwgdEF0dHJzLCBmdW5jdGlvbiB0cmFuc2NsdWRlKGZ1bmN0aW9uKHNjb3BlLCBjbG9uZUxpbmtpbmdGbil7IHJldHVybiBmdW5jdGlvbiBsaW5raW5nKHNjb3BlLCBlbG0sIGF0dHJzKXt9fSkpLFxyXG5cdFx0bGluazogZnVuY3Rpb24oc2NvcGUsIGlFbG0sIGlBdHRycywgY29udHJvbGxlcikge1xyXG5cclxuXHRcdFx0ZnVuY3Rpb24gZ2V0RGF0YSgpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRjb250YWN0c1JlcG9zaXRvcnkudW5yZWFkTWVzc2FnZXNOYnIoZnVuY3Rpb24oZGF0YSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRzY29wZS5tZXNzYWdlc05iciA9IGRhdGEuY291bnQ7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGdldERhdGEoKTtcclxuXHJcblx0XHRcdHZhciBpbnRlcnZhbCA9ICRpbnRlcnZhbChmdW5jdGlvbigpe2dldERhdGEoKX0sIDMwMDAwKTtcclxuXHJcblx0XHRcdHNjb3BlLiRvbignJGRlc3Ryb3knLCBmdW5jdGlvbigpXHJcblx0XHRcdHtcclxuXHRcdFx0XHQkaW50ZXJ2YWwuY2FuY2VsKGludGVydmFsKTtcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHR9O1xyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkNvbnRhY3RzLlJlcG9zaXRvcmllcycpLmZhY3RvcnkoJ0NvbnRhY3RzUmVwb3NpdG9yeScsIFsnJGh0dHAnLCAnXycsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgdmFyIG1lc3NhZ2VzTGlzdENhY2hlID0gbmV3IEFycmF5KCk7XHJcbiAgdmFyIG1lc3NhZ2VEZXRhaWxzQ2FjaGUgPSBuZXcgQXJyYXkoKTtcclxuXHJcbiAgLy8gc3RvY2thZ2UgZGVzIGRvbm7DqWVzIHF1YW5kIG9uIHF1aXRlIGxhIHBhZ2VcclxuXHJcbiAgZnVuY3Rpb24gc3RvcmVEYXRhKGRhdGEpXHJcbiAge1xyXG4gICAgLy9hbGVydCgnb2snKTtcclxuICB9XHJcblxyXG5cdHJldHVybiB7IFxyXG4gICAgICAgICBtZXNzYWdlc0xpc3Q6IGZ1bmN0aW9uIChpc1NwYW0sIGNhbGxiYWNrLCBnZXRPbGQpIHsgXHJcblxyXG4gICAgICAgICAgdmFyIG1heF9pZCxcclxuICAgICAgICAgICAgICBvZmZzZXQsXHJcbiAgICAgICAgICAgICAgdXJsO1xyXG5cclxuICAgICAgICAgXHRcdC8vIHLDqWN1cMOocmUgY2UgcXVpIGV4aXN0ZSBkYW5zIGxlIGNhY2hlXHJcbiAgICAgICAgICAgIGlmIChtZXNzYWdlc0xpc3RDYWNoZS5sZW5ndGggPiAwICYmICFnZXRPbGQpIHtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhtZXNzYWdlc0xpc3RDYWNoZSk7XHJcbiAgICAgICAgICAgICAgbWF4X2lkID0gXy5tYXgobWVzc2FnZXNMaXN0Q2FjaGUsIGZ1bmN0aW9uKGl0ZW0peyByZXR1cm4gaXRlbS5pZCB9KTtcclxuICAgICAgICAgICAgICBtYXhfaWQgPSBtYXhfaWQuaWQ7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgaWYgKGdldE9sZCkge1xyXG4gICAgICAgICAgICBvZmZzZXQgPSBfLm1pbihtZXNzYWdlc0xpc3RDYWNoZSwgZnVuY3Rpb24oaXRlbSl7IHJldHVybiBpdGVtLmlkIH0pO1xyXG4gICAgICAgICAgICBvZmZzZXQgPSBvZmZzZXQuaWRcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgIHVybCA9IG1heF9pZCA/ICcvYWRtaW5fY29udGFjdC9tZXNzYWdlc19saXN0LycraXNTcGFtKyc/bWF4X2lkPScrbWF4X2lkIDogJy9hZG1pbl9jb250YWN0L21lc3NhZ2VzX2xpc3QvJytpc1NwYW0rJy81LycgKyBvZmZzZXQ7XHJcblxyXG4gICAgICAgICBcdFx0XHQvLyBvbiByw6ljdXDDqHJlIGwnaW5mbyBkdSBzZXJ2ZXVyXHJcbiAgICAgICBcdFx0XHQkaHR0cC5nZXQodXJsKVxyXG5cdFx0XHRcdCAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG5cdFx0XHRcdCAgICB7XHJcblxyXG4gICAgICAgICAgICAgIGRhdGEuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKVxyXG4gICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZW5kZXIgPSBfLmZpbmRXaGVyZShpdGVtLmZpZWxkc1swXSwge2ZpZWxkX25hbWUgOiAnRW1haWwnfSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnNlbmRlciA9IHNlbmRlciA/IHNlbmRlci5maWVsZF92YWx1ZSA6ICdJbmNvbm51JztcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzTGlzdENhY2hlLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG5cdFx0XHRcdCAgICBcdGNhbGxiYWNrKG1lc3NhZ2VzTGlzdENhY2hlLCBkYXRhLnRvdGFsX2l0ZW1zKTtcclxuICAgICAgICAgICAgICBzdG9yZURhdGEobWVzc2FnZXNMaXN0Q2FjaGUpO1xyXG4gICAgICAgICAgICAgIFxyXG5cdFx0XHRcdCAgICB9KTtcclxuICAgICAgICAgXHRcdFxyXG4gICAgICAgICB9LFxyXG5cclxuICAgICAgICAgc2VhcmNoSXRlbSA6IGZ1bmN0aW9uKGlzU3BhbSwgcXVlcnksIGNhbGxiYWNrLCBnZXRPbGQpXHJcbiAgICAgICAgIHtcclxuICAgICAgICAgIHZhciB1cmwsIFxyXG4gICAgICAgICAgICBvZmZzZXQ7XHJcblxyXG4gICAgICAgICAgaWYgKGdldE9sZCkge1xyXG4gICAgICAgICAgICBvZmZzZXQgPSBfLm1pbigkc2NvcGUuaXRlbXMsIGZ1bmN0aW9uKGl0ZW0peyByZXR1cm4gaXRlbS5pZCB9KTtcclxuICAgICAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0LmlkXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIHVybCA9ICcvYWRtaW5fY29udGFjdC9tZXNzYWdlc19saXN0LycraXNTcGFtKyc/cXVlcnk9JytxdWVyeTtcclxuXHJcbiAgICAgICAgICAkaHR0cC5nZXQodXJsKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICAgICAgICBkYXRhLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIHZhciBzZW5kZXIgPSBfLmZpbmRXaGVyZShpdGVtLmZpZWxkc1swXSwge2ZpZWxkX25hbWUgOiAnRW1haWwnfSk7XHJcbiAgICAgICAgICAgICAgaXRlbS5zZW5kZXIgPSBzZW5kZXIgPyBzZW5kZXIuZmllbGRfdmFsdWUgOiAnSW5jb25udSc7XHJcbiAgICAgICAgICAgICAgZGF0YS5pdGVtc1tpKytdID0gaXRlbTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICB9LFxyXG5cclxuICAgICAgICAgbWVzc2FnZURldGFpbHM6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAobWVzc2FnZURldGFpbHNDYWNoZVtpZF0pIFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sobWVzc2FnZURldGFpbHNDYWNoZVtpZF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICRodHRwLmdldCgnL2FkbWluX2NvbnRhY3QvbWVzc2FnZS8nK2lkKVxyXG4gICAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlRGV0YWlsc0NhY2hlW2lkXSA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICB9LFxyXG5cclxuICAgICAgICAgdW5yZWFkTWVzc2FnZXNOYnI6IGZ1bmN0aW9uKGNhbGxiYWNrKVxyXG4gICAgICAgICB7XHJcbiAgICAgICAgICAkaHR0cC5nZXQoJy9hZG1pbl9jb250YWN0L3VucmVhZF9tZXNzYWdlc19uYnInKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgZGF0YS5jb3VudCA9IHBhcnNlSW50KGRhdGEuY291bnQpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICBsYXN0TWVzc2FnZTogZnVuY3Rpb24oY2FsbGJhY2spXHJcbiAgICAgICAgIHtcclxuICAgICAgICAgICRodHRwLmdldCgnL2FkbWluX2NvbnRhY3QvbWVzc2FnZXNfbGlzdC8wLzIvMCcpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaSA9IDA7XHJcbiAgICAgICAgICAgIGRhdGEuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdmFyIHNlbmRlciA9IF8uZmluZFdoZXJlKGl0ZW0uZmllbGRzWzBdLCB7ZmllbGRfbmFtZSA6ICdFbWFpbCd9KTtcclxuICAgICAgICAgICAgICBpdGVtLnNlbmRlciA9IHNlbmRlciA/IHNlbmRlci5maWVsZF92YWx1ZSA6ICdJbmNvbm51JztcclxuICAgICAgICAgICAgICBkYXRhLml0ZW1zW2krK10gPSBpdGVtO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgIH1cclxuICAgICB9OyBcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5Db250YWN0cy5SZXBvc2l0b3JpZXMnKS5mYWN0b3J5KCdGb3JtRmllbGRzUmVzcG9zaXRvcnknLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG4gIHJldHVybiB7XHJcbiAgICBHZXRBbGwgOiBmdW5jdGlvbihwYXJlbnRJZClcclxuICAgIHtcclxuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FkbWluX2Zvcm1zL2ZpZWxkc19saXN0LycrcGFyZW50SWQpO1xyXG4gICAgfSxcclxuICAgIERlbGV0ZSA6IGZ1bmN0aW9uKGlkKVxyXG4gICAge1xyXG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYWRtaW5fZm9ybXMvZmllbGRfZGVsZXRlLycraWQpO1xyXG4gICAgfSxcclxuICAgIFNhdmUgOiBmdW5jdGlvbihkYXRhKVxyXG4gICAge1xyXG4gICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgIHVybDogJy9hZG1pbl9mb3Jtcy9maWVsZF9lZGl0JyxcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkNvbnRhY3RzLlJlcG9zaXRvcmllcycpLmZhY3RvcnkoJ0Zvcm1zUmVzcG9zaXRvcnknLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG4gIHJldHVybiB7XHJcbiAgICBHZXQgOiBmdW5jdGlvbihpZClcclxuICAgIHtcclxuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FkbWluX2Zvcm1zL2Zvcm1fZGV0YWlscy8nK2lkKTtcclxuICAgIH0sXHJcbiAgICBEZWxldGUgOiBmdW5jdGlvbihpZClcclxuICAgIHtcclxuICAgICAgcmV0dXJuICRodHRwLmdldCgnL2FkbWluX2Zvcm1zL2Zvcm1fZGVsZXRlLycraWQpO1xyXG4gICAgfSxcclxuICAgIFNhdmUgOiBmdW5jdGlvbihkYXRhKVxyXG4gICAge1xyXG4gICAgICByZXR1cm4gJGh0dHAoe1xyXG4gICAgICAgIHVybDogJy9hZG1pbl9mb3Jtcy9mb3JtX2VkaXQnLFxyXG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1dKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=