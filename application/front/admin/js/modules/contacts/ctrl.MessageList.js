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