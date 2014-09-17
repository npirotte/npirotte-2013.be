//angular

function PortfolioListCtrl($scope, $http, $injector)
{

  var config = {
    section : "portfolio/portfolios",
    menu : 'portfolio',
    getUrl : '/admin_portfolio/portfolio_list/',
    deleteUrl : 'admin_portfolio/delete/'
  }

  $scope.table = [
      {title: '', param : 'src', width: '60px'},
      {title : 'Titre', param : 'name', strong : true},
      {title : 'Nombre d\éléments', param : 'childs_count'}
    ];

  $scope.pageTitle = 'Galleries';
  $scope.thumbPath = 'portfolio';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}


function PortfolioEditCtrl($scope, $http, $routeParams,porfolioCategoriesRepository, porfolioItemsRepository, tagsRespository) {

  $scope.section = "portfolio/portfolios";
  menuControl('portfolio');

  $scope.tinymceOptions = tinymceConfig;

  init_page();

  var id = $routeParams.id;
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

  porfolioCategoriesRepository.categoriesList(function(categories)
  {
    console.log(categories);
    $scope.categories = categories.items;
  });

  $scope.createNewCategoty = function ()
  {
    $scope.alert = 'Création de la catégories';
    showAlert();
    porfolioCategoriesRepository.saveCategory($scope.newCategory, function(data)
    {
      $scope.categories.push({id:data.id, name: data.name});
      $scope.alert = data.message;
      showFadeAlert();
    });
  }

  var getTheItem = function(){
    porfolioItemsRepository.getItem(id, function(data)
    {
          
      var temp = {};

      angular.forEach(data.categories, function(category)
      {
        temp[category.parent_id] = true;
      });

      data.categories = temp;

      $scope.item = data;

    });
  }

  $scope.save = function (returnToList) {

    $scope.alert = 'Sauvegarde…';
    showAlert();

    porfolioItemsRepository.saveItem($scope.item, function(data)
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
    for (var i = globalVars.siteLangages.length - 1; i >= 0; i--) {
      $scope.item['meta_keywords_'+globalVars.siteLangages[i]];
    };
  }
}


// catégories


function PortfolioCategoriesCtrl($scope, $http, $injector)
{

  var config = {
    section : "portfolio/categories",
    menu : 'portfolio',
    getUrl : '/admin_portfolio/categories_list/',
    deleteUrl : 'admin_portfolio/category_delete/'
  }

  $scope.table = [
      {title : 'Titre', param : 'name_' + globalVars.defaultLanguage, strong : true},
      {title : 'Ordre', param : 'weight'},
      {title : 'Nombre d\éléments', param : 'childs_count'}
    ];

  $scope.pageTitle = 'Catégories de porfolios';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});

}


function PortfolioCategoriesEditCtrl($scope, $http, $routeParams, porfolioCategoriesRepository, tagsRespository) {

  menuControl('portfolio');

  $scope.backUrl = 'portfolio/categories/';

  init_page();

  var id = $routeParams.id;
  $scope.mode =  id;

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


  var getTheItem = function(){
    porfolioCategoriesRepository.getCategory(id, function(data)
    {
      $scope.item = data;
    });
  }

  $scope.save = function (returnToList) {
    $scope.alert = 'Sauvegarde ...';
    showAlert();

    porfolioCategoriesRepository.saveCategory($scope.item, function(data)
    {
        if (returnToList && data.errors.length === 0) {
          window.location.hash = '/portfolio/categories';
        }
        else if (id === 'new' && data.errors.length === 0)
        {
          window.location.hash = '/portfolio/categories/edit/' + data.id;
        }
        else
        {
          $scope.alert = data.message;
          $scope.errors = data.errors;
          showFadeAlert();
        }
    });
  }

  $scope.delete = function () {
    if (confirm('Etes vous sur de vouloir supprimer cette catégories ?')) 
    {
      porfolioCategoriesRepository.deleteCategory(id, function(data)
      {
        window.location.hash = '/portfolio/categories';
      });
    };
  }

  if ($scope.mode != 'new') {
    getTheItem();
  } 
  else {
    $scope.hideForNew = true;
    $scope.item = {
        //meta_keywords : new Array()
      };
    for (var i = globalVars.siteLangages.length - 1; i >= 0; i--) {
      $scope.item['meta_keywords_'+globalVars.siteLangages[i]];
    };
  }
}

