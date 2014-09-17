
<section id="content">
	<h1>Messages</h1>
	<hr>

	<div class="row">
		<?php //include('./menu.php'); ?>

		<div class="span12">
	      <div>
	      	Search: <input type="text" ng-model="query"> <button ng-click="refresh()"><i class="icon-refresh circle-icon"></i></button>
	      	<hr>
	          <table class="table table-bordered table-striped table-hover">
	          	<thead>
	          		<th ng-click="orderProp = 'id'; reverse=!reverse">Id</th>
	          		<th>Message</th>
	          		<th ng-click="orderProp = 'sender'">Mail</th>
	          	</thead>
	          	<tbody>

	          		<tr data-read="{{item.is_read}}" ng-repeat="item in items | filter:query | orderBy:orderProp:reverse">

	          					<td><a href="#/contacts/messages/{{item.id}}">#{{item.id}}</a></td>
				          		<td>{{item.resume}}</td>
				          		<td>{{item.sender}}</td>

		          	</tr>

	          	</tbody>
	          </table>
	      </div>
		</div>
	</div>
</section>
