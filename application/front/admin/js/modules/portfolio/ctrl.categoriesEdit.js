angular.module('Peaks.Portfolio').controller('PortfolioCategoryEditCtrl', ['$scope', '$stateParams', 'PortfolioCategoriesRepository', 'TagsRespository', 'ScopeCacheProvider', 
  function($scope, $routeParams, portfolioCategoriesRepository, tagsRespository, scopeCacheProvider){

  menuControl('portfolio');

  $scope.backUrl = 'portfolio/categories';

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
    portfolioCategoriesRepository.getCategory(id, function(data)
    {
      $scope.item = data;
    });
  }

  $scope.save = function (returnToList) {
    $scope.alert = 'Sauvegarde ...';
    showAlert();

    portfolioCategoriesRepository.saveCategory($scope.item, function(data)
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
      portfolioCategoriesRepository.deleteCategory(id, function(data)
      {
        window.location.hash = '/portfolio/categories';
      });
    };
  }

  /*=======================================================
  =            Gestion du cache complet de vue            =
  =======================================================*/
  
/*  $scope.$on('$destroy', function() {
      alert("In destroy of:");
      scopeCacheProvider.Set('PortfolioCategories' + $scope.item.id, $scope);
  });
  */
  /*-----  End of Gestion du cache complet de vue  ------*/
  
  

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
}])