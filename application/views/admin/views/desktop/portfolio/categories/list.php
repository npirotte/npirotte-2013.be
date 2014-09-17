<div id="viewTools">
	<a class="btn btn-primary" href="#/portfolio/categories/edit/new">Ajouter <i class="icon-plus-sign"></i></a>
</div>

<section >
	<h1>Catégories</h1>
	<hr>

	<div class="row">
		<?php //include('../menu.php'); ?>

		<div class="col-sm-12">
	      <div>
	      	Search: <input type="text" ng-model="query">
	      	<hr>
	      	<form class="form form-horizontal">
	      		<table>
	      			<tr>
	      				<td>
	      					<label for="">Nouveau &nbsp;</label>
	      				</td>
	      				<td>
	      					<input ng-model="newItem.name" type="text">
	      				</td>
	      				<td>
	      					<button ng-click="createNew()"><i class="circle-icon icon-plus"></i></button>
	      				</td>
	      			</tr>
	      		</table>
	      	</form>

	      	<div ng-show="items.length == 0" class="alert alert-warning">Aucun élément. <a href="#/news/edit/new">Ajouter</a></div>

	          <table ng-show="items.length > 0" class="table table-bordered table-striped table-hover">
	          	<thead>
	          		<th ng-click="orderProp = 'id'; reverse=!reverse">Id</th>
	          		<th>Titre</th>
	          		<th width="76px"></th>
	          	</thead>
	          	<tbody>

	          		<tr ng-repeat="item in items | filter:query | orderBy:orderProp:reverse">

	          					<td><a href="#/portfolio/categories/edit/{{item.id}}">#{{item.id}}</a></td>
				          		<td>{{item.name}}</td>
				          		<td><?php $self->load->view('admin/views/desktop/shared/list_tools', FALSE); ?></td>
		          	</tr>

	          	</tbody>
	          </table>
	      </div>
	</div>
</section >

<section id="popups">
	<?php $self->load->view('admin/views/desktop/shared/delete_validation', FALSE); ?>
</section>