<div id="viewTools">
	<a class="btn btn-primary" href="#/news/edit/new">Ajouter <i class="icon-plus-sign"></i></a>
</div>

<section >
	<h1>News</h1>
	<hr>

	<div class="row">
		<?php //include('../menu.php'); ?>

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
	      	<div ng-show="items.length == 0" class="alert alert-warning">Aucun élément. <a href="#/news/edit/new">Ajouter</a></div> 
	          <table ng-show="items.length > 0" class="table table-bordered table-striped table-hover">
	          	<thead>
	          		<th ng-click="orderProp = 'id'; reverse=!reverse">Id</th>
	          		<th>Titre</th>
	          		<th width="76px"></th>
	          	</thead>
	          	<tbody>

	          		<tr ng-dblclick="getView(item.id)" class="{{item.statut}}" ng-repeat="item in items | filter:query | orderBy:orderProp:reverse">

	          					<td><a href="#/news/edit/{{item.id}}">#{{item.id}}</a></td>
				          		<td>{{item.title}}</td>
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