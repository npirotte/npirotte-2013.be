angular.module('Peaks.Pages', ['Peaks.Manager.Repositories', 'Peaks.Pages.Services', 'Peaks.Pages.Directives', 'Peaks.Pages.Repositories']);
angular.module('Peaks.Pages.Services', []);
angular.module('Peaks.Pages.Directives', []);
angular.module('Peaks.Pages.Repositories', [])
angular.module('Peaks.Pages').controller('MenuEditCtrl', ['$scope', '$stateParams', 'MenusMenusRepository', function($scope, $stateParams, menusMenusRepository){
  menuControl('pages');
  $scope.backUrl = "pages/menus";

  var id = $stateParams.id
  $scope.mode = id;

  var getThePage = function(getTheChilds)
  {
    menusMenusRepository.GetItem(id, function(data)
    {
      $scope.item = data;
      init_page();

      if (getTheChilds) {
        
      };
    });
  }

  $scope.save = function(returnToList)
  {
    $scope.alert = 'Sauvegarde';
    showAlert();

    menusMenusRepository.SaveItem($scope.item, function(data)
    {

      if (returnToList && data.errors.length === 0) {
        window.location.hash = $scope.backUrl;
      }
      else if (id == 'new' && data.errors.length === 0)
      {
        window.location.hash = $scope.backUrl + '/edit/' + data.id;
      }
      else
      {
        $scope.alert = data.message;
        $scope.errors = data.errors;
        if(data.errors.length === 0) getThePage();
      }

      showFadeAlert();
    });
  }

  $scope.delete = function()
  {
    menusMenusRepository.DeleteItem(id, function(data)
      {
        window.location.hash = $scope.backUrl;
      });
  }


  if (id === 'new') {
    $scope.item = {
      name : '',
      cssclass : ''
    }
    init_page();
  }
  else
  {
    getThePage();
  }
}])
angular.module('Peaks.Pages').controller('MenusListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
  var config = {
    section : "pages/menus",
    menu : 'pages',
    getUrl : '/admin_menus/menus_list/',
    deleteUrl : 'admin_menus/menu_delete/',
    getCallBack : function(data)
    {}
  }

  $scope.table = [
      {title : 'Nom', param : 'name', strong : true}
    ];

  $scope.pageTitle = 'Menu';

  $scope.thumbPath = '';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});	
}])
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
angular.module('Peaks.Pages').controller('PageListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
  var config = {
    section : "pages/pages",
    menu : 'pages',
    getUrl : '/admin_pages/pages_list/',
    deleteUrl : 'admin_pages/pages_delete/'
  }

  $scope.table = [
      {title : 'Nom', param : 'name', strong : true},
      {title: 'Langue', param : 'lang'},
      {title: 'Versions', param : 'version'}
    ];

  $scope.pageTitle = 'Pages';

  $scope.thumbPath = 'users~thumbs';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});
}])
angular.module('Peaks.Pages').controller('TemplateEditCtrl', ['$scope', '$http', '$stateParams', 'TemplatesRepository', function($scope, $http, $stateParams, templatesRepository){
 init_page();
  $scope.section = "pages/templates";
  menuControl('pages');

  var id = $stateParams.id;
  $scope.mode =  id;

  function getItem()
  {
    templatesRepository.getTemplate(id, function(data)
    {
      $scope.item = data;
    })
  }

  templatesRepository.getTemplateFiles(function(data)
  {
    $scope.templateFiles = data;
  });

  $scope.aceConfig = {
    useWrapMode : true,
    showGutter: true,
    theme:'twilight',
    mode: 'html',
    onLoad: aceLoaded
  }

  function aceLoaded(_editor)
  {
    console.log(_editor);
    _editor.setReadOnly(true);
    ace.require("ace/ext/emmet");
    ace.require("ace/ext/language_tools");
    _editor.setOptions({
        enableBasicAutocompletion: true,
        enableEmmet: true,
        enableSnippets: true,
    });
  }

  $scope.save = function(returnToList)
  {
    $scope.alert = 'Sauvegarde';
    showAlert();

    templatesRepository.saveTemplate($scope.item, function(data)
    {

      if (returnToList && data.errors.length === 0) {
        window.location.hash = '/pages/templates';
      }
      else if (id == 'new' && data.errors.length === 0)
      {
        window.location.hash = '/pages/templates/edit/' + data.id;
      }
      else
      {
        $scope.alert = data.message;
        $scope.errors = data.errors;
      }

      showFadeAlert();
    });
  }

  $scope.delete = function()
  {
    templatesRepository.deleteTemplete(id, function(data)
      {
        window.location.hash = $scope.section;
      });
  }

  if (id != 'new') {
    getItem();
  };
}])
angular.module('Peaks.Pages').controller('TemplatesListCtrl', ['$scope', '$http', '$injector', function($scope, $http, $injector){
  var config = {
    section : "pages/templates",
    menu : 'pages',
    getUrl : '/admin_pages/templates_list/',
    deleteUrl : 'admin_pages/templates_delete'
  }

  $scope.table = [
      {title : 'Nom', param : 'name'},
    ];

  $scope.pageTitle = 'Templates';

  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});
}]);
angular.module('Peaks.Pages.Directives').directive('menusItemsPanel', ['MenusItemsRepository', 'UrlService', function(menusItemsRepository, urlService){
  // Runs during compile
  return {
    // name: '',
    // priority: 1,
    // terminal: true,
    scope: { menuId : '=menuId'}, // {} = isolate, true = child, false/undefined = no change
    controller: function($scope, $element, $attrs, $transclude) {

      var runing = false;

      $scope.urlOptions = [];

      function getItem(id)
      {
        menusItemsRepository.GetItem(id, function(data)
        {
          data.target = data.target == 1 ? true : false;
          $scope.item = data;
        })
      }

      $scope.getItem = function(id) { getItem(id) };

      function resetItem(parentId)
      {
        $scope.item = {
          menu_id : $scope.menuId,
          parent_id : parentId ? parentId : null
        }

        $scope.urlOptions = [];

        $scope.itemForm.$setPristine();
      }

      function getItemList()
      {
        menusItemsRepository.GetItemsTree($scope.menuId, function(data)
        {
          $scope.itemsTree = data;
        });
        menusItemsRepository.GetItems($scope.menuId).then(function(result)
        {
          $scope.itemsList = result.data.items;
        });
      }

      getItemList();

      $scope.resetItem = function() { resetItem() };
      
      $scope.save = function(endEdit)
      {
        if(runing) return false;

        runing = true;
        if (!$scope.item.menu_id) {
          $scope.item.menu_id = $scope.menuId;
        };
        console.log('run');
        menusItemsRepository.SaveItem($scope.item, function(data)
        {
          runing = false;
          if (data.errors.length === 0) {
            endEdit ? resetItem() : getItem(data.id);
            getItemList();
          };
        });
      }

      $scope.newSubItem = function(parentId)
      {
        resetItem(parentId);
      }

      $scope.deleteItem = function(id, reset)
      {
        bootbox.confirm('Etes vous sur de vouloir supprimer cet élément ?', function(invoke)
        {
          if (invoke) 
          {
            menusItemsRepository.DeleteItem(id, function()
            {
              getItemList();
              if (reset) resetItem();
            });
          }
        });
      }

      $scope.$watch('item.module', function(newValue)
      {
        $scope.urlOptions.UrlFunctions = urlService.GetFunctions(newValue);
        /*if ($scope.item) {
          $scope.item.function = $scope.item.module === 'pages' ? 'page' : null;
        };*/
      });

      $scope.$watch('item.function', function(newValue)
      {
        if ($scope.item) {
          urlService.GetElements($scope.item.module, newValue, function(data)
          {
            console.log(data);
            $scope.urlOptions.UrlElements = data;
          });
        };
      });

      $scope.treeOptions = {
        dropped: function(event) {
            var data = {},
              parentChildsList;

            try 
            {
              data.parent_id = event.dest.nodesScope.$nodeScope.$modelValue.id;
            }
            catch(e)
            {
              data.parent_id = 0;
            }

            try 
            {
              data.old_parent_id = event.source.nodesScope.$nodeScope.$modelValue.id;
            }
            catch(e)
            {
              data.old_parent_id = 0;
            }

            data.new_index = event.dest.index;

            parentChildsList = event.dest.nodesScope.$modelValue;
            data.id = parentChildsList[data.new_index].id;
            data.menu_id = $scope.menuId;

            if (event.source.index != data.new_index || data.parent_id != data.old_parent_id) {

              menusItemsRepository.ReorderItem(data, function()
              {
              });

            };

            return true;
        },
      }
    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    //template: '<a href="#manager/comptes/edit/{{userId}}" >{{user.first_name}} {{user.last_name}}</a>',
    templateUrl: '/admin/view_loader/desktop/menus/items/edit',
    replace: false,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    //link: function($scope, iElm, iAttrs, controller) {}
  };
}]);
angular.module('Peaks.Pages.Directives').directive('pagesSiteMap', ['PagesRepository', function(pagesRepository){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		scope: { currentId : "=current"}, // {} = isolate, true = child, false/undefined = no change
		/*controller: function($scope, $element, $attrs, $transclude) {
		},*/
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		//restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		//template: '<ul><li ng-repeat="node in siteMap">node.title</li></ul>',
		templateUrl: '/admin/view_loader/desktop/shared/widgets/tree',
		//replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		controller: function($rootScope, $scope, $element, $attrs, $transclude) {

			$scope.smallSize = 'small-size';

			function languagesMap(languages)
			{
				var result = {}
				for (var key in languages) {
					result[key] = { KeyName : key, LangName : languages[key]}
				}

				return result;
			}

			$scope.languages = languagesMap(globalVars.siteLanguages);
			$scope.treeCulture = globalVars.defaultLanguage;

			$scope.remove = function(scope) {
		      scope.remove();
		    };

		    $scope.toggle = function(scope) {
		      scope.toggle();
		    };

		    $scope.newSubItem = function(id) {
		      $rootScope.newItem = {parent_id : id, lang : 'fr'};
		      window.location.hash = '/pages/pages/edit/new';
		      console.log(id);
		    };

		    $scope.getPage = function(id)
		    {
		    	window.location.hash = '/pages/pages/edit/' + id;
		    }

		    var getRootNodesScope = function() {
		      return angular.element(document.getElementById("tree-root")).scope();
		    };

		    $scope.collapseAll = function() {
		      var scope = getRootNodesScope();
		      scope.collapseAll();
		    };

		    $scope.expandAll = function() {
		      var scope = getRootNodesScope();
		      scope.expandAll();
		    };

		    $scope.treeOptions = {
			    dropped: function(event) {
			    	var data = {},
			    		parentChildsList;

			    	try 
			    	{
			    		data.parent_id = event.dest.nodesScope.$nodeScope.$modelValue.id;
			    	}
			    	catch(e)
			    	{
			    		data.parent_id = 0;
			    	}

			    	try 
			    	{
			    		data.old_parent_id = event.source.nodesScope.$nodeScope.$modelValue.id;
			    	}
			    	catch(e)
			    	{
			    		data.old_parent_id = 0;
			    	}

			    	data.new_index = event.dest.index;

			    	parentChildsList = event.dest.nodesScope.$modelValue;
			    	data.item_id = parentChildsList[data.new_index].id;

			    	data.lang = 'fr';

			    	if (event.source.index != data.new_index || data.parent_id != data.old_parent_id) {

			    		pagesRepository.reorder(data, function()
			    		{
			    			$rootScope.$broadcast('siteMapUpdatedBySiteMap');
			    		});

			    	};
			    	//console.log(parentChildsList);
			    	
			    	//console.log(data);

			      return true;
			    },
			  };


		  function getData()
		  {
		  	pagesRepository.siteMap($scope.treeCulture, function(data)
		  	{
		  		$scope.data = data;
		  	})
		  }

		  $scope.$watch('treeCulture', function(newValue)
		  {
		  	getData();
		  });

		  getData();

		  $scope.$on('siteMapUpdatedByPageCtrl', function() {
		      getData();
		  });
		}
	};
}]);
angular.module('Peaks.Pages.Repositories' ).factory('MenusItemsRepository', ['$http', function($http){

  return { 
    GetItemsTree : function(menuId, callback)
    {
      $http.get('/admin_menus/items_list/'+menuId + '/true')
          .success(function(data)
          {
            callback (data);
          });
    },
    GetItems : function(menuId)
    {
      return $http.get('/admin_menus/items_list/' + menuId);
    },
  	GetItem : function(id, callback)
  	{
      $http.get('/admin_menus/item_details/'+id)
          .success(function(data)
          {
            callback (data);
          });
  	},
  	SaveItem : function(data, callback)
  	{
      $http({
          url: '/admin_menus/item_edit',
          method: "POST",
          data: data,
          headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {
              console.log(data);
              callback(data);
          }).error(function (data, status, headers, config) {
              alert = 'Une erreure est survenue.';
          });
  	},
    ReorderItem : function(data, callback)
    {
      $http({
          url: '/admin_menus/item_reorder',
          method: "POST",
          data: data,
          headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {
              console.log(data);
              callback(data);
          }).error(function (data, status, headers, config) {
              alert = 'Une erreure est survenue.';
          });
    },
  	DeleteItem : function(id, callback)
  	{  
      $http.get('/admin_menus/item_delete/'+id)
          .success(function(data)
          {
            callback (data);
          });
  	}
  }

 }]);
angular.module('Peaks.Pages.Repositories' ).factory('MenusMenusRepository', ['$http', function($http){

  return { 
  	GetItem : function(id, callback)
  	{
      $http.get('/admin_menus/menu_details/'+id)
          .success(function(data)
          {
            callback (data);
          });
  	},
  	SaveItem : function(data, callback)
  	{
      $http({
          url: '/admin_menus/menu_edit',
          method: "POST",
          data: data,
          headers: {'Content-Type': 'application/json'}
      }).success(function (data, status, headers, config) {
              console.log(data);
              callback(data);
          }).error(function (data, status, headers, config) {
              alert = 'Une erreure est survenue.';
          });
  	},
  	DeleteItem : function(id, callback)
  	{
      $http.get('/admin_menus/menu_delete/'+id)
          .success(function(data)
          {
            callback (data);
          });
  	}
  }

 }]);
angular.module('Peaks.Pages.Repositories' ).factory('PagesRepository', ['$http', function($http){

  return { 
    getPage : function(id, callback)
    {
      $http.get('/admin_pages/pages_details/'+id).success(function(data)
        {
          callback(data);
        });
    },    
    savePage : function(page_data, template_values, callback)
    {
      var data = {};

      data.page_data = page_data;

      if (page_data.type === 'template') {
        data.template_values = template_values;
      };

       $http({
            url: '/admin_pages/page_edit',
            method: "POST",
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
                console.log(data);
                callback(data);
            }).error(function (data, status, headers, config) {
                alert = 'Une erreure est survenue.';
            });
    },
    deletePage : function(id, callback)
    {
      $http.get('/admin_pages/pages_delete/' + id).success(function(data)
      {
        callback(data);
      });
    },
    reorder : function(data, callback)
    {
      $http({
            url: '/admin_pages/page_reorder',
            method: "POST",
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
                callback();
                console.log(data);
            }).error(function (data, status, headers, config) {
                alert = 'Une erreure est survenue.';
            });
    },
    getPageOrder : function(id, callback)
    {
      $http.get('/admin_pages/get_page_order/' + id).success(function(data)
      {
        console.log(data);  
        callback(data);
      })
    },
    getPageList : function(lang, callback)
    {
      $http.get('/admin_pages/pages_list/0/0/' + lang).success(function(data)
      {
        console.log(data);  
        callback(data);
      })
    },
    siteMap : function(lang, callback)
    {
      $http.get('/admin_pages/site_map/'+lang).success(function(data)
      {
        callback(data);
      });
    }
  }; 
}]);
angular.module('Peaks.Pages.Repositories').factory('TemplatesRepository', ['$http', function($http){

	var templatesCache = new Array();

	return { 
    getTemplate : function(id, callback)
    {
      $http.get('/admin_pages/templates_details/'+id).success(function(data)
        {
          callback(data);
        });
    },
    getTemplateFiles : function(callback)
    {
      $http.get('/admin_pages/template_files_list').success(function(data)
      {
        callback(data);
      })
    },
    getTemplates : function(callback)
    {
      $http.get('./admin_pages/templates_list').success(function(data)
      {
        callback(data);
      });
    },
    saveTemplate : function(data, callback)
    {
       $http({
            url: '/admin_pages/templates_edit',
            method: "POST",
            data: data,
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
                console.log(data);
                callback(data);
            }).error(function (data, status, headers, config) {
                alert = 'Une erreure est survenue.';
            });
    },
    deleteTemplete : function(id, callback)
    {
      $http.get('/admin_pages/templates_delete/' + id).success(function(data)
      {
        callback(data);
      })
    },
    getTemplateFields : function(id, callback)
    {
      $http.get('/admin_pages/templates_fields_list/' + id).success(function(data)
      {
        callback(data);
      });
    }
  }; 
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9wYWdlcy5tb2R1bGUuanMiLCJjdHJsLm1lbnVFZGl0LmpzIiwiY3RybC5tZW51c0xpc3QuanMiLCJjdHJsLnBhZ2VFZGl0LmpzIiwiY3RybC5wYWdlc0xpc3QuanMiLCJjdHJsLnRlbXBsYXRlRWRpdC5qcyIsImN0cmwudGVtcGxhdGVzTGlzdC5qcyIsImRpci5tZW51SXRlbXNQYW5lbC5qcyIsImRpci5wYWdlc1NpdGVNYXAuanMiLCJyZXBvLm1lbnVJdGVtLmpzIiwicmVwby5tZW51cy5qcyIsInJlcG8ucGFnZXMuanMiLCJyZXBvLnRlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoicGFnZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnUGVha3MuUGFnZXMnLCBbJ1BlYWtzLk1hbmFnZXIuUmVwb3NpdG9yaWVzJywgJ1BlYWtzLlBhZ2VzLlNlcnZpY2VzJywgJ1BlYWtzLlBhZ2VzLkRpcmVjdGl2ZXMnLCAnUGVha3MuUGFnZXMuUmVwb3NpdG9yaWVzJ10pO1xyXG5hbmd1bGFyLm1vZHVsZSgnUGVha3MuUGFnZXMuU2VydmljZXMnLCBbXSk7XHJcbmFuZ3VsYXIubW9kdWxlKCdQZWFrcy5QYWdlcy5EaXJlY3RpdmVzJywgW10pO1xyXG5hbmd1bGFyLm1vZHVsZSgnUGVha3MuUGFnZXMuUmVwb3NpdG9yaWVzJywgW10pIiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLlBhZ2VzJykuY29udHJvbGxlcignTWVudUVkaXRDdHJsJywgWyckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ01lbnVzTWVudXNSZXBvc2l0b3J5JywgZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMsIG1lbnVzTWVudXNSZXBvc2l0b3J5KXtcclxuICBtZW51Q29udHJvbCgncGFnZXMnKTtcclxuICAkc2NvcGUuYmFja1VybCA9IFwicGFnZXMvbWVudXNcIjtcclxuXHJcbiAgdmFyIGlkID0gJHN0YXRlUGFyYW1zLmlkXHJcbiAgJHNjb3BlLm1vZGUgPSBpZDtcclxuXHJcbiAgdmFyIGdldFRoZVBhZ2UgPSBmdW5jdGlvbihnZXRUaGVDaGlsZHMpXHJcbiAge1xyXG4gICAgbWVudXNNZW51c1JlcG9zaXRvcnkuR2V0SXRlbShpZCwgZnVuY3Rpb24oZGF0YSlcclxuICAgIHtcclxuICAgICAgJHNjb3BlLml0ZW0gPSBkYXRhO1xyXG4gICAgICBpbml0X3BhZ2UoKTtcclxuXHJcbiAgICAgIGlmIChnZXRUaGVDaGlsZHMpIHtcclxuICAgICAgICBcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbihyZXR1cm5Ub0xpc3QpXHJcbiAge1xyXG4gICAgJHNjb3BlLmFsZXJ0ID0gJ1NhdXZlZ2FyZGUnO1xyXG4gICAgc2hvd0FsZXJ0KCk7XHJcblxyXG4gICAgbWVudXNNZW51c1JlcG9zaXRvcnkuU2F2ZUl0ZW0oJHNjb3BlLml0ZW0sIGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7XHJcblxyXG4gICAgICBpZiAocmV0dXJuVG9MaXN0ICYmIGRhdGEuZXJyb3JzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJHNjb3BlLmJhY2tVcmw7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAoaWQgPT0gJ25ldycgJiYgZGF0YS5lcnJvcnMubGVuZ3RoID09PSAwKVxyXG4gICAgICB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAkc2NvcGUuYmFja1VybCArICcvZWRpdC8nICsgZGF0YS5pZDtcclxuICAgICAgfVxyXG4gICAgICBlbHNlXHJcbiAgICAgIHtcclxuICAgICAgICAkc2NvcGUuYWxlcnQgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgJHNjb3BlLmVycm9ycyA9IGRhdGEuZXJyb3JzO1xyXG4gICAgICAgIGlmKGRhdGEuZXJyb3JzLmxlbmd0aCA9PT0gMCkgZ2V0VGhlUGFnZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBzaG93RmFkZUFsZXJ0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gICRzY29wZS5kZWxldGUgPSBmdW5jdGlvbigpXHJcbiAge1xyXG4gICAgbWVudXNNZW51c1JlcG9zaXRvcnkuRGVsZXRlSXRlbShpZCwgZnVuY3Rpb24oZGF0YSlcclxuICAgICAge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJHNjb3BlLmJhY2tVcmw7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcblxyXG4gIGlmIChpZCA9PT0gJ25ldycpIHtcclxuICAgICRzY29wZS5pdGVtID0ge1xyXG4gICAgICBuYW1lIDogJycsXHJcbiAgICAgIGNzc2NsYXNzIDogJydcclxuICAgIH1cclxuICAgIGluaXRfcGFnZSgpO1xyXG4gIH1cclxuICBlbHNlXHJcbiAge1xyXG4gICAgZ2V0VGhlUGFnZSgpO1xyXG4gIH1cclxufV0pIiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLlBhZ2VzJykuY29udHJvbGxlcignTWVudXNMaXN0Q3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRpbmplY3RvcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRpbmplY3Rvcil7XHJcbiAgdmFyIGNvbmZpZyA9IHtcclxuICAgIHNlY3Rpb24gOiBcInBhZ2VzL21lbnVzXCIsXHJcbiAgICBtZW51IDogJ3BhZ2VzJyxcclxuICAgIGdldFVybCA6ICcvYWRtaW5fbWVudXMvbWVudXNfbGlzdC8nLFxyXG4gICAgZGVsZXRlVXJsIDogJ2FkbWluX21lbnVzL21lbnVfZGVsZXRlLycsXHJcbiAgICBnZXRDYWxsQmFjayA6IGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7fVxyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnRhYmxlID0gW1xyXG4gICAgICB7dGl0bGUgOiAnTm9tJywgcGFyYW0gOiAnbmFtZScsIHN0cm9uZyA6IHRydWV9XHJcbiAgICBdO1xyXG5cclxuICAkc2NvcGUucGFnZVRpdGxlID0gJ01lbnUnO1xyXG5cclxuICAkc2NvcGUudGh1bWJQYXRoID0gJyc7XHJcblxyXG4gICRpbmplY3Rvci5pbnZva2UoSXRlbUxpc3QsIHRoaXMsIHskc2NvcGU6ICRzY29wZSwgJGh0dHA6ICRodHRwLCBjb25maWc6IGNvbmZpZ30pO1x0XHJcbn1dKSIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5QYWdlcycpLmNvbnRyb2xsZXIoJ1BhZ2VFZGl0Q3RybCcsIFsnJHJvb3RTY29wZScsICckc2NvcGUnLCAnJHN0YXRlUGFyYW1zJywgJ1BhZ2VzUmVwb3NpdG9yeScsICdUZW1wbGF0ZXNSZXBvc2l0b3J5JywnVGFnc1Jlc3Bvc2l0b3J5JywgJ0dyb3Vwc1JlcG9zaXRvcnknLCAnXycsIFxyXG5cdGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwgJHN0YXRlUGFyYW1zLCBwYWdlc1JlcG9zaXRvcnksIHRlbXBsYXRlc1JlcG9zaXRvcnksIHRhZ3NSZXBvc2l0b3J5LCBncm91cHNSZXBvc2l0b3J5LCBfKXtcclxuXHJcbiBpbml0X3BhZ2UoKTtcclxuICBtZW51Q29udHJvbCgncGFnZXMnKTtcclxuICAkc2NvcGUuc2VjdGlvbiA9ICdwYWdlcy9wYWdlcyc7XHJcblxyXG4gIHZhciBpZCA9ICRzdGF0ZVBhcmFtcy5wYWdlSWQ7XHJcbiAgJHNjb3BlLm1vZGUgPSAgaWQ7XHJcblxyXG4gIHZhciB0ZW1wbGF0ZVZhbHVlcyxcclxuICAgICAgc2F2ZUlzQnV6eSA9IGZhbHNlO1xyXG5cclxuICAkc2NvcGUudGlueW1jZU9wdGlvbnMgPSB0aW55bWNlQ29uZmlnO1xyXG5cclxuICAkc2NvcGUuYWNlTG9hZGVkID0gZnVuY3Rpb24oX2VkaXRvcilcclxuICB7XHJcbiAgICAgYWNlZWRpdG9yQ29uZmlnKF9lZGl0b3IpO1xyXG4gIH07XHJcblxyXG4gICRzY29wZS5zZWxlY3QyVGFncyA9IHtcclxuICAgICAgICAnbXVsdGlwbGUnOiB0cnVlLFxyXG4gICAgICAgICdzaW1wbGVfdGFncyc6IHRydWUsXHJcbiAgICAgICAgLy8ndGFncyc6IHRydWUsICAvLyBDYW4gYmUgZW1wdHkgbGlzdC5cclxuICAgICAgICAndG9rZW5TZXBhcmF0b3JzJyA6IFtcIixcIl0sXHJcbiAgICAgICAgaW5pdFNlbGVjdGlvbiA6IGZ1bmN0aW9uKGVsZW1lbnQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgdGFnc1JlcG9zaXRvcnkudGFnTmFtZXNMaXN0KGZ1bmN0aW9uKGRhdGEpXHJcbiAge1xyXG4gICAgJHNjb3BlLnNlbGVjdDJUYWdzLnRhZ3MgPSBkYXRhO1xyXG4gIH0pO1xyXG5cclxuICAvLyB3YXRjaGVyc1xyXG4gICRzY29wZS4kd2F0Y2goJ2l0ZW0ubGFuZycsIGZ1bmN0aW9uKG5ld1ZhbHVlKVxyXG4gIHtcclxuICAgICBwYWdlc1JlcG9zaXRvcnkuZ2V0UGFnZUxpc3QobmV3VmFsdWUsIGZ1bmN0aW9uKGRhdGEpXHJcbiAgICB7XHJcbiAgICAgIC8vIG9uIGFqb3V0ZSBsZSBuaXZlYXUgMCA6IHJvb3RcclxuICAgICAgJHNjb3BlLnBhZ2VzTGlzdCA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAkc2NvcGUucGFnZXNMaXN0LnB1c2goe2lkIDogMCwgbmFtZSA6ICdyb290J30pO1xyXG4gICAgICAkc2NvcGUucGFnZXNMaXN0ID0gJHNjb3BlLnBhZ2VzTGlzdC5jb25jYXQoZGF0YVsnaXRlbXMnXSk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gZ2V0SXRlbShnZXRUZW1wbGF0ZVZhbHVlcylcclxuICB7XHJcbiAgICBwYWdlc1JlcG9zaXRvcnkuZ2V0UGFnZShpZCwgZnVuY3Rpb24oZGF0YSlcclxuICAgIHtcclxuICAgICAgJHNjb3BlLml0ZW0gPSBkYXRhLnBhZ2VfZGF0YTtcclxuXHJcbiAgICAgIHZhciB1c2VyR3JvdXBzID0gZGF0YS5wYWdlX2RhdGEudXNlcl9ncm91cHMuc3BsaXQoJywnKTtcclxuXHJcbiAgICAgICRzY29wZS51c2VyR3JvdXBzID0gW107XHJcbiAgICAgIGdyb3Vwc1JlcG9zaXRvcnkuR2V0R3JvdXBzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgIHtcclxuICAgICAgICAkc2NvcGUudXNlckdyb3VwcyA9IGRhdGE7IFxyXG4gICAgICAgIGFuZ3VsYXIuZm9yRWFjaChkYXRhLCBmdW5jdGlvbihpdGVtKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGl0ZW0uY2hlY2tlZCA9IF8uaW5kZXhPZih1c2VyR3JvdXBzLCBpdGVtLmlkKSA+PSAwO1xyXG4gICAgICAgIH0pOyAgIFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChkYXRhLnBhZ2VfZGF0YS50eXBlID09PSAndGVtcGxhdGUnICYmIGdldFRlbXBsYXRlVmFsdWVzKSB7XHJcbiAgICAgICAgdGVtcGxhdGVzUmVwb3NpdG9yeS5nZXRUZW1wbGF0ZUZpZWxkcyhkYXRhLnBhZ2VfZGF0YS50ZW1wbGF0ZSwgZnVuY3Rpb24oZGF0YV9zdWIpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgZGF0YV9zdWIuZm9yRWFjaChmdW5jdGlvbih0ZW1wbGF0ZUZpZWxkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdmFyIGZpZWxkVmFsdWUgPSBfLmZpbmRXaGVyZShkYXRhLnRlbXBsYXRlX3ZhbHVlcywge2ZpZWxkX25hbWUgOiB0ZW1wbGF0ZUZpZWxkLmZ1bGxfbmFtZX0pO1xyXG4gICAgICAgICAgICAgIGlmIChmaWVsZFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhX3N1YltpKytdLmZpZWxkVmFsdWUgPSBfLmZpbmRXaGVyZShkYXRhLnRlbXBsYXRlX3ZhbHVlcywge2ZpZWxkX25hbWUgOiB0ZW1wbGF0ZUZpZWxkLmZ1bGxfbmFtZX0pLnZhbHVlO1xyXG4gICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnRlbXBsYXRlRmllbGRzID0gZGF0YV9zdWI7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhdXRvR2VuZXJhdGVTbHVnKClcclxuICB7IFxyXG4gICAgJHNjb3BlLiR3YXRjaChcIml0ZW0ubmFtZVwiLCBmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgaWYoJHNjb3BlLmVkaXRGb3JtLnNsdWcuJHByaXN0aW5lKVxyXG4gICAgICB7XHJcbiAgICAgICAgJHNjb3BlLml0ZW0uc2x1ZyA9IGZyaWVuZGx5X3VybChuZXdWYWx1ZSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdGVtcGxhdGVzUmVwb3NpdG9yeS5nZXRUZW1wbGF0ZUZpbGVzKGZ1bmN0aW9uKGRhdGEpXHJcbiAge1xyXG4gICAgJHNjb3BlLnRlbXBsYXRlRmlsZXMgPSBkYXRhO1xyXG4gIH0pO1xyXG5cclxuICB0ZW1wbGF0ZXNSZXBvc2l0b3J5LmdldFRlbXBsYXRlcyhmdW5jdGlvbihkYXRhKVxyXG4gIHtcclxuICAgICRzY29wZS50ZW1wbGF0ZXMgPSBkYXRhLml0ZW1zO1xyXG4gIH0pO1xyXG5cclxuICAkc2NvcGUuZ2V0VGVtcGxhdGVGaWVsZHMgPSBmdW5jdGlvbigpXHJcbiAge1xyXG4gICAgaWYgKCRzY29wZS5pdGVtLnR5cGUgPT09ICd0ZW1wbGF0ZScpIHtcclxuICAgICAgdGVtcGxhdGVzUmVwb3NpdG9yeS5nZXRUZW1wbGF0ZUZpZWxkcygkc2NvcGUuaXRlbS50ZW1wbGF0ZSwgZnVuY3Rpb24oZGF0YSlcclxuICAgICAge1xyXG4gICAgICAgICRzY29wZS50ZW1wbGF0ZUZpZWxkcyA9IGRhdGE7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gICRzY29wZS5zYXZlID0gZnVuY3Rpb24ocmV0dXJuVG9MaXN0KVxyXG4gIHtcclxuXHJcbiAgICBpZiAoIXNhdmVJc0J1enkpIHtcclxuXHJcbiAgICAgIHNhdmVJc0J1enkgPSB0cnVlO1xyXG4gICAgICBicm9hZGNhc3QgPSBmYWxzZTtcclxuICAgICAgJHNjb3BlLmFsZXJ0ID0gJ1NhdXZlZ2FyZGUgLi4uJztcclxuICAgICAgc2hvd0FsZXJ0KCk7XHJcblxyXG4gICAgICBpZiAoJHNjb3BlLml0ZW0udHlwZSA9PT0gJ2ZpbGUnKSB7XHJcbiAgICAgICAgJHNjb3BlLnRlbXBsYXRlRmllbGRzID0gZmFsc2U7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkc2NvcGUuaXRlbS51c2VyX2dyb3VwcyA9ICcnO1xyXG5cclxuICAgICAgYW5ndWxhci5mb3JFYWNoKCRzY29wZS51c2VyR3JvdXBzLCBmdW5jdGlvbihncm91cCl7XHJcbiAgICAgICAgaWYgKGdyb3VwLmNoZWNrZWQpIHtcclxuICAgICAgICAgICRzY29wZS5pdGVtLnVzZXJfZ3JvdXBzICs9IGdyb3VwLmlkICsgJywnO1xyXG4gICAgICAgIH07XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJHNjb3BlLml0ZW0udXNlcl9ncm91cHMgPSAkc2NvcGUuaXRlbS51c2VyX2dyb3Vwcy5zdWJzdHJpbmcoMCwgJHNjb3BlLml0ZW0udXNlcl9ncm91cHMubGVuZ3RoLTEpO1xyXG5cclxuICAgICAgY29uc29sZS5sb2coJHNjb3BlLnVzZXJHcm91cHMpO1xyXG5cclxuICAgICAgaWYgKGlkICE9ICduZXcnICYmICgkc2NvcGUuaXRlbS5wYXJlbnRfaWQgIT0gJHNjb3BlLml0ZW0uY2FjaGUucGFyZW50X2lkIHx8ICRzY29wZS5pdGVtLndlaWdodCAhPSAkc2NvcGUuaXRlbS5jYWNoZS53ZWlnaHQpKSB7XHJcbiAgICAgICAgYnJvYWRjYXN0ID0gdHJ1ZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCAkc2NvcGUuaXRlbSk7XHJcbiAgICAgIHBhZ2VzUmVwb3NpdG9yeS5zYXZlUGFnZSgkc2NvcGUuaXRlbSwgJHNjb3BlLnRlbXBsYXRlRmllbGRzLCBmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNhdmVJc0J1enkgPSAgZmFsc2U7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIGlmIChyZXR1cm5Ub0xpc3QgJiYgZGF0YS5lcnJvcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJy9wYWdlcy9wYWdlcyc7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBlbHNlIGlmIChpZCA9PSAnbmV3JyAmJiBkYXRhLmVycm9ycy5sZW5ndGggPT09IDApXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJy9wYWdlcy9wYWdlcy9lZGl0LycgKyBkYXRhLmlkO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICAkc2NvcGUuYWxlcnQgPSBkYXRhLm1lc3NhZ2U7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvcnMgPSBkYXRhLmVycm9ycztcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhLmVycm9yID09IDApIHtcclxuICAgICAgICAgICAgICAgJHNjb3BlLml0ZW0udmVyc2lvbiA9IGRhdGEudmVyc2lvbjtcclxuICAgICAgICAgICAgICAgZ2V0SXRlbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgLy8gYnJvZGNhc3QgZGUgbGEgbWlzZSDDoCBqb3VyIGRlcyB0ZW1wbGF0ZVxyXG4gICAgICAgICAgICAgICBpZiAoYnJvYWRjYXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdzaXRlTWFwVXBkYXRlZEJ5UGFnZUN0cmwnKTtcclxuICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICAkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oKVxyXG4gIHtcclxuICAgIGlmIChjb25maXJtKCdFdGVzIHZvdXMgc3VyIGRlIHZvdWxvaXIgc3VwcHJpbWVyIGxhIHBhZ2UgXCInKyAkc2NvcGUuaXRlbS5uYW1lICsgJ1wiID8nKSkge1xyXG4gICAgICBwYWdlc1JlcG9zaXRvcnkuZGVsZXRlUGFnZSgkc2NvcGUuaXRlbS5pZCwgZnVuY3Rpb24oZGF0YSlcclxuICAgICAge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gJy9wYWdlcy9wYWdlcyc7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGlmIChpZCAhPSAnbmV3Jykge1xyXG5cclxuICAgIC8vIGNhdGNoIGRlcyBicm9hZGNhc3RzXHJcbiAgICAkc2NvcGUuJG9uKCdzaXRlTWFwVXBkYXRlZEJ5U2l0ZU1hcCcsIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICBwYWdlc1JlcG9zaXRvcnkuZ2V0UGFnZU9yZGVyKCRzY29wZS5pdGVtLmlkLCBmdW5jdGlvbihwYWdlT3JkZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWYgKCRzY29wZS5pdGVtLmNhY2hlLnBhcmVudF9pZCAhPSBwYWdlT3JkZXIucGFyZW50X2lkKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5pdGVtLmNhY2hlLnBhcmVudF9pZCA9IHBhZ2VPcmRlci5wYXJlbnRfaWQ7XHJcbiAgICAgICAgICAgICRzY29wZS5pdGVtLnBhcmVudF9pZCA9IHBhZ2VPcmRlci5wYXJlbnRfaWRcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgaWYgKCRzY29wZS5pdGVtLmNhY2hlLndlaWdodCAhPSBwYWdlT3JkZXIud2VpZ2h0KSB7XHJcbiAgICAgICAgICAgICRzY29wZS5pdGVtLmNhY2hlLndlaWdodCA9IHBhZ2VPcmRlci53ZWlnaHQ7XHJcbiAgICAgICAgICAgICRzY29wZS5pdGVtLndlaWdodCA9IHBhZ2VPcmRlci53ZWlnaHRcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZ2V0SXRlbSh0cnVlKTtcclxuICB9XHJcbiAgZWxzZVxyXG4gIHtcclxuICAgIC8vJHNjb3BlLml0ZW07XHJcbiAgICBhdXRvR2VuZXJhdGVTbHVnKCk7XHJcblxyXG4gICAgXHJcbiAgICAgIGNvbnNvbGUubG9nKCRyb290U2NvcGUubmV3SXRlbSk7XHJcbiAgICAgIGlmICgkc2NvcGUubmV3SXRlbSkge1xyXG4gICAgICAgICRzY29wZS5pdGVtID0gJHJvb3RTY29wZS5uZXdJdGVtO1xyXG4gICAgICAgICRzY29wZS5pdGVtLm1ldGFfa2V5d29yZHMgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICAkcm9vdFNjb3BlLm5ld0l0ZW0gPSB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZVxyXG4gICAgICB7XHJcbiAgICAgICAgJHNjb3BlLml0ZW0gPSB7XHJcbiAgICAgICAgICBtZXRhX2tleXdvcmRzIDogbmV3IEFycmF5KClcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgfVxyXG5cdFxyXG59XSkiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuUGFnZXMnKS5jb250cm9sbGVyKCdQYWdlTGlzdEN0cmwnLCBbJyRzY29wZScsICckaHR0cCcsICckaW5qZWN0b3InLCBmdW5jdGlvbigkc2NvcGUsICRodHRwLCAkaW5qZWN0b3Ipe1xyXG4gIHZhciBjb25maWcgPSB7XHJcbiAgICBzZWN0aW9uIDogXCJwYWdlcy9wYWdlc1wiLFxyXG4gICAgbWVudSA6ICdwYWdlcycsXHJcbiAgICBnZXRVcmwgOiAnL2FkbWluX3BhZ2VzL3BhZ2VzX2xpc3QvJyxcclxuICAgIGRlbGV0ZVVybCA6ICdhZG1pbl9wYWdlcy9wYWdlc19kZWxldGUvJ1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLnRhYmxlID0gW1xyXG4gICAgICB7dGl0bGUgOiAnTm9tJywgcGFyYW0gOiAnbmFtZScsIHN0cm9uZyA6IHRydWV9LFxyXG4gICAgICB7dGl0bGU6ICdMYW5ndWUnLCBwYXJhbSA6ICdsYW5nJ30sXHJcbiAgICAgIHt0aXRsZTogJ1ZlcnNpb25zJywgcGFyYW0gOiAndmVyc2lvbid9XHJcbiAgICBdO1xyXG5cclxuICAkc2NvcGUucGFnZVRpdGxlID0gJ1BhZ2VzJztcclxuXHJcbiAgJHNjb3BlLnRodW1iUGF0aCA9ICd1c2Vyc350aHVtYnMnO1xyXG5cclxuICAkaW5qZWN0b3IuaW52b2tlKEl0ZW1MaXN0LCB0aGlzLCB7JHNjb3BlOiAkc2NvcGUsICRodHRwOiAkaHR0cCwgY29uZmlnOiBjb25maWd9KTtcclxufV0pIiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLlBhZ2VzJykuY29udHJvbGxlcignVGVtcGxhdGVFZGl0Q3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRzdGF0ZVBhcmFtcycsICdUZW1wbGF0ZXNSZXBvc2l0b3J5JywgZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCwgJHN0YXRlUGFyYW1zLCB0ZW1wbGF0ZXNSZXBvc2l0b3J5KXtcclxuIGluaXRfcGFnZSgpO1xyXG4gICRzY29wZS5zZWN0aW9uID0gXCJwYWdlcy90ZW1wbGF0ZXNcIjtcclxuICBtZW51Q29udHJvbCgncGFnZXMnKTtcclxuXHJcbiAgdmFyIGlkID0gJHN0YXRlUGFyYW1zLmlkO1xyXG4gICRzY29wZS5tb2RlID0gIGlkO1xyXG5cclxuICBmdW5jdGlvbiBnZXRJdGVtKClcclxuICB7XHJcbiAgICB0ZW1wbGF0ZXNSZXBvc2l0b3J5LmdldFRlbXBsYXRlKGlkLCBmdW5jdGlvbihkYXRhKVxyXG4gICAge1xyXG4gICAgICAkc2NvcGUuaXRlbSA9IGRhdGE7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgdGVtcGxhdGVzUmVwb3NpdG9yeS5nZXRUZW1wbGF0ZUZpbGVzKGZ1bmN0aW9uKGRhdGEpXHJcbiAge1xyXG4gICAgJHNjb3BlLnRlbXBsYXRlRmlsZXMgPSBkYXRhO1xyXG4gIH0pO1xyXG5cclxuICAkc2NvcGUuYWNlQ29uZmlnID0ge1xyXG4gICAgdXNlV3JhcE1vZGUgOiB0cnVlLFxyXG4gICAgc2hvd0d1dHRlcjogdHJ1ZSxcclxuICAgIHRoZW1lOid0d2lsaWdodCcsXHJcbiAgICBtb2RlOiAnaHRtbCcsXHJcbiAgICBvbkxvYWQ6IGFjZUxvYWRlZFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gYWNlTG9hZGVkKF9lZGl0b3IpXHJcbiAge1xyXG4gICAgY29uc29sZS5sb2coX2VkaXRvcik7XHJcbiAgICBfZWRpdG9yLnNldFJlYWRPbmx5KHRydWUpO1xyXG4gICAgYWNlLnJlcXVpcmUoXCJhY2UvZXh0L2VtbWV0XCIpO1xyXG4gICAgYWNlLnJlcXVpcmUoXCJhY2UvZXh0L2xhbmd1YWdlX3Rvb2xzXCIpO1xyXG4gICAgX2VkaXRvci5zZXRPcHRpb25zKHtcclxuICAgICAgICBlbmFibGVCYXNpY0F1dG9jb21wbGV0aW9uOiB0cnVlLFxyXG4gICAgICAgIGVuYWJsZUVtbWV0OiB0cnVlLFxyXG4gICAgICAgIGVuYWJsZVNuaXBwZXRzOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAkc2NvcGUuc2F2ZSA9IGZ1bmN0aW9uKHJldHVyblRvTGlzdClcclxuICB7XHJcbiAgICAkc2NvcGUuYWxlcnQgPSAnU2F1dmVnYXJkZSc7XHJcbiAgICBzaG93QWxlcnQoKTtcclxuXHJcbiAgICB0ZW1wbGF0ZXNSZXBvc2l0b3J5LnNhdmVUZW1wbGF0ZSgkc2NvcGUuaXRlbSwgZnVuY3Rpb24oZGF0YSlcclxuICAgIHtcclxuXHJcbiAgICAgIGlmIChyZXR1cm5Ub0xpc3QgJiYgZGF0YS5lcnJvcnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL3BhZ2VzL3RlbXBsYXRlcyc7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAoaWQgPT0gJ25ldycgJiYgZGF0YS5lcnJvcnMubGVuZ3RoID09PSAwKVxyXG4gICAgICB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL3BhZ2VzL3RlbXBsYXRlcy9lZGl0LycgKyBkYXRhLmlkO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2VcclxuICAgICAge1xyXG4gICAgICAgICRzY29wZS5hbGVydCA9IGRhdGEubWVzc2FnZTtcclxuICAgICAgICAkc2NvcGUuZXJyb3JzID0gZGF0YS5lcnJvcnM7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNob3dGYWRlQWxlcnQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKClcclxuICB7XHJcbiAgICB0ZW1wbGF0ZXNSZXBvc2l0b3J5LmRlbGV0ZVRlbXBsZXRlKGlkLCBmdW5jdGlvbihkYXRhKVxyXG4gICAgICB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAkc2NvcGUuc2VjdGlvbjtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAoaWQgIT0gJ25ldycpIHtcclxuICAgIGdldEl0ZW0oKTtcclxuICB9O1xyXG59XSkiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuUGFnZXMnKS5jb250cm9sbGVyKCdUZW1wbGF0ZXNMaXN0Q3RybCcsIFsnJHNjb3BlJywgJyRodHRwJywgJyRpbmplY3RvcicsIGZ1bmN0aW9uKCRzY29wZSwgJGh0dHAsICRpbmplY3Rvcil7XHJcbiAgdmFyIGNvbmZpZyA9IHtcclxuICAgIHNlY3Rpb24gOiBcInBhZ2VzL3RlbXBsYXRlc1wiLFxyXG4gICAgbWVudSA6ICdwYWdlcycsXHJcbiAgICBnZXRVcmwgOiAnL2FkbWluX3BhZ2VzL3RlbXBsYXRlc19saXN0LycsXHJcbiAgICBkZWxldGVVcmwgOiAnYWRtaW5fcGFnZXMvdGVtcGxhdGVzX2RlbGV0ZSdcclxuICB9XHJcblxyXG4gICRzY29wZS50YWJsZSA9IFtcclxuICAgICAge3RpdGxlIDogJ05vbScsIHBhcmFtIDogJ25hbWUnfSxcclxuICAgIF07XHJcblxyXG4gICRzY29wZS5wYWdlVGl0bGUgPSAnVGVtcGxhdGVzJztcclxuXHJcbiAgJGluamVjdG9yLmludm9rZShJdGVtTGlzdCwgdGhpcywgeyRzY29wZTogJHNjb3BlLCAkaHR0cDogJGh0dHAsIGNvbmZpZzogY29uZmlnfSk7XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuUGFnZXMuRGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgnbWVudXNJdGVtc1BhbmVsJywgWydNZW51c0l0ZW1zUmVwb3NpdG9yeScsICdVcmxTZXJ2aWNlJywgZnVuY3Rpb24obWVudXNJdGVtc1JlcG9zaXRvcnksIHVybFNlcnZpY2Upe1xyXG4gIC8vIFJ1bnMgZHVyaW5nIGNvbXBpbGVcclxuICByZXR1cm4ge1xyXG4gICAgLy8gbmFtZTogJycsXHJcbiAgICAvLyBwcmlvcml0eTogMSxcclxuICAgIC8vIHRlcm1pbmFsOiB0cnVlLFxyXG4gICAgc2NvcGU6IHsgbWVudUlkIDogJz1tZW51SWQnfSwgLy8ge30gPSBpc29sYXRlLCB0cnVlID0gY2hpbGQsIGZhbHNlL3VuZGVmaW5lZCA9IG5vIGNoYW5nZVxyXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdHJhbnNjbHVkZSkge1xyXG5cclxuICAgICAgdmFyIHJ1bmluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgJHNjb3BlLnVybE9wdGlvbnMgPSBbXTtcclxuXHJcbiAgICAgIGZ1bmN0aW9uIGdldEl0ZW0oaWQpXHJcbiAgICAgIHtcclxuICAgICAgICBtZW51c0l0ZW1zUmVwb3NpdG9yeS5HZXRJdGVtKGlkLCBmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgIGRhdGEudGFyZ2V0ID0gZGF0YS50YXJnZXQgPT0gMSA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICRzY29wZS5pdGVtID0gZGF0YTtcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuZ2V0SXRlbSA9IGZ1bmN0aW9uKGlkKSB7IGdldEl0ZW0oaWQpIH07XHJcblxyXG4gICAgICBmdW5jdGlvbiByZXNldEl0ZW0ocGFyZW50SWQpXHJcbiAgICAgIHtcclxuICAgICAgICAkc2NvcGUuaXRlbSA9IHtcclxuICAgICAgICAgIG1lbnVfaWQgOiAkc2NvcGUubWVudUlkLFxyXG4gICAgICAgICAgcGFyZW50X2lkIDogcGFyZW50SWQgPyBwYXJlbnRJZCA6IG51bGxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS51cmxPcHRpb25zID0gW107XHJcblxyXG4gICAgICAgICRzY29wZS5pdGVtRm9ybS4kc2V0UHJpc3RpbmUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZnVuY3Rpb24gZ2V0SXRlbUxpc3QoKVxyXG4gICAgICB7XHJcbiAgICAgICAgbWVudXNJdGVtc1JlcG9zaXRvcnkuR2V0SXRlbXNUcmVlKCRzY29wZS5tZW51SWQsIGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJHNjb3BlLml0ZW1zVHJlZSA9IGRhdGE7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbWVudXNJdGVtc1JlcG9zaXRvcnkuR2V0SXRlbXMoJHNjb3BlLm1lbnVJZCkudGhlbihmdW5jdGlvbihyZXN1bHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgJHNjb3BlLml0ZW1zTGlzdCA9IHJlc3VsdC5kYXRhLml0ZW1zO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBnZXRJdGVtTGlzdCgpO1xyXG5cclxuICAgICAgJHNjb3BlLnJlc2V0SXRlbSA9IGZ1bmN0aW9uKCkgeyByZXNldEl0ZW0oKSB9O1xyXG4gICAgICBcclxuICAgICAgJHNjb3BlLnNhdmUgPSBmdW5jdGlvbihlbmRFZGl0KVxyXG4gICAgICB7XHJcbiAgICAgICAgaWYocnVuaW5nKSByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHJ1bmluZyA9IHRydWU7XHJcbiAgICAgICAgaWYgKCEkc2NvcGUuaXRlbS5tZW51X2lkKSB7XHJcbiAgICAgICAgICAkc2NvcGUuaXRlbS5tZW51X2lkID0gJHNjb3BlLm1lbnVJZDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdydW4nKTtcclxuICAgICAgICBtZW51c0l0ZW1zUmVwb3NpdG9yeS5TYXZlSXRlbSgkc2NvcGUuaXRlbSwgZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICBydW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgIGlmIChkYXRhLmVycm9ycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgZW5kRWRpdCA/IHJlc2V0SXRlbSgpIDogZ2V0SXRlbShkYXRhLmlkKTtcclxuICAgICAgICAgICAgZ2V0SXRlbUxpc3QoKTtcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS5uZXdTdWJJdGVtID0gZnVuY3Rpb24ocGFyZW50SWQpXHJcbiAgICAgIHtcclxuICAgICAgICByZXNldEl0ZW0ocGFyZW50SWQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkc2NvcGUuZGVsZXRlSXRlbSA9IGZ1bmN0aW9uKGlkLCByZXNldClcclxuICAgICAge1xyXG4gICAgICAgIGJvb3Rib3guY29uZmlybSgnRXRlcyB2b3VzIHN1ciBkZSB2b3Vsb2lyIHN1cHByaW1lciBjZXQgw6lsw6ltZW50ID8nLCBmdW5jdGlvbihpbnZva2UpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWYgKGludm9rZSkgXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIG1lbnVzSXRlbXNSZXBvc2l0b3J5LkRlbGV0ZUl0ZW0oaWQsIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGdldEl0ZW1MaXN0KCk7XHJcbiAgICAgICAgICAgICAgaWYgKHJlc2V0KSByZXNldEl0ZW0oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICRzY29wZS4kd2F0Y2goJ2l0ZW0ubW9kdWxlJywgZnVuY3Rpb24obmV3VmFsdWUpXHJcbiAgICAgIHtcclxuICAgICAgICAkc2NvcGUudXJsT3B0aW9ucy5VcmxGdW5jdGlvbnMgPSB1cmxTZXJ2aWNlLkdldEZ1bmN0aW9ucyhuZXdWYWx1ZSk7XHJcbiAgICAgICAgLyppZiAoJHNjb3BlLml0ZW0pIHtcclxuICAgICAgICAgICRzY29wZS5pdGVtLmZ1bmN0aW9uID0gJHNjb3BlLml0ZW0ubW9kdWxlID09PSAncGFnZXMnID8gJ3BhZ2UnIDogbnVsbDtcclxuICAgICAgICB9OyovXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJHNjb3BlLiR3YXRjaCgnaXRlbS5mdW5jdGlvbicsIGZ1bmN0aW9uKG5ld1ZhbHVlKVxyXG4gICAgICB7XHJcbiAgICAgICAgaWYgKCRzY29wZS5pdGVtKSB7XHJcbiAgICAgICAgICB1cmxTZXJ2aWNlLkdldEVsZW1lbnRzKCRzY29wZS5pdGVtLm1vZHVsZSwgbmV3VmFsdWUsIGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAkc2NvcGUudXJsT3B0aW9ucy5VcmxFbGVtZW50cyA9IGRhdGE7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICRzY29wZS50cmVlT3B0aW9ucyA9IHtcclxuICAgICAgICBkcm9wcGVkOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9LFxyXG4gICAgICAgICAgICAgIHBhcmVudENoaWxkc0xpc3Q7XHJcblxyXG4gICAgICAgICAgICB0cnkgXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRhLnBhcmVudF9pZCA9IGV2ZW50LmRlc3Qubm9kZXNTY29wZS4kbm9kZVNjb3BlLiRtb2RlbFZhbHVlLmlkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoKGUpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBkYXRhLnBhcmVudF9pZCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSBcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGEub2xkX3BhcmVudF9pZCA9IGV2ZW50LnNvdXJjZS5ub2Rlc1Njb3BlLiRub2RlU2NvcGUuJG1vZGVsVmFsdWUuaWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2goZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGRhdGEub2xkX3BhcmVudF9pZCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRhdGEubmV3X2luZGV4ID0gZXZlbnQuZGVzdC5pbmRleDtcclxuXHJcbiAgICAgICAgICAgIHBhcmVudENoaWxkc0xpc3QgPSBldmVudC5kZXN0Lm5vZGVzU2NvcGUuJG1vZGVsVmFsdWU7XHJcbiAgICAgICAgICAgIGRhdGEuaWQgPSBwYXJlbnRDaGlsZHNMaXN0W2RhdGEubmV3X2luZGV4XS5pZDtcclxuICAgICAgICAgICAgZGF0YS5tZW51X2lkID0gJHNjb3BlLm1lbnVJZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChldmVudC5zb3VyY2UuaW5kZXggIT0gZGF0YS5uZXdfaW5kZXggfHwgZGF0YS5wYXJlbnRfaWQgIT0gZGF0YS5vbGRfcGFyZW50X2lkKSB7XHJcblxyXG4gICAgICAgICAgICAgIG1lbnVzSXRlbXNSZXBvc2l0b3J5LlJlb3JkZXJJdGVtKGRhdGEsIGZ1bmN0aW9uKClcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIHJlcXVpcmU6ICduZ01vZGVsJywgLy8gQXJyYXkgPSBtdWx0aXBsZSByZXF1aXJlcywgPyA9IG9wdGlvbmFsLCBeID0gY2hlY2sgcGFyZW50IGVsZW1lbnRzXHJcbiAgICByZXN0cmljdDogJ0EnLCAvLyBFID0gRWxlbWVudCwgQSA9IEF0dHJpYnV0ZSwgQyA9IENsYXNzLCBNID0gQ29tbWVudFxyXG4gICAgLy90ZW1wbGF0ZTogJzxhIGhyZWY9XCIjbWFuYWdlci9jb21wdGVzL2VkaXQve3t1c2VySWR9fVwiID57e3VzZXIuZmlyc3RfbmFtZX19IHt7dXNlci5sYXN0X25hbWV9fTwvYT4nLFxyXG4gICAgdGVtcGxhdGVVcmw6ICcvYWRtaW4vdmlld19sb2FkZXIvZGVza3RvcC9tZW51cy9pdGVtcy9lZGl0JyxcclxuICAgIHJlcGxhY2U6IGZhbHNlLFxyXG4gICAgLy8gdHJhbnNjbHVkZTogdHJ1ZSxcclxuICAgIC8vIGNvbXBpbGU6IGZ1bmN0aW9uKHRFbGVtZW50LCB0QXR0cnMsIGZ1bmN0aW9uIHRyYW5zY2x1ZGUoZnVuY3Rpb24oc2NvcGUsIGNsb25lTGlua2luZ0ZuKXsgcmV0dXJuIGZ1bmN0aW9uIGxpbmtpbmcoc2NvcGUsIGVsbSwgYXR0cnMpe319KSksXHJcbiAgICAvL2xpbms6IGZ1bmN0aW9uKCRzY29wZSwgaUVsbSwgaUF0dHJzLCBjb250cm9sbGVyKSB7fVxyXG4gIH07XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuUGFnZXMuRGlyZWN0aXZlcycpLmRpcmVjdGl2ZSgncGFnZXNTaXRlTWFwJywgWydQYWdlc1JlcG9zaXRvcnknLCBmdW5jdGlvbihwYWdlc1JlcG9zaXRvcnkpe1xyXG5cdC8vIFJ1bnMgZHVyaW5nIGNvbXBpbGVcclxuXHRyZXR1cm4ge1xyXG5cdFx0Ly8gbmFtZTogJycsXHJcblx0XHQvLyBwcmlvcml0eTogMSxcclxuXHRcdC8vIHRlcm1pbmFsOiB0cnVlLFxyXG5cdFx0c2NvcGU6IHsgY3VycmVudElkIDogXCI9Y3VycmVudFwifSwgLy8ge30gPSBpc29sYXRlLCB0cnVlID0gY2hpbGQsIGZhbHNlL3VuZGVmaW5lZCA9IG5vIGNoYW5nZVxyXG5cdFx0Lypjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICR0cmFuc2NsdWRlKSB7XHJcblx0XHR9LCovXHJcblx0XHQvLyByZXF1aXJlOiAnbmdNb2RlbCcsIC8vIEFycmF5ID0gbXVsdGlwbGUgcmVxdWlyZXMsID8gPSBvcHRpb25hbCwgXiA9IGNoZWNrIHBhcmVudCBlbGVtZW50c1xyXG5cdFx0Ly9yZXN0cmljdDogJ0UnLCAvLyBFID0gRWxlbWVudCwgQSA9IEF0dHJpYnV0ZSwgQyA9IENsYXNzLCBNID0gQ29tbWVudFxyXG5cdFx0Ly90ZW1wbGF0ZTogJzx1bD48bGkgbmctcmVwZWF0PVwibm9kZSBpbiBzaXRlTWFwXCI+bm9kZS50aXRsZTwvbGk+PC91bD4nLFxyXG5cdFx0dGVtcGxhdGVVcmw6ICcvYWRtaW4vdmlld19sb2FkZXIvZGVza3RvcC9zaGFyZWQvd2lkZ2V0cy90cmVlJyxcclxuXHRcdC8vcmVwbGFjZTogdHJ1ZSxcclxuXHRcdC8vIHRyYW5zY2x1ZGU6IHRydWUsXHJcblx0XHQvLyBjb21waWxlOiBmdW5jdGlvbih0RWxlbWVudCwgdEF0dHJzLCBmdW5jdGlvbiB0cmFuc2NsdWRlKGZ1bmN0aW9uKHNjb3BlLCBjbG9uZUxpbmtpbmdGbil7IHJldHVybiBmdW5jdGlvbiBsaW5raW5nKHNjb3BlLCBlbG0sIGF0dHJzKXt9fSkpLFxyXG5cdFx0Y29udHJvbGxlcjogZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkdHJhbnNjbHVkZSkge1xyXG5cclxuXHRcdFx0JHNjb3BlLnNtYWxsU2l6ZSA9ICdzbWFsbC1zaXplJztcclxuXHJcblx0XHRcdGZ1bmN0aW9uIGxhbmd1YWdlc01hcChsYW5ndWFnZXMpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgcmVzdWx0ID0ge31cclxuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gbGFuZ3VhZ2VzKSB7XHJcblx0XHRcdFx0XHRyZXN1bHRba2V5XSA9IHsgS2V5TmFtZSA6IGtleSwgTGFuZ05hbWUgOiBsYW5ndWFnZXNba2V5XX1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCRzY29wZS5sYW5ndWFnZXMgPSBsYW5ndWFnZXNNYXAoZ2xvYmFsVmFycy5zaXRlTGFuZ3VhZ2VzKTtcclxuXHRcdFx0JHNjb3BlLnRyZWVDdWx0dXJlID0gZ2xvYmFsVmFycy5kZWZhdWx0TGFuZ3VhZ2U7XHJcblxyXG5cdFx0XHQkc2NvcGUucmVtb3ZlID0gZnVuY3Rpb24oc2NvcGUpIHtcclxuXHRcdCAgICAgIHNjb3BlLnJlbW92ZSgpO1xyXG5cdFx0ICAgIH07XHJcblxyXG5cdFx0ICAgICRzY29wZS50b2dnbGUgPSBmdW5jdGlvbihzY29wZSkge1xyXG5cdFx0ICAgICAgc2NvcGUudG9nZ2xlKCk7XHJcblx0XHQgICAgfTtcclxuXHJcblx0XHQgICAgJHNjb3BlLm5ld1N1Ykl0ZW0gPSBmdW5jdGlvbihpZCkge1xyXG5cdFx0ICAgICAgJHJvb3RTY29wZS5uZXdJdGVtID0ge3BhcmVudF9pZCA6IGlkLCBsYW5nIDogJ2ZyJ307XHJcblx0XHQgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICcvcGFnZXMvcGFnZXMvZWRpdC9uZXcnO1xyXG5cdFx0ICAgICAgY29uc29sZS5sb2coaWQpO1xyXG5cdFx0ICAgIH07XHJcblxyXG5cdFx0ICAgICRzY29wZS5nZXRQYWdlID0gZnVuY3Rpb24oaWQpXHJcblx0XHQgICAge1xyXG5cdFx0ICAgIFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSAnL3BhZ2VzL3BhZ2VzL2VkaXQvJyArIGlkO1xyXG5cdFx0ICAgIH1cclxuXHJcblx0XHQgICAgdmFyIGdldFJvb3ROb2Rlc1Njb3BlID0gZnVuY3Rpb24oKSB7XHJcblx0XHQgICAgICByZXR1cm4gYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHJlZS1yb290XCIpKS5zY29wZSgpO1xyXG5cdFx0ICAgIH07XHJcblxyXG5cdFx0ICAgICRzY29wZS5jb2xsYXBzZUFsbCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0ICAgICAgdmFyIHNjb3BlID0gZ2V0Um9vdE5vZGVzU2NvcGUoKTtcclxuXHRcdCAgICAgIHNjb3BlLmNvbGxhcHNlQWxsKCk7XHJcblx0XHQgICAgfTtcclxuXHJcblx0XHQgICAgJHNjb3BlLmV4cGFuZEFsbCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0ICAgICAgdmFyIHNjb3BlID0gZ2V0Um9vdE5vZGVzU2NvcGUoKTtcclxuXHRcdCAgICAgIHNjb3BlLmV4cGFuZEFsbCgpO1xyXG5cdFx0ICAgIH07XHJcblxyXG5cdFx0ICAgICRzY29wZS50cmVlT3B0aW9ucyA9IHtcclxuXHRcdFx0ICAgIGRyb3BwZWQ6IGZ1bmN0aW9uKGV2ZW50KSB7XHJcblx0XHRcdCAgICBcdHZhciBkYXRhID0ge30sXHJcblx0XHRcdCAgICBcdFx0cGFyZW50Q2hpbGRzTGlzdDtcclxuXHJcblx0XHRcdCAgICBcdHRyeSBcclxuXHRcdFx0ICAgIFx0e1xyXG5cdFx0XHQgICAgXHRcdGRhdGEucGFyZW50X2lkID0gZXZlbnQuZGVzdC5ub2Rlc1Njb3BlLiRub2RlU2NvcGUuJG1vZGVsVmFsdWUuaWQ7XHJcblx0XHRcdCAgICBcdH1cclxuXHRcdFx0ICAgIFx0Y2F0Y2goZSlcclxuXHRcdFx0ICAgIFx0e1xyXG5cdFx0XHQgICAgXHRcdGRhdGEucGFyZW50X2lkID0gMDtcclxuXHRcdFx0ICAgIFx0fVxyXG5cclxuXHRcdFx0ICAgIFx0dHJ5IFxyXG5cdFx0XHQgICAgXHR7XHJcblx0XHRcdCAgICBcdFx0ZGF0YS5vbGRfcGFyZW50X2lkID0gZXZlbnQuc291cmNlLm5vZGVzU2NvcGUuJG5vZGVTY29wZS4kbW9kZWxWYWx1ZS5pZDtcclxuXHRcdFx0ICAgIFx0fVxyXG5cdFx0XHQgICAgXHRjYXRjaChlKVxyXG5cdFx0XHQgICAgXHR7XHJcblx0XHRcdCAgICBcdFx0ZGF0YS5vbGRfcGFyZW50X2lkID0gMDtcclxuXHRcdFx0ICAgIFx0fVxyXG5cclxuXHRcdFx0ICAgIFx0ZGF0YS5uZXdfaW5kZXggPSBldmVudC5kZXN0LmluZGV4O1xyXG5cclxuXHRcdFx0ICAgIFx0cGFyZW50Q2hpbGRzTGlzdCA9IGV2ZW50LmRlc3Qubm9kZXNTY29wZS4kbW9kZWxWYWx1ZTtcclxuXHRcdFx0ICAgIFx0ZGF0YS5pdGVtX2lkID0gcGFyZW50Q2hpbGRzTGlzdFtkYXRhLm5ld19pbmRleF0uaWQ7XHJcblxyXG5cdFx0XHQgICAgXHRkYXRhLmxhbmcgPSAnZnInO1xyXG5cclxuXHRcdFx0ICAgIFx0aWYgKGV2ZW50LnNvdXJjZS5pbmRleCAhPSBkYXRhLm5ld19pbmRleCB8fCBkYXRhLnBhcmVudF9pZCAhPSBkYXRhLm9sZF9wYXJlbnRfaWQpIHtcclxuXHJcblx0XHRcdCAgICBcdFx0cGFnZXNSZXBvc2l0b3J5LnJlb3JkZXIoZGF0YSwgZnVuY3Rpb24oKVxyXG5cdFx0XHQgICAgXHRcdHtcclxuXHRcdFx0ICAgIFx0XHRcdCRyb290U2NvcGUuJGJyb2FkY2FzdCgnc2l0ZU1hcFVwZGF0ZWRCeVNpdGVNYXAnKTtcclxuXHRcdFx0ICAgIFx0XHR9KTtcclxuXHJcblx0XHRcdCAgICBcdH07XHJcblx0XHRcdCAgICBcdC8vY29uc29sZS5sb2cocGFyZW50Q2hpbGRzTGlzdCk7XHJcblx0XHRcdCAgICBcdFxyXG5cdFx0XHQgICAgXHQvL2NvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuXHRcdFx0ICAgICAgcmV0dXJuIHRydWU7XHJcblx0XHRcdCAgICB9LFxyXG5cdFx0XHQgIH07XHJcblxyXG5cclxuXHRcdCAgZnVuY3Rpb24gZ2V0RGF0YSgpXHJcblx0XHQgIHtcclxuXHRcdCAgXHRwYWdlc1JlcG9zaXRvcnkuc2l0ZU1hcCgkc2NvcGUudHJlZUN1bHR1cmUsIGZ1bmN0aW9uKGRhdGEpXHJcblx0XHQgIFx0e1xyXG5cdFx0ICBcdFx0JHNjb3BlLmRhdGEgPSBkYXRhO1xyXG5cdFx0ICBcdH0pXHJcblx0XHQgIH1cclxuXHJcblx0XHQgICRzY29wZS4kd2F0Y2goJ3RyZWVDdWx0dXJlJywgZnVuY3Rpb24obmV3VmFsdWUpXHJcblx0XHQgIHtcclxuXHRcdCAgXHRnZXREYXRhKCk7XHJcblx0XHQgIH0pO1xyXG5cclxuXHRcdCAgZ2V0RGF0YSgpO1xyXG5cclxuXHRcdCAgJHNjb3BlLiRvbignc2l0ZU1hcFVwZGF0ZWRCeVBhZ2VDdHJsJywgZnVuY3Rpb24oKSB7XHJcblx0XHQgICAgICBnZXREYXRhKCk7XHJcblx0XHQgIH0pO1xyXG5cdFx0fVxyXG5cdH07XHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuUGFnZXMuUmVwb3NpdG9yaWVzJyApLmZhY3RvcnkoJ01lbnVzSXRlbXNSZXBvc2l0b3J5JywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcbiAgcmV0dXJuIHsgXHJcbiAgICBHZXRJdGVtc1RyZWUgOiBmdW5jdGlvbihtZW51SWQsIGNhbGxiYWNrKVxyXG4gICAge1xyXG4gICAgICAkaHR0cC5nZXQoJy9hZG1pbl9tZW51cy9pdGVtc19saXN0LycrbWVudUlkICsgJy90cnVlJylcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChkYXRhKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIEdldEl0ZW1zIDogZnVuY3Rpb24obWVudUlkKVxyXG4gICAge1xyXG4gICAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYWRtaW5fbWVudXMvaXRlbXNfbGlzdC8nICsgbWVudUlkKTtcclxuICAgIH0sXHJcbiAgXHRHZXRJdGVtIDogZnVuY3Rpb24oaWQsIGNhbGxiYWNrKVxyXG4gIFx0e1xyXG4gICAgICAkaHR0cC5nZXQoJy9hZG1pbl9tZW51cy9pdGVtX2RldGFpbHMvJytpZClcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChkYXRhKTtcclxuICAgICAgICAgIH0pO1xyXG4gIFx0fSxcclxuICBcdFNhdmVJdGVtIDogZnVuY3Rpb24oZGF0YSwgY2FsbGJhY2spXHJcbiAgXHR7XHJcbiAgICAgICRodHRwKHtcclxuICAgICAgICAgIHVybDogJy9hZG1pbl9tZW51cy9pdGVtX2VkaXQnLFxyXG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgIGFsZXJ0ID0gJ1VuZSBlcnJldXJlIGVzdCBzdXJ2ZW51ZS4nO1xyXG4gICAgICAgICAgfSk7XHJcbiAgXHR9LFxyXG4gICAgUmVvcmRlckl0ZW0gOiBmdW5jdGlvbihkYXRhLCBjYWxsYmFjaylcclxuICAgIHtcclxuICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgdXJsOiAnL2FkbWluX21lbnVzL2l0ZW1fcmVvcmRlcicsXHJcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgYWxlcnQgPSAnVW5lIGVycmV1cmUgZXN0IHN1cnZlbnVlLic7XHJcbiAgICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgXHREZWxldGVJdGVtIDogZnVuY3Rpb24oaWQsIGNhbGxiYWNrKVxyXG4gIFx0eyAgXHJcbiAgICAgICRodHRwLmdldCgnL2FkbWluX21lbnVzL2l0ZW1fZGVsZXRlLycraWQpXHJcbiAgICAgICAgICAuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBjYWxsYmFjayAoZGF0YSk7XHJcbiAgICAgICAgICB9KTtcclxuICBcdH1cclxuICB9XHJcblxyXG4gfV0pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5QYWdlcy5SZXBvc2l0b3JpZXMnICkuZmFjdG9yeSgnTWVudXNNZW51c1JlcG9zaXRvcnknLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuICByZXR1cm4geyBcclxuICBcdEdldEl0ZW0gOiBmdW5jdGlvbihpZCwgY2FsbGJhY2spXHJcbiAgXHR7XHJcbiAgICAgICRodHRwLmdldCgnL2FkbWluX21lbnVzL21lbnVfZGV0YWlscy8nK2lkKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sgKGRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgXHR9LFxyXG4gIFx0U2F2ZUl0ZW0gOiBmdW5jdGlvbihkYXRhLCBjYWxsYmFjaylcclxuICBcdHtcclxuICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgdXJsOiAnL2FkbWluX21lbnVzL21lbnVfZWRpdCcsXHJcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfVxyXG4gICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgYWxlcnQgPSAnVW5lIGVycmV1cmUgZXN0IHN1cnZlbnVlLic7XHJcbiAgICAgICAgICB9KTtcclxuICBcdH0sXHJcbiAgXHREZWxldGVJdGVtIDogZnVuY3Rpb24oaWQsIGNhbGxiYWNrKVxyXG4gIFx0e1xyXG4gICAgICAkaHR0cC5nZXQoJy9hZG1pbl9tZW51cy9tZW51X2RlbGV0ZS8nK2lkKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY2FsbGJhY2sgKGRhdGEpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgXHR9XHJcbiAgfVxyXG5cclxuIH1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuUGFnZXMuUmVwb3NpdG9yaWVzJyApLmZhY3RvcnkoJ1BhZ2VzUmVwb3NpdG9yeScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG4gIHJldHVybiB7IFxyXG4gICAgZ2V0UGFnZSA6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICAgIHtcclxuICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fcGFnZXMvcGFnZXNfZGV0YWlscy8nK2lkKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LCAgICBcclxuICAgIHNhdmVQYWdlIDogZnVuY3Rpb24ocGFnZV9kYXRhLCB0ZW1wbGF0ZV92YWx1ZXMsIGNhbGxiYWNrKVxyXG4gICAge1xyXG4gICAgICB2YXIgZGF0YSA9IHt9O1xyXG5cclxuICAgICAgZGF0YS5wYWdlX2RhdGEgPSBwYWdlX2RhdGE7XHJcblxyXG4gICAgICBpZiAocGFnZV9kYXRhLnR5cGUgPT09ICd0ZW1wbGF0ZScpIHtcclxuICAgICAgICBkYXRhLnRlbXBsYXRlX3ZhbHVlcyA9IHRlbXBsYXRlX3ZhbHVlcztcclxuICAgICAgfTtcclxuXHJcbiAgICAgICAkaHR0cCh7XHJcbiAgICAgICAgICAgIHVybDogJy9hZG1pbl9wYWdlcy9wYWdlX2VkaXQnLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCA9ICdVbmUgZXJyZXVyZSBlc3Qgc3VydmVudWUuJztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZGVsZXRlUGFnZSA6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICAgIHtcclxuICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fcGFnZXMvcGFnZXNfZGVsZXRlLycgKyBpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHJlb3JkZXIgOiBmdW5jdGlvbihkYXRhLCBjYWxsYmFjaylcclxuICAgIHtcclxuICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW5fcGFnZXMvcGFnZV9yZW9yZGVyJyxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9XHJcbiAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCA9ICdVbmUgZXJyZXVyZSBlc3Qgc3VydmVudWUuJztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZ2V0UGFnZU9yZGVyIDogZnVuY3Rpb24oaWQsIGNhbGxiYWNrKVxyXG4gICAge1xyXG4gICAgICAkaHR0cC5nZXQoJy9hZG1pbl9wYWdlcy9nZXRfcGFnZV9vcmRlci8nICsgaWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpOyAgXHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZ2V0UGFnZUxpc3QgOiBmdW5jdGlvbihsYW5nLCBjYWxsYmFjaylcclxuICAgIHtcclxuICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fcGFnZXMvcGFnZXNfbGlzdC8wLzAvJyArIGxhbmcpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpOyAgXHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgc2l0ZU1hcCA6IGZ1bmN0aW9uKGxhbmcsIGNhbGxiYWNrKVxyXG4gICAge1xyXG4gICAgICAkaHR0cC5nZXQoJy9hZG1pbl9wYWdlcy9zaXRlX21hcC8nK2xhbmcpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAge1xyXG4gICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9OyBcclxufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdQZWFrcy5QYWdlcy5SZXBvc2l0b3JpZXMnKS5mYWN0b3J5KCdUZW1wbGF0ZXNSZXBvc2l0b3J5JywgWyckaHR0cCcsIGZ1bmN0aW9uKCRodHRwKXtcclxuXHJcblx0dmFyIHRlbXBsYXRlc0NhY2hlID0gbmV3IEFycmF5KCk7XHJcblxyXG5cdHJldHVybiB7IFxyXG4gICAgZ2V0VGVtcGxhdGUgOiBmdW5jdGlvbihpZCwgY2FsbGJhY2spXHJcbiAgICB7XHJcbiAgICAgICRodHRwLmdldCgnL2FkbWluX3BhZ2VzL3RlbXBsYXRlc19kZXRhaWxzLycraWQpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBnZXRUZW1wbGF0ZUZpbGVzIDogZnVuY3Rpb24oY2FsbGJhY2spXHJcbiAgICB7XHJcbiAgICAgICRodHRwLmdldCgnL2FkbWluX3BhZ2VzL3RlbXBsYXRlX2ZpbGVzX2xpc3QnKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgIHtcclxuICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZXRUZW1wbGF0ZXMgOiBmdW5jdGlvbihjYWxsYmFjaylcclxuICAgIHtcclxuICAgICAgJGh0dHAuZ2V0KCcuL2FkbWluX3BhZ2VzL3RlbXBsYXRlc19saXN0Jykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHNhdmVUZW1wbGF0ZSA6IGZ1bmN0aW9uKGRhdGEsIGNhbGxiYWNrKVxyXG4gICAge1xyXG4gICAgICAgJGh0dHAoe1xyXG4gICAgICAgICAgICB1cmw6ICcvYWRtaW5fcGFnZXMvdGVtcGxhdGVzX2VkaXQnLFxyXG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ31cclxuICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCA9ICdVbmUgZXJyZXVyZSBlc3Qgc3VydmVudWUuJztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgZGVsZXRlVGVtcGxldGUgOiBmdW5jdGlvbihpZCwgY2FsbGJhY2spXHJcbiAgICB7XHJcbiAgICAgICRodHRwLmdldCgnL2FkbWluX3BhZ2VzL3RlbXBsYXRlc19kZWxldGUvJyArIGlkKS5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgIHtcclxuICAgICAgICBjYWxsYmFjayhkYXRhKTtcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBnZXRUZW1wbGF0ZUZpZWxkcyA6IGZ1bmN0aW9uKGlkLCBjYWxsYmFjaylcclxuICAgIHtcclxuICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fcGFnZXMvdGVtcGxhdGVzX2ZpZWxkc19saXN0LycgKyBpZCkuc3VjY2VzcyhmdW5jdGlvbihkYXRhKVxyXG4gICAgICB7XHJcbiAgICAgICAgY2FsbGJhY2soZGF0YSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH07IFxyXG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9