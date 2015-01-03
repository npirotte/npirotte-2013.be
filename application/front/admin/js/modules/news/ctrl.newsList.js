angular.module('Peaks.News').controller('NewsItemsListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){

  var config = {
    section : "news/items",
    menu : 'news',
    getUrl : '/admin_news/news_list/',
    deleteUrl : 'admin_news/delete_news/',
    getCallBack : function(data)
    {
        // traitement du statut utilisateur 
      var i = 0;

      angular.forEach($scope.items, function(item){
        if ($scope.items[i].published_on == null) {$scope.items[i].statut = 'warning'}
        else if (Date.parse($scope.items[i].published_on) > Date.parse(data.today)) {$scope.items[i].statut = 'info'}
        else if (Date.parse($scope.items[i].archived_on) <= Date.parse(data.today)) {$scope.items[i].statut = 'offline'}
        else {$scope.items[i].statut = 'success'}; 
        i++;
      });
    }
  }

  $scope.table = [
      {title : 'Titre', param : 'title'},
      {title : 'Catégorie', param : 'category_name'},
      {title : 'Auteur', param : 'created_by'}
    ];

  $scope.pageTitle = 'News';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});
  
}])