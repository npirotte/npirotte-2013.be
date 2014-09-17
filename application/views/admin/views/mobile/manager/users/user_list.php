
<div id="viewTools">
	<a class="btn btn-primary" href="#/manager/comptes/new">Ajouter <i class="icon-plus-sign"></i></a>
</div>

<section id="content">
	<h1>Comptes</h1>
	<hr>

	<div class="row">
		<?php //include('../menu.php'); ?>

		<div class="span12">
	      <div>
	      	Search: <input type="text" ng-model="query">
			<hr>
	          <table class="table table-bordered table-striped table-hover">
	          	<thead>
	          		<th ng-click="orderProp = ''">Id</th>
	          		<th ng-click="orderProp = 'user_id'">Nom d'utilisateur</th>
	          		<th class="hide-sm" ng-click="orderProp = 'prenom'">Email</th>
	          	</thead>
	          	<tbody>

	          		<tr ng-repeat="item in items | filter:query | orderBy:orderProp:reverse">
		          		<td><a href="#/{{section}}/edit/{{item.id}}">#{{item.id}}</a></td>
		          		<td>{{item.user_id}}</td>
		          		<td class="hide-sm">{{item.mail}}</td>
		          	</tr>
	          	</tbody>
	          </table>
	      </div>
		</div>
	</div>
	<br>
</section>


