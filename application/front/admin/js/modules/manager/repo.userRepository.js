angular.module('Peaks.Manager.Repositories').factory('UsersRepository', ['$http', function($http){

	var userInfosCache = new Array();

  	return { 
           userInfos: function (id, callback) { 
           		// on regarde si le cache existe
           		if (userInfosCache['user_' + id]) {
           			// on rend l'object
           			callback(userInfosCache['user_' + id]);
           		}
           		else
           		{
           			// sinon on récupère l'info
           			$http.get('/admin_manager/user_infos/'+id)
				    .success(function(data)
				    {
				    	// on stocke l'utilisateur
				    	userInfosCache['user_' + id] = data;
				    	// on traite le callback
				    	callback (data);
				    });
           		}
           } 
     }; 
}]);