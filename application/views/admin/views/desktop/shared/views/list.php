<div id="viewTools">
	<a class="btn btn-primary btn-ripple" href="#/{{section}}/new">Ajouter <i class="fa fa-plus-circle"></i></a>
</div>

<section >
	<h1 class="page-title">{{pageTitle}}</h1>

	<div class="row">
		<div class="col-sm-12">
	      <div>

	      	<div class="tools clearfix">
	      		<div class="row">
	      			<div class="col-md-4 col-lg-3">
	      				<input type="text" ng-model="query" ng-change="search()" placeholder="Rechercher">
	      			</div>
	      			<div class="col-md-4 col-lg-5" ></div>
	      			<div class="col-md-4">
	      				<div class="pull-right">
				      		<div class="pull-right" ng-if="totalItems >= itemPerPage">
				      			<pagination total-items="totalItems" page="currentPage" items-per-page="itemPerPage" on-select-page="setGetPage(page)" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" boundary-links="true" rotate="false" max-size="3"></pagination>
				      		</div>
				      		<div class="pull-right pagination-count">
				      			{{offset + 1}} à {{offset + itemPerPage > totalItems ? totalItems : offset + itemPerPage}} / {{totalItems}} &nbsp;
				      		</div> 		
				      	</div>
	      			</div>
	      		</div>
	      	</div>
	      	
	      	
	      	<hr>

	      	<div ng-show="items.length == 0" class="alert alert-warning">Cette catégorie ne contient aucun élément. <a href="#/{{section}}/edit/new">Ajouter</a></div>

	          <table class="table table-striped table-hover" ng-show="items.length > 0">
	          	<thead>
	          		<th ng-click="reorder('id')" ng-class="{'ordered' : 'id' === orderprop, 'reverse' : !reverse}">Id</th>
	          		<th ng-repeat="col in table" ng-click="reorder(col.param)" ng-class="{'ordered' : col.param === orderprop, 'reverse' : reverse}">{{col.title}}</th>
	          		<th width="96px"></th>
	          	</thead>
	          	<tbody>

	          		<tr ng-dblclick="getView(item.id)" class="{{item.statut}}" ng-repeat="item in items">

	          					<td width="60px"><a href="#/{{section}}/edit/{{item.id}}">#{{item.id}}</a></td>
	          					<td width="{{col.width ? col.width : 'auto'}}" ng-class="col.strong ? 'strong' : '' " ng-repeat="col in table">
	          						<span class="list-thumb" style="background-image: url(/assets/image/{{thumbPath}}~{{item.id}}~thumbs/64x64/{{item.src}})" ng-if="col.param == 'src'"></span>
	          						<span ng-if="col.param == 'created_by'"><manager-user-infos userid="item.created_by" ></manager-user-infos></span>
	          						<span ng-if="col.param != 'src'  && col.param != 'created_by'">{{item[col.param]}}</span>
	          					</td>
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