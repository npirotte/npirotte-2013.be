<div id="viewTools">
	<a class="btn btn-primary" href="#/portfolio/edit/new">Ajouter <i class="icon-plus-sign"></i></a>
</div>

<section >
	<h1>Portfolio</h1>
	<hr>

	<div class="row-fluid">
		<?php //include('../menu.php'); ?>

		<div class="col-sm-12">
	      <div>
	      	Search: <input type="text" ng-model="query">
	      	<hr>

	      	<div ng-show="items.length == 0" class="alert alert-warning">Aucun élément. <a href="#/portfolio/edit/new">Ajouter</a></div> 

	          <table ng-show="items.length > 0" class="table table-bordered table-striped table-hover">
	          	<thead>
	          		<th ng-click="orderProp = 'id'; reverse=!reverse">Id</th>
	          		<th>Titre</th>
	          		<th></th>
	          		<th width="76px"></th>
	          	</thead>
	          	<tbody>

	          		<tr ng-repeat="item in items | filter:query | orderBy:orderProp:reverse" ng-dblclick="getView(item.id)">

	          					<td><a href="#/portfolio/edit/{{item.id}}">#{{item.id}}</a></td>
				          		<td>{{item.db_title_default}}</td>
				          		<td><img src="/assets/image/portfolio%7Cthumbs/40x40/{{item.src}}" alt=""></td>
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