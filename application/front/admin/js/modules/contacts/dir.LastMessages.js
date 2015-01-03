angular.module('Peaks.Contacts.Directives').directive('lastMessages', ['ContactsRepository', function(contactsRepository){

	return {
		scope: {},
		templateUrl: '/admin/view_loader/desktop/contacts/widgets/last_messages',
		link: function(scope, iElm, iAttr, controller)
		{
			function getData()
			{
				contactsRepository.lastMessage(function(data)
				{
					console.log(data);
					scope.items = data.items;
				});
			}

			getData();
		}

	}
}]);