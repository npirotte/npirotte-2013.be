angular.module('Peaks.Contacts.Repositories').factory('FormFieldsRespository', ['$http', function($http){
  return {
    GetAll : function(parentId)
    {
      return $http.get('/admin_forms/fields_list/'+parentId);
    },
    Delete : function(id)
    {
      return $http.get('/admin_forms/field_delete/'+id);
    },
    Save : function(data)
    {
      return $http({
        url: '/admin_forms/field_edit',
        method: "POST",
        data: data,
        headers: {'Content-Type': 'application/json'}
        });
    }
  }
}]);