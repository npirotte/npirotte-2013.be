angular.module('Peaks.Contacts').controller('ContactFormsList', ['$scope', '$http', '$injector', function($scope, $http, $injector)
{
	var config = {
	    section : "contacts/forms",
	    menu : 'messages',
	    getUrl : '/admin_forms/forms_list/',
	    deleteUrl : '/admin_forms/form_delete/',
	  }

	  $scope.table = [
	      {title : 'Nom', param : 'name'}
	    ];

	  $scope.pageTitle = 'Formulaires de contact';

	  $injector.invoke(ItemList, this, {$scope: $scope, $http: $http, config: config});
}]);