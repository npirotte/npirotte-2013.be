angular.module('Peaks.News').controller('NewsCategoriesEditCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams){

  $scope.section = "news/categories";
  menuControl('news');

  var id = $stateParams.id
  $scope.mode = id;

  var getThePage = function()
  {
    $http.get('/admin_news/get_category/'+id).success(function(data) {
      console.log(data);
      $scope.item = data.content_items;
      init_page();
    });
  }

  var getTheItems = function(limit, offset)
  {
    $http.get('/admin_news/category_childs/'+id +'/'+limit+'/'+offset).success(function(data) {
      $scope.totalItems = data.total_items;
      $scope.childs = data.items;
      init_page();
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
  };

  $scope.getView = function(id)
  {
    window.location.hash = '/news/items/'+id;
    block();
  }

  $scope.save = function () {

    $scope.alert = "Sauvegarde";
    showAlert();

    $http({
            url: '/admin_news/category_edit',
            method: "POST",
            data: $scope.item,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
              console.log(data);
                if (id == 'new' && data.errors.length === 0) { window.location.hash = '/news/categories/'+data.id; }
                else
                {
                   $scope.alert = data.message;
                   $scope.errors = data.errors;
                   showFadeAlert();
                  //formatStatut()
                }
            }).error(function (data, status, headers, config) {
                $scope.alert = 'Une erreure est survenue.';
                showFadeAlert();
                console.log(data);
            });
  }

  $scope.delete = function()
  {
    $scope.alert = 'Supression';
    showAlert();

    $http.get('/admin_news/category_delete/' + id).success(function(data)
    {
      window.location.hash = '/news/categories';
    });
  }

  if (id === 'new') {
    $scope.item = {};
    init_page();
  }
  else
  {
    getThePage();
    getTheItems($scope.itemPerPage, 0);
  }

}])