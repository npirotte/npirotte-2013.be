angular.module('Peaks.Global', ['Peaks.Global.Repositories', 'Peaks.Global.Services', 'Peaks.Global.Directives']);
angular.module('Peaks.Global.Services', []);
angular.module('Peaks.Global.Directives', []);
angular.module('Peaks.Global.Repositories', [])
angular.module('Peaks.Global.Directives').directive('iconsPicker', ['IconsRepository', function(iconsRepository){

  return {
    scope: {
      icon : '=ngModel'
    },
    template: '<script type="text/ng-template" id="customTemplate.html"><a><i class="fa {{match.label}}"></i>&nbsp;&nbsp;<span ng-bind-html="match.label | typeaheadHighlight:query" ></span></a></script><div class="input-group"><input class="form-control" type="text" ng-model="icon" typeahead="icon for icon in faIcons | filter:$viewValue | limitTo:8" typeahead-template-url="customTemplate.html" class="form-control" /><div class="input-group-addon"><i class="fa {{icon}}"></i></div></div>',
    link: function(scope, iElm, iAttr, controller)
    {
      scope.faIcons = [];

      iconsRepository.IconList(function(data)
      {
        scope.faIcons = data;
      });
    }

  }

}]);
angular.module('Peaks.Global.Repositories').factory('IconsRepository', ['$http', function($http){

	var iconsCache = false;

  	return { 
        IconList : function(callback)
        {
        	if (iconsCache) {
        		callback(iconsCache);
        		return;
        	};

         	$http.get('/admin_helpers/icons_list')
            .success(function(data)
            {
            	iconsCache = data;
              	callback(iconsCache);
            });
        }
     }; 
}]);
angular.module('Peaks.Global.Repositories').factory('TagsRespository', ['$http', function($http){

	var userInfosCache = new Array();

  	return { 
        tagNamesList : function(callback)
        {
          $http.get('/admin_global/tag_name_list')
            .success(function(data)
            {
              callback(data);
            });
        }
     }; 
}]);

