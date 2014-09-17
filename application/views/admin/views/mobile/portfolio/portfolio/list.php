<div id="viewTools">
	<a class="btn btn-primary" href="#/portfolio/edit/new">Ajouter <i class="icon-plus-sign"></i></a>
</div>

<section >
	<h1>Portfolio</h1>
	<hr>

	<div class="row-fluid">
		<?php //include('../menu.php'); ?>

		<div class="span12">
	      <div>
	      	Search: <input type="text" ng-model="query">
	      	<hr>
	          <table class="table table-bordered table-striped table-hover">
	          	<thead>
	          		<th ng-click="orderProp = 'id'; reverse=!reverse">Id</th>
	          		<th>Titre</th>
	          	</thead>
	          	<tbody>

	          		<tr ng-repeat="item in items | filter:query | orderBy:orderProp:reverse">

	          					<td><a href="#/portfolio/edit/{{item.id}}">#{{item.id}}</a></td>
				          		<td>{{item.db_title_default}}</td>
		          	</tr>

	          	</tbody>
	          </table>
	      </div>
	</div>
</section >
