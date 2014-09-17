<div id="viewTools">
	<a class="btn btn-primary" href="#/pages/edit/new">Ajouter <i class="icon-plus-sign"></i></a>
</div>



<section id="content">
	<h1>Pages</h1>
	<hr>

	<div class="row-fluid">
		<?php //include('../menu.php'); ?>

		<div class="span12">
		      <div>
		      	Search: <input type="text" ng-model="query">
				<hr>
		          <table class="table table-bordered table-striped table-hover">
		          	<thead>
		          		<th ng-click="orderProp = ''">Id</th>
		          		<th ng-click="orderProp = 'name'">Nom</th>
		          		<th ng-click="orderProp = 'lang'">Langue</th>
		          	</thead>
		          	<tbody>

		          		<tr ng-repeat="item in items | filter:query | orderBy:orderProp">
			          		<td><a href="#/{{section}}/edit/{{item.id}}">#{{item.id}}</a></td>
			          		<td>{{item.name}}</td>
			          		<td>{{item.lang}}</td>
			          	</tr>
		          	</tbody>
		          </table>
		      </div>
		</div>
	</div>
</section>