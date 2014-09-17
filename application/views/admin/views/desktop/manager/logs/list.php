
<section id="content">
	<h1>Logs <button ng-click="refresh()"><i class="fa fa-refresh circle-icon"></i></button> <button ng-click="deleteLogs()"><i class="fa fa-trash-o circle-icon"></i></button></h1>
	<hr>

	<div class="row">
		<?php //include('./menu.php'); ?>

		<div class="col-sm-12" ng-show="items.length > 0 || query != null">
	      <div>
	      	<div class="row">
	      		<div class="col-md-3">
	      			<input type="text" placeholder="Rechercher" ng-model="query" ng-change="search()"> 
	      		</div>
	      		<div class="col-md-9">
	      			{{items.length}} / {{total_items}}
	      		</div>
	      	</div>
	      	<hr>
	      	<div class="row">
	      		<div class="col-sm-3 item-list">
	      			<div 
	      				class="item"
	      				id="item-{{item}}"
	      				ng-repeat="item in items"
	      				ng-click="getDetails(item)"
	      				>
	      				<span>{{item}}</span>
	      			</div>
	      			<button ng-if="items.length < total_items" class="btn btn-default btn-block" ng-click="getMore()">Plus</button>
	      		</div>
	      		<div class="col-sm-9">
	      			<div ng-show="true">
	      				<h2>{{details.fileName}}</h2>
	      				<div class="tools pull-right">
	      					
	      				</div>

						<div ng-bind-html="to_trusted(details.content)">
						</div>
	      			</div>
	      			<div ng-hide="true">
	      				<div class="alert alert-warning">Aucun élément sélectionné</div>
	      			</div>
	      		</div>
	      	</div>
	      </div>
		</div>

		<div class="col-sm-12" ng-if="items.length == 0  && query == ''">
			<div class="alert alert-warning">
				Vous n'avez aucun message.
			</div>
		</div>
	</div>
</section>


<section id="popups">
	<?php $self->load->view('admin/views/desktop/shared/delete_validation', FALSE); ?>
</section>
