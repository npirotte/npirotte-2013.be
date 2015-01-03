angular.module('Peaks.Pages').controller('PageEditCtrl', ['$rootScope', '$scope', '$stateParams', 'PagesRepository', 'TemplatesRepository','TagsRespository', 'GroupsRepository', '_', 
	function($rootScope, $scope, $stateParams, pagesRepository, templatesRepository, tagsRepository, groupsRepository, _){

 init_page();
  menuControl('pages');
  $scope.section = 'pages/pages';

  var id = $stateParams.pageId;
  $scope.mode =  id;

  var templateValues,
      saveIsBuzy = false;

  $scope.tinymceOptions = tinymceConfig;

  $scope.aceLoaded = function(_editor)
  {
     aceeditorConfig(_editor);
  };

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

  tagsRepository.tagNamesList(function(data)
  {
    $scope.select2Tags.tags = data;
  });

  // watchers
  $scope.$watch('item.lang', function(newValue)
  {
     pagesRepository.getPageList(newValue, function(data)
    {
      // on ajoute le niveau 0 : root
      $scope.pagesList = new Array();
      $scope.pagesList.push({id : 0, name : 'root'});
      $scope.pagesList = $scope.pagesList.concat(data['items']);
    });
  });

  function getItem(getTemplateValues)
  {
    pagesRepository.getPage(id, function(data)
    {
      $scope.item = data.page_data;

      var userGroups = data.page_data.user_groups.split(',');

      $scope.userGroups = [];
      groupsRepository.GetGroups(function(data)
      {
        $scope.userGroups = data; 
        angular.forEach(data, function(item)
        {
          item.checked = _.indexOf(userGroups, item.id) >= 0;
        });   
      });

      if (data.page_data.type === 'template' && getTemplateValues) {
        templatesRepository.getTemplateFields(data.page_data.template, function(data_sub)
          {
            var i = 0;
            data_sub.forEach(function(templateField)
            {
              var fieldValue = _.findWhere(data.template_values, {field_name : templateField.full_name});
              if (fieldValue) {
                data_sub[i++].fieldValue = _.findWhere(data.template_values, {field_name : templateField.full_name}).value;
              };
            });

            $scope.templateFields = data_sub;
          });
      };
    })
  }

  function autoGenerateSlug()
  { 
    $scope.$watch("item.name", function (newValue) {
      if($scope.editForm.slug.$pristine)
      {
        $scope.item.slug = friendly_url(newValue);
      }
    });
  }

  templatesRepository.getTemplateFiles(function(data)
  {
    $scope.templateFiles = data;
  });

  templatesRepository.getTemplates(function(data)
  {
    $scope.templates = data.items;
  });

  $scope.getTemplateFields = function()
  {
    if ($scope.item.type === 'template') {
      templatesRepository.getTemplateFields($scope.item.template, function(data)
      {
        $scope.templateFields = data;
      });
    };
  }

  $scope.save = function(returnToList)
  {

    if (!saveIsBuzy) {

      saveIsBuzy = true;
      broadcast = false;
      $scope.alert = 'Sauvegarde ...';
      showAlert();

      if ($scope.item.type === 'file') {
        $scope.templateFields = false;
      };

      $scope.item.user_groups = '';

      angular.forEach($scope.userGroups, function(group){
        if (group.checked) {
          $scope.item.user_groups += group.id + ',';
        };
      });

      $scope.item.user_groups = $scope.item.user_groups.substring(0, $scope.item.user_groups.length-1);

      console.log($scope.userGroups);

      if (id != 'new' && ($scope.item.parent_id != $scope.item.cache.parent_id || $scope.item.weight != $scope.item.cache.weight)) {
        broadcast = true;
      };

      console.log( $scope.item);
      pagesRepository.savePage($scope.item, $scope.templateFields, function(data)
        {
          saveIsBuzy =  false;
          
          if (returnToList && data.errors.length === 0) {
            window.location.hash = '/pages/pages';
          }
          else if (id == 'new' && data.errors.length === 0)
          {
            window.location.hash = '/pages/pages/edit/' + data.id;
          }
          else
          {
            $scope.alert = data.message;
            $scope.errors = data.errors;

            if (data.error == 0) {
               $scope.item.version = data.version;
               getItem();

               // brodcast de la mise à jour des template
               if (broadcast) {
                 $rootScope.$broadcast('siteMapUpdatedByPageCtrl');
               };
            };

            showFadeAlert();
          }
        });

    };
    
  }

  $scope.delete = function()
  {
    if (confirm('Etes vous sur de vouloir supprimer la page "'+ $scope.item.name + '" ?')) {
      pagesRepository.deletePage($scope.item.id, function(data)
      {
        window.location.hash = '/pages/pages';
      });
    };
  }

  if (id != 'new') {

    // catch des broadcasts
    $scope.$on('siteMapUpdatedBySiteMap', function(data) {
        pagesRepository.getPageOrder($scope.item.id, function(pageOrder)
        {
          if ($scope.item.cache.parent_id != pageOrder.parent_id) {
            $scope.item.cache.parent_id = pageOrder.parent_id;
            $scope.item.parent_id = pageOrder.parent_id
          };

          if ($scope.item.cache.weight != pageOrder.weight) {
            $scope.item.cache.weight = pageOrder.weight;
            $scope.item.weight = pageOrder.weight
          };

        });
    });

    getItem(true);
  }
  else
  {
    //$scope.item;
    autoGenerateSlug();

    
      console.log($rootScope.newItem);
      if ($scope.newItem) {
        $scope.item = $rootScope.newItem;
        $scope.item.meta_keywords = new Array();
        $rootScope.newItem = undefined;
      }
      else
      {
        $scope.item = {
          meta_keywords : new Array()
        };
      }
  }
	
}])