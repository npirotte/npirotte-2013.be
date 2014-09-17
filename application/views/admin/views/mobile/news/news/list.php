<div id="viewTools">
	<a class="btn btn-primary" href="#/news/edit/new">Ajouter <i class="icon-plus-sign"></i></a>
</div>

<section >
	<h1>News</h1>
	<hr>

	<div class="row">
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

	          					<td><a href="#/news/edit/{{item.id}}">#{{item.id}}</a></td>
				          		<td>{{item.title}}</td>
		          	</tr>

	          	</tbody>
	          </table>
	      </div>
	</div>
</section >