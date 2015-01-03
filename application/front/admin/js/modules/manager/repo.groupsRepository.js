angular.module('Peaks.Manager.Repositories').factory('GroupsRepository', ['$http', function($http){
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