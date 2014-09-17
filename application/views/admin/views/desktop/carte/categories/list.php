<div id="viewTools">
	<a class="btn btn-primary" href="#/carte/edit/new">Ajouter <i class="icon-plus-sign"></i></a>
</div>

<section >
	<h1>Menu</h1>
	<hr>

	<div class="row">
		<div class="col-sm-12">
	      <div>

	      	<div class="tools clearfix">
	      		Search: <input type="text" ng-model="query">

		      	<div class="pull-right">
		      		<div class="pull-right" ng-if="totalItems >= itemPerPage">
		      			<pagination total-items="totalItems" page="currentPage" items-per-page="itemPerPage" on-select-page="setGetPage(page)" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" boundary-links="true" rotate="false" max-size="3"></pagination>
		      		</div>
		      		<div class="pull-right">
		      			{{offset + 1}} à {{offset + itemPerPage > totalItems ? totalItems : offset + itemPerPage}} / {{totalItems}} &nbsp;
		      		</div> 		
		      	</div>
	      	</div>
	      	
	      	
	      	<hr>

	      	<div ng-show="items.length == 0" class="alert alert-warning">Cette catégorie ne contient aucun élément. <a href="#/carte/edit/new">Ajouter</a></div> 

	          <table class="table table-bordered table-striped table-hover" ng-show="items.length > 0">
	          	<thead>
	          		<th ng-click="orderProp = 'id'; reverse=!reverse">Id</th>
	          		<th>Nom</th>
	          		<th>Plats</th>
	          		<th width="76px"></th>
	          	</thead>
	          	<tbody>

	          		<tr ng-dblclick="getView(item.id)" class="{{item.statut}}" ng-repeat="item in items | filter:query | orderBy:orderProp:reverse">

	          					<td><a href="#/carte/edit/{{item.id}}">#{{item.id}}</a></td>
				          		<td>{{item.name}}</td>
				          		<td>{{item.childs_count}}</td>
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