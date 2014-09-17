admin.factory('assetsRepository', ['$http', function($http){

  	return { 
        EditAsset : function(data, callback)
        {
          $http({
            url: '/admin_assets/asset_edit',
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
        AssetsByParent : function(parentId, parentIdentity, callback)
        {
          $http.get('/admin_assets/assets_images_by_parent/'+parentId+'/'+parentIdentity)
            .success(function(data)
            {
              callback(data);
            });
        }
     }; 
}]);