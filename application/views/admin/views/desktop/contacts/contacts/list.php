
<div>
	<h1>Contact</h1>
	<hr>

	<div class="row">
		<?php //include('./menu.php'); ?>

		<div class="col-sm-12">
	      <div>
	      	Search: <input type="text" ng-model="query">
			<hr>
	          <table class="table table-bordered table-striped table-hover">
	          	<thead>
	          		<th ng-click="orderProp = ''">Id</th>
	          		<th ng-click="orderProp = 'nom'">Nom</th>
	          		<th ng-click="orderProp = 'prenom'">Prenom</th>
	          		<th ng-click="orderProp = 'mail'">Mail</th>
	          		<th>Tel.</th>
	          	</thead>
	          	<tbody>

	          		<tr ng-repeat="item in items | filter:query | orderBy:orderProp:reverse">
		          		<td>{{item.id}}</td>
		          		<td>{{item.nom}}</td>
		          		<td>{{item.prenom}}</td>
		          		<td>{{item.mail}}</td>
		          		<td>{{item.phone}}</td>
		          	</tr>

	          	</tbody>
	          </table>
	      </div>
		</div>
	</div>
</div>