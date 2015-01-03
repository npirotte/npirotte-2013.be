angular.module('Peaks.Portfolio').controller('PortfolioEditCtrl', ['$scope', '$http', '$stateParams', 'PortfolioCategoriesRepository', 'PortfolioItemsRepository', 'TagsRespository',function($scope, $http, $stateParams, portfolioCategoriesRepository, portfolioItemsRepository, tagsRespository){
  
  $scope.section = "portfolio/portfolios";
  menuControl('portfolio');

  $scope.tinymceOptions = tinymceConfig;

  init_page();

  var id = $stateParams.id;
  $scope.mode =  id;

  $scope.editHide = true;
  $scope.editShow = false;

  $scope.uploader = {
    w : 300,
    h : 300,
    item_id : id,
    folder : 'assets/images/portfolio/'+id+'/thumbs/',
    assetPath : 'portfolio~'+id+'~thumbs',
    crop : 1,
    uniqueName : true
  }

  $scope.assetsList = {
    folder : 'assets/images/portfolio/'+id+'/',
    assetPath : 'portfolio~'+id,
    parentIdentity : 'portfolio_item'
  }

  $scope.select2Tags = {
      'multiple': true,
      'simple_tags': true,
      //'tags': true,  // Can be empty list.
      'tokenSeparators' : [","],
      initSelection : function(element)
      {
        console.log(this);
      }
  };

  tagsRespository.tagNamesList(function(data)
  {
    $scope.select2Tags.tags = data;
  });

  portfolioCategoriesRepository.categoriesList(function(categories)
  {
    console.log(categories);
    $scope.categories = categories.items;
  });

  $scope.createNewCategoty = function ()
  {
    $scope.alert = 'Création de la catégories';
    showAlert();
    portfolioCategoriesRepository.saveCategory($scope.newCategory, function(data)
    {
      $scope.categories.push({id:data.id, name: data.name});
      $scope.alert = data.message;
      showFadeAlert();
    });
  }

  var getTheItem = function(){
    portfolioItemsRepository.getItem(id, function(data)
    {
          
      var temp = {};

      angular.forEach(data.categories, function(category)
      {
        temp[category.parent_id] = true;
      });

      data.categories = temp;

      $scope.item = data;

      console.log($scope.item);

    });
  }

  $scope.save = function (returnToList) {

    $scope.alert = 'Sauvegarde…';
    showAlert();

     console.log($scope.item);

    portfolioItemsRepository.saveItem($scope.item, function(data)
    {
        if (returnToList && data.errors.length === 0) {
          window.location.hash = '/portfolio/portfolios';
        }
        else if (id === 'new' && data.errors.length === 0)
        {
          window.location.hash = '/portfolio/portfolios/edit/' + data.id;
        }
        else
        {
          $scope.alert = data.message;
          $scope.errors = data.errors;
          showFadeAlert();
          getTheItem();
        }
    });   
  }

  $scope.delete = function () {
    bootbox.confirm('Etes vous sur de vouloir supprimer cet élément ?', function(invoke)
    {
      if (invoke) {
        $http.get('/admin_portfolio/delete/'+id).success(function(data) {
          window.location.hash = '/portfolio/portfolios';
        });
      };
    });
  }

  if ($scope.mode != 'new') {
    getTheItem();
  } 
  else {
    $scope.hideForNew = true;
    $scope.item = {
      //'meta_keywords' : {},
      'categories' : {}
    };
/*    console.log(globalVars.siteLanguages.length);
    for (var i = globalVars.siteLangages.length - 1; i >= 0; i--) {
      $scope.item['meta_keywords_'+globalVars.siteLangages[i]];
    };*/
    angular.forEach(globalVars.siteLangages, function(lang)
    {
      $scope.item['meta_keywords_'+lang] = [];
    }); 
  }	
}])