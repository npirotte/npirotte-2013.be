angular.module('admin').factory('ScopeCacheProvider', ['$rootScope', function($rootScope){

	var _cache = {};

	return {
		Get : function(key)
		{
			return _cache[key] || false;
		},
		Set : function(key, scopeData)
		{
			_cache[key] = scopeData;
			console.log(_cache);
		},
		CreateTab : function(tabName, tabUrl)
		{
			$rootScope.$broadcast('TabCreated', {tabName : tabName, tabUrl : tabUrl});
		}
	};
}])