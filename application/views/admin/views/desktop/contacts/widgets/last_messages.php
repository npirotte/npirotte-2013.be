<div>
	<h3>Dernier messages :</h3>
	<a ng-repeat="item in items" class="item well btn-ripple" href="#/contacts/messages">
		<h4>{{item.sender}}</h4>
	    <span class="date">{{item.created_on}}</span>
	</a>
	<a href="#/contacts/messages" class="btn btn-primary">Voir tout <i class="icon-plus-sign"></i></a>
</div>