angular.module('Peaks.Global.Services').factory('UrlService', 
  ['$http', 'PagesRepository', 
  function($http, pagesRepository){

  // cache mémoire

  var cache = {
    Page : false,
    News : {
      category : false,
      item : false
    },
    Portfolio : {
      category : false,
      item : false
    }
  }

  // modèle
  function RouteModel(value, name)
  {
    return {value : value, name : name}
  }

  // functions

  function getPagesElements(callback)
  {
    if (cache.Pages) {
       callback(cache.Pages);
    };
    pagesRepository.getPageList('fr', function(data)
    {
      cache.Pages = data.items;
      callback(cache.Pages);
    });
  }

  function getNewsElements(urlFunction, callback)
  {
    if (cache.News[urlFunction]) {
       callback(cache.News[urlFunction]);
    };
    switch(urlFunction)
    {
      case 'category':
         $http.get('/admin_news/categories_list')
          .success(function(data)
          {
            cache.News[urlFunction] = data.items;
            cache.News[urlFunction].unshift({ id : 'all', title : 'Toutes'});
            callback(cache.News[urlFunction]);
          });
        break;
      case 'item':
         $http.get('/admin_news/news_list')
          .success(function(data)
          {
            cache.News[urlFunction] = data.items;
            callback(cache.News[urlFunction]);
          });
        break;
    }
  }

  function getPortfolioElements(urlFunction, callback)
  {
    if (cache.Portfolio[urlFunction]) {
       callback(cache.Portfolio[urlFunction]);
    };
    switch(urlFunction)
    {
      case 'category':
         $http.get('/admin_portfolio/categories_list')
          .success(function(data)
          {
            cache.Portfolio[urlFunction] = data.items;
            cache.Portfolio[urlFunction].unshift({ id : 'all', title : 'Toutes'});
            callback(cache.Portfolio[urlFunction]);
          });
        break;
      case 'item':
         $http.get('/admin_portfolio/portfolio_list')
          .success(function(data)
          {
            cache.Portfolio[urlFunction] = data.items;
            callback(cache.Portfolio[urlFunction]);
          });
        break;
    }
  }

  return { 
  	GetFunctions : function(module)
  	{
      var response = [];

      switch(module)
      {
        case 'pages':
          response = [RouteModel('page', 'Page')];
          break;
        case 'news':
          response = [
            RouteModel('category', 'Catégorie'),
            RouteModel('item', 'News'),
          ]
          break;
        case 'portfolio':
          response = [
            RouteModel('category', 'Catégorie'),
            RouteModel('item', 'Projet'),
          ]
          break;
        default :
          response = [];
          break;
      }   

      return response;   
  	},
    GetElements : function(module, urlFunction, callback)
    {
      switch(module)
      {
        case 'pages':
          getPagesElements(callback);
          break;
        case 'news':
          response = getNewsElements(urlFunction, callback)
          break;
        case 'portfolio':
          response = getPortfolioElements(urlFunction, callback)
          break;
        default :
          response = [];
          break;
      } 
    }
  }

 }]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9nbG9iYWwubW9kdWxlLmpzIiwiZGlyLmljb25zUGlja2VyLmpzIiwicmVwby5pY29ucy5qcyIsInJlcG8udGFncy5qcyIsInNlcnYudXJscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2xvYmFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkdsb2JhbCcsIFsnUGVha3MuR2xvYmFsLlJlcG9zaXRvcmllcycsICdQZWFrcy5HbG9iYWwuU2VydmljZXMnLCAnUGVha3MuR2xvYmFsLkRpcmVjdGl2ZXMnXSk7XHJcbmFuZ3VsYXIubW9kdWxlKCdQZWFrcy5HbG9iYWwuU2VydmljZXMnLCBbXSk7XHJcbmFuZ3VsYXIubW9kdWxlKCdQZWFrcy5HbG9iYWwuRGlyZWN0aXZlcycsIFtdKTtcclxuYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkdsb2JhbC5SZXBvc2l0b3JpZXMnLCBbXSkiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuR2xvYmFsLkRpcmVjdGl2ZXMnKS5kaXJlY3RpdmUoJ2ljb25zUGlja2VyJywgWydJY29uc1JlcG9zaXRvcnknLCBmdW5jdGlvbihpY29uc1JlcG9zaXRvcnkpe1xyXG5cclxuICByZXR1cm4ge1xyXG4gICAgc2NvcGU6IHtcclxuICAgICAgaWNvbiA6ICc9bmdNb2RlbCdcclxuICAgIH0sXHJcbiAgICB0ZW1wbGF0ZTogJzxzY3JpcHQgdHlwZT1cInRleHQvbmctdGVtcGxhdGVcIiBpZD1cImN1c3RvbVRlbXBsYXRlLmh0bWxcIj48YT48aSBjbGFzcz1cImZhIHt7bWF0Y2gubGFiZWx9fVwiPjwvaT4mbmJzcDsmbmJzcDs8c3BhbiBuZy1iaW5kLWh0bWw9XCJtYXRjaC5sYWJlbCB8IHR5cGVhaGVhZEhpZ2hsaWdodDpxdWVyeVwiID48L3NwYW4+PC9hPjwvc2NyaXB0PjxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPjxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIHR5cGU9XCJ0ZXh0XCIgbmctbW9kZWw9XCJpY29uXCIgdHlwZWFoZWFkPVwiaWNvbiBmb3IgaWNvbiBpbiBmYUljb25zIHwgZmlsdGVyOiR2aWV3VmFsdWUgfCBsaW1pdFRvOjhcIiB0eXBlYWhlYWQtdGVtcGxhdGUtdXJsPVwiY3VzdG9tVGVtcGxhdGUuaHRtbFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgLz48ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXAtYWRkb25cIj48aSBjbGFzcz1cImZhIHt7aWNvbn19XCI+PC9pPjwvZGl2PjwvZGl2PicsXHJcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgaUVsbSwgaUF0dHIsIGNvbnRyb2xsZXIpXHJcbiAgICB7XHJcbiAgICAgIHNjb3BlLmZhSWNvbnMgPSBbXTtcclxuXHJcbiAgICAgIGljb25zUmVwb3NpdG9yeS5JY29uTGlzdChmdW5jdGlvbihkYXRhKVxyXG4gICAgICB7XHJcbiAgICAgICAgc2NvcGUuZmFJY29ucyA9IGRhdGE7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICB9XHJcblxyXG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkdsb2JhbC5SZXBvc2l0b3JpZXMnKS5mYWN0b3J5KCdJY29uc1JlcG9zaXRvcnknLCBbJyRodHRwJywgZnVuY3Rpb24oJGh0dHApe1xyXG5cclxuXHR2YXIgaWNvbnNDYWNoZSA9IGZhbHNlO1xyXG5cclxuICBcdHJldHVybiB7IFxyXG4gICAgICAgIEljb25MaXN0IDogZnVuY3Rpb24oY2FsbGJhY2spXHJcbiAgICAgICAge1xyXG4gICAgICAgIFx0aWYgKGljb25zQ2FjaGUpIHtcclxuICAgICAgICBcdFx0Y2FsbGJhY2soaWNvbnNDYWNoZSk7XHJcbiAgICAgICAgXHRcdHJldHVybjtcclxuICAgICAgICBcdH07XHJcblxyXG4gICAgICAgICBcdCRodHRwLmdldCgnL2FkbWluX2hlbHBlcnMvaWNvbnNfbGlzdCcpXHJcbiAgICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgXHRpY29uc0NhY2hlID0gZGF0YTtcclxuICAgICAgICAgICAgICBcdGNhbGxiYWNrKGljb25zQ2FjaGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgfTsgXHJcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnUGVha3MuR2xvYmFsLlJlcG9zaXRvcmllcycpLmZhY3RvcnkoJ1RhZ3NSZXNwb3NpdG9yeScsIFsnJGh0dHAnLCBmdW5jdGlvbigkaHR0cCl7XHJcblxyXG5cdHZhciB1c2VySW5mb3NDYWNoZSA9IG5ldyBBcnJheSgpO1xyXG5cclxuICBcdHJldHVybiB7IFxyXG4gICAgICAgIHRhZ05hbWVzTGlzdCA6IGZ1bmN0aW9uKGNhbGxiYWNrKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICRodHRwLmdldCgnL2FkbWluX2dsb2JhbC90YWdfbmFtZV9saXN0JylcclxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgfTsgXHJcbn1dKTtcclxuIiwiYW5ndWxhci5tb2R1bGUoJ1BlYWtzLkdsb2JhbC5TZXJ2aWNlcycpLmZhY3RvcnkoJ1VybFNlcnZpY2UnLCBcclxuICBbJyRodHRwJywgJ1BhZ2VzUmVwb3NpdG9yeScsIFxyXG4gIGZ1bmN0aW9uKCRodHRwLCBwYWdlc1JlcG9zaXRvcnkpe1xyXG5cclxuICAvLyBjYWNoZSBtw6ltb2lyZVxyXG5cclxuICB2YXIgY2FjaGUgPSB7XHJcbiAgICBQYWdlIDogZmFsc2UsXHJcbiAgICBOZXdzIDoge1xyXG4gICAgICBjYXRlZ29yeSA6IGZhbHNlLFxyXG4gICAgICBpdGVtIDogZmFsc2VcclxuICAgIH0sXHJcbiAgICBQb3J0Zm9saW8gOiB7XHJcbiAgICAgIGNhdGVnb3J5IDogZmFsc2UsXHJcbiAgICAgIGl0ZW0gOiBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gbW9kw6hsZVxyXG4gIGZ1bmN0aW9uIFJvdXRlTW9kZWwodmFsdWUsIG5hbWUpXHJcbiAge1xyXG4gICAgcmV0dXJuIHt2YWx1ZSA6IHZhbHVlLCBuYW1lIDogbmFtZX1cclxuICB9XHJcblxyXG4gIC8vIGZ1bmN0aW9uc1xyXG5cclxuICBmdW5jdGlvbiBnZXRQYWdlc0VsZW1lbnRzKGNhbGxiYWNrKVxyXG4gIHtcclxuICAgIGlmIChjYWNoZS5QYWdlcykge1xyXG4gICAgICAgY2FsbGJhY2soY2FjaGUuUGFnZXMpO1xyXG4gICAgfTtcclxuICAgIHBhZ2VzUmVwb3NpdG9yeS5nZXRQYWdlTGlzdCgnZnInLCBmdW5jdGlvbihkYXRhKVxyXG4gICAge1xyXG4gICAgICBjYWNoZS5QYWdlcyA9IGRhdGEuaXRlbXM7XHJcbiAgICAgIGNhbGxiYWNrKGNhY2hlLlBhZ2VzKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZ2V0TmV3c0VsZW1lbnRzKHVybEZ1bmN0aW9uLCBjYWxsYmFjaylcclxuICB7XHJcbiAgICBpZiAoY2FjaGUuTmV3c1t1cmxGdW5jdGlvbl0pIHtcclxuICAgICAgIGNhbGxiYWNrKGNhY2hlLk5ld3NbdXJsRnVuY3Rpb25dKTtcclxuICAgIH07XHJcbiAgICBzd2l0Y2godXJsRnVuY3Rpb24pXHJcbiAgICB7XHJcbiAgICAgIGNhc2UgJ2NhdGVnb3J5JzpcclxuICAgICAgICAgJGh0dHAuZ2V0KCcvYWRtaW5fbmV3cy9jYXRlZ29yaWVzX2xpc3QnKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY2FjaGUuTmV3c1t1cmxGdW5jdGlvbl0gPSBkYXRhLml0ZW1zO1xyXG4gICAgICAgICAgICBjYWNoZS5OZXdzW3VybEZ1bmN0aW9uXS51bnNoaWZ0KHsgaWQgOiAnYWxsJywgdGl0bGUgOiAnVG91dGVzJ30pO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhjYWNoZS5OZXdzW3VybEZ1bmN0aW9uXSk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSAnaXRlbSc6XHJcbiAgICAgICAgICRodHRwLmdldCgnL2FkbWluX25ld3MvbmV3c19saXN0JylcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhY2hlLk5ld3NbdXJsRnVuY3Rpb25dID0gZGF0YS5pdGVtcztcclxuICAgICAgICAgICAgY2FsbGJhY2soY2FjaGUuTmV3c1t1cmxGdW5jdGlvbl0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXRQb3J0Zm9saW9FbGVtZW50cyh1cmxGdW5jdGlvbiwgY2FsbGJhY2spXHJcbiAge1xyXG4gICAgaWYgKGNhY2hlLlBvcnRmb2xpb1t1cmxGdW5jdGlvbl0pIHtcclxuICAgICAgIGNhbGxiYWNrKGNhY2hlLlBvcnRmb2xpb1t1cmxGdW5jdGlvbl0pO1xyXG4gICAgfTtcclxuICAgIHN3aXRjaCh1cmxGdW5jdGlvbilcclxuICAgIHtcclxuICAgICAgY2FzZSAnY2F0ZWdvcnknOlxyXG4gICAgICAgICAkaHR0cC5nZXQoJy9hZG1pbl9wb3J0Zm9saW8vY2F0ZWdvcmllc19saXN0JylcclxuICAgICAgICAgIC5zdWNjZXNzKGZ1bmN0aW9uKGRhdGEpXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIGNhY2hlLlBvcnRmb2xpb1t1cmxGdW5jdGlvbl0gPSBkYXRhLml0ZW1zO1xyXG4gICAgICAgICAgICBjYWNoZS5Qb3J0Zm9saW9bdXJsRnVuY3Rpb25dLnVuc2hpZnQoeyBpZCA6ICdhbGwnLCB0aXRsZSA6ICdUb3V0ZXMnfSk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGNhY2hlLlBvcnRmb2xpb1t1cmxGdW5jdGlvbl0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgJ2l0ZW0nOlxyXG4gICAgICAgICAkaHR0cC5nZXQoJy9hZG1pbl9wb3J0Zm9saW8vcG9ydGZvbGlvX2xpc3QnKVxyXG4gICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSlcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgY2FjaGUuUG9ydGZvbGlvW3VybEZ1bmN0aW9uXSA9IGRhdGEuaXRlbXM7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGNhY2hlLlBvcnRmb2xpb1t1cmxGdW5jdGlvbl0pO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4geyBcclxuICBcdEdldEZ1bmN0aW9ucyA6IGZ1bmN0aW9uKG1vZHVsZSlcclxuICBcdHtcclxuICAgICAgdmFyIHJlc3BvbnNlID0gW107XHJcblxyXG4gICAgICBzd2l0Y2gobW9kdWxlKVxyXG4gICAgICB7XHJcbiAgICAgICAgY2FzZSAncGFnZXMnOlxyXG4gICAgICAgICAgcmVzcG9uc2UgPSBbUm91dGVNb2RlbCgncGFnZScsICdQYWdlJyldO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnbmV3cyc6XHJcbiAgICAgICAgICByZXNwb25zZSA9IFtcclxuICAgICAgICAgICAgUm91dGVNb2RlbCgnY2F0ZWdvcnknLCAnQ2F0w6lnb3JpZScpLFxyXG4gICAgICAgICAgICBSb3V0ZU1vZGVsKCdpdGVtJywgJ05ld3MnKSxcclxuICAgICAgICAgIF1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3BvcnRmb2xpbyc6XHJcbiAgICAgICAgICByZXNwb25zZSA9IFtcclxuICAgICAgICAgICAgUm91dGVNb2RlbCgnY2F0ZWdvcnknLCAnQ2F0w6lnb3JpZScpLFxyXG4gICAgICAgICAgICBSb3V0ZU1vZGVsKCdpdGVtJywgJ1Byb2pldCcpLFxyXG4gICAgICAgICAgXVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdCA6XHJcbiAgICAgICAgICByZXNwb25zZSA9IFtdO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH0gICBcclxuXHJcbiAgICAgIHJldHVybiByZXNwb25zZTsgICBcclxuICBcdH0sXHJcbiAgICBHZXRFbGVtZW50cyA6IGZ1bmN0aW9uKG1vZHVsZSwgdXJsRnVuY3Rpb24sIGNhbGxiYWNrKVxyXG4gICAge1xyXG4gICAgICBzd2l0Y2gobW9kdWxlKVxyXG4gICAgICB7XHJcbiAgICAgICAgY2FzZSAncGFnZXMnOlxyXG4gICAgICAgICAgZ2V0UGFnZXNFbGVtZW50cyhjYWxsYmFjayk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICduZXdzJzpcclxuICAgICAgICAgIHJlc3BvbnNlID0gZ2V0TmV3c0VsZW1lbnRzKHVybEZ1bmN0aW9uLCBjYWxsYmFjaylcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ3BvcnRmb2xpbyc6XHJcbiAgICAgICAgICByZXNwb25zZSA9IGdldFBvcnRmb2xpb0VsZW1lbnRzKHVybEZ1bmN0aW9uLCBjYWxsYmFjaylcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgcmVzcG9uc2UgPSBbXTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9IFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiB9XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9