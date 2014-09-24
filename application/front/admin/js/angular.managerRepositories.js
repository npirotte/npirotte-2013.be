admin.factory('usersRespository', ['$http', function($http){

	var userInfosCache = new Array();

  	return { 
           userInfos: function (id, callback) { 
           	console.log(userInfosCache);
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

admin.factory('groupsRespository', ['$http', function($http){
    var userGroupsCache = [];

    return { 
        GetGroups : function(callback)
        {
          if (userGroupsCache.length > 0) {
            callback(userGroupsCache);
          };

          $http.get('/admin_manager/user_groups_list').success(function(data)
          {
            console.log(data);
            userGroupsCache = data.items; 
            callback(data.items);
          });
        },
        GetGroup : function(id, callback)
        {
          $http.get('/admin_manager/user_group_details/' + id).success(function(data)
          {
            data.ugrp_admin = data.ugrp_admin == 1;
            callback(data);
          });
        },
        SaveGroup : function(data, callback)
        {
          $http({
              url: '/admin_manager/user_group_edit',
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
        DeleteGroup : function(id, callback)
        {
          $http.get('/admin_manager/user_group_delete/' + id).success(function()
          {
            callback();
          });
        }
     }; 
}]);

admin.factory('logsRepository', ['$http', '_', function($http){

  var logListCache = new Array(),
      logDetailsCache = new Array();

  return {
    logList : function(getOld, callback)
    {
      var offset = 0,
          url;

      if (logListCache.length > 0 ) {
        callback(logListCache);
      };

      if (getOld) {
          offset = logListCache.length;
      };

      url = '/admin_manager/logs_list/4/' + offset;

      $http.get(url).success(function(data)
      {
        console.log(data);
        data.items.forEach(function(item)
        {
          logListCache.push(item);
        });
        callback(logListCache, data.total_items);
      });
    },
    logDetails : function(name, callback)
    {
      if (false) {
        callback(logDetailsCache[name])
      }
      else
      {
        $http.get('/admin_manager/log_details/' + name)
        .success(function(data)
        {
          console.log(data);
          callback(data);
          //logDetailsCache[name] = data;
        });
      }
    },
    deleteLogs : function()
    {
      $http.get('/admin_manager/delete_logs')
      .success(function(data)
      {
        callback(data);
        logListCache = new Array();
      });
    }
  }
}]);