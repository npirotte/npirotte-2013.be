angular.module('Peaks.Contacts.Repositories').factory('FormsRespository', ['$http', function($http){
  return {
    Get : function(id)
    {
      return $http.get('/admin_forms/form_details/'+id);
    },
    Delete : function(id)
    {
      return $http.get('/admin_forms/form_delete/'+id);
    },
    Save : function(data)
    {
      return $http({
        url: '/admin_forms/form_edit',
        method: "POST",
        data: data,
        headers: {'Content-Type': 'application/json'}
        });
    }
  }
}]);