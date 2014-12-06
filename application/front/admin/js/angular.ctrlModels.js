function ItemList($scope, $http, config)
{

  var orderprop,
      reverse = false,
      reorderQuery = '',
      searchQuery = '';

  $scope.reverse = false;

  $scope.section = config.section;
  menuControl(config.menu);

  var getTheItems = function(limit, offset)
  {
    var separator = reorderQuery == '' ? '?' : '&'
    $http.get(config.getUrl+limit+'/'+offset + reorderQuery + separator + searchQuery)
      .success(function(data)
      {
        $scope.items = data.items;
        $scope.totalItems = data.total_items;

       if (typeof config.getCallBack === 'function') { config.getCallBack(data) }

        init_page();
      })
      .error(function(data)
      {
        console.log(data);
      });
  }

  // pagination
  
  $scope.currentPage = 0;
  $scope.maxSize = 5;
  $scope.itemPerPage = 20;
  $scope.offset = 0;

  $scope.setGetPage = function (pageNo) {
    $scope.currentPage = pageNo;
    $scope.offset = $scope.currentPage * $scope.itemPerPage - $scope.itemPerPage;
    getTheItems($scope.itemPerPage, $scope.offset);
  }

  // helpers

  $scope.getView = function(id)
  {
    window.location.hash = '/'+$scope.section+'/edit/'+id;
    block();
  }

  $scope.validation = function (id) {
    $scope.deleteId = id;
    $('#validation-popup').showModal();
  }

  $scope.deleteItem = function (deleteId) {
   /* if (bootbox.confirm('Etes vous sur de vouloir supprimer cet élément ?')) {
      $http.get(config.deleteUrl+deleteId).success(function(data) {
         getTheItems($scope.itemPerPage, $scope.offset);
      });
    };*/
    bootbox.confirm('Etes vous sur de vouloir supprimer cet élément ?', function(invoke)
    {
      if (invoke) {
        $http.get(config.deleteUrl+deleteId).success(function(data) {
           getTheItems($scope.itemPerPage, $scope.offset);
        });
      };
    })
  }

  $scope.reorder = function (col)
  {
    if (orderprop != col) 
    {
      orderprop = col;
      $scope.orderprop = orderprop;
      reverse = false;
    }
    else 
    {
      reverse = !reverse;
      $scope.reverse = reverse;
    }

    reorderQuery = '?orderprop=' + orderprop + '&reverse=' + reverse;

    getTheItems($scope.itemPerPage, 0);
  }

  $scope.search = function()
  {
    searchQuery = 'search=' + $scope.query;

    getTheItems($scope.itemPerPage, 0);
  }

  getTheItems($scope.itemPerPage, 0);

}