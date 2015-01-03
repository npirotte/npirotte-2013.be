angular.module('Peaks.Contacts.Repositories').factory('ContactsRepository', ['$http', '_', function($http){

  var messagesListCache = new Array();
  var messageDetailsCache = new Array();

  // stockage des données quand on quite la page

  function storeData(data)
  {
    //alert('ok');
  }

	return { 
         messagesList: function (isSpam, callback, getOld) { 

          var max_id,
              offset,
              url;

         		// récupère ce qui existe dans le cache
            if (messagesListCache.length > 0 && !getOld) {
              callback(messagesListCache);
              max_id = _.max(messagesListCache, function(item){ return item.id });
              max_id = max_id.id;
            };

          if (getOld) {
            offset = _.min(messagesListCache, function(item){ return item.id });
            offset = offset.id
          };

           url = max_id ? '/admin_contact/messages_list/'+isSpam+'?max_id='+max_id : '/admin_contact/messages_list/'+isSpam+'/5/' + offset;

         			// on récupère l'info du serveur
       			$http.get(url)
				    .success(function(data)
				    {

              data.items.forEach(function(item)
              {
                var sender = _.findWhere(item.fields[0], {field_name : 'Email'});
                item.sender = sender ? sender.field_value : 'Inconnu';
                messagesListCache.push(item);
              });

				    	callback(messagesListCache, data.total_items);
              storeData(messagesListCache);
              
				    });
         		
         },

         searchItem : function(isSpam, query, callback, getOld)
         {
          var url, 
            offset;

          if (getOld) {
            offset = _.min($scope.items, function(item){ return item.id });
            offset = offset.id
          };

          url = '/admin_contact/messages_list/'+isSpam+'?query='+query;

          $http.get(url)
          .success(function(data)
          {
            var i = 0;
            data.items.forEach(function(item)
            {
              var sender = _.findWhere(item.fields[0], {field_name : 'Email'});
              item.sender = sender ? sender.field_value : 'Inconnu';
              data.items[i++] = item;
            });

            callback(data);
          });
         },

         messageDetails: function(id, callback)
         {
            if (messageDetailsCache[id]) 
            {
              callback(messageDetailsCache[id]);
            }
            else
            {
              $http.get('/admin_contact/message/'+id)
              .success(function(data)
              {
                callback(data);
                messageDetailsCache[id] = data;
              })
            }
         },

         unreadMessagesNbr: function(callback)
         {
          $http.get('/admin_contact/unread_messages_nbr')
          .success(function(data)
          {
            data.count = parseInt(data.count);
            callback(data);
          })
         },

         lastMessage: function(callback)
         {
          $http.get('/admin_contact/messages_list/0/2/0')
          .success(function(data)
          {
            var i = 0;
            data.items.forEach(function(item)
            {
              var sender = _.findWhere(item.fields[0], {field_name : 'Email'});
              item.sender = sender ? sender.field_value : 'Inconnu';
              data.items[i++] = item;
            });
            
            callback(data);
          });
         }
     }; 
}]);