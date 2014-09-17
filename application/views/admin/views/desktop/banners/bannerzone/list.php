<div id="viewTools">
	<a class="btn btn-primary" href="#/banner-zones/edit/new">Ajouter <i class="icon-plus-sign"></i></a>
</div>

<section >
	<h1>Zones de bannières</h1>
	<hr>

	<div class="row">
		<?php //include('../menu.php'); ?>

		<div class="col-sm-12">
	      <div>
	      	Search: <input type="text" ng-model="query">
	      	<hr>

	      	<div ng-show="items.length == 0" class="alert alert-warning">Aucun élément. <a href="#/banner-zones/edit/new">Ajouter</a></div> 

	          <table ng-show="items.length > 0" class="table table-bordered table-striped table-hover">
	          	<thead>
	          		<th ng-click="orderProp = 'id'; reverse=!reverse">Id</th>
	          		<th>Nom</th>
	          		<th width="76px"></th>
	          	</thead>
	          	<tbody>

	          		<tr ng-repeat="item in items | filter:query | orderBy:orderProp:reverse" ng-dblclick="getView(item.id)">

	          					<td><a href="#/banner-zones/edit/{{item.id}}">#{{item.id}}</a></td>
				          		<td>{{item.name}}</td>
				          		<td><?php $this->load->view('admin/views/desktop/shared/list_tools', FALSE); ?></td>
		          	</tr>

	          	</tbody>
	          </table>
	      </div>
	</div>
</section >

<section id="popups">
	<?php $this->load->view('admin/views/desktop/shared/delete_validation', FALSE); ?>
</section>