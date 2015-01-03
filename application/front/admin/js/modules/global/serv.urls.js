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