
<div id="viewTools">
	<a class="btn btn-primary" href="#/manager/comptes/edit/new">Ajouter <i class="icon-plus-sign"></i></a>
</div>

<section id="content">
	<h1>Comptes</h1>
	<hr>

	<div class="row-fluid">
		<?php //include('../menu.php'); ?>

		<div class="col-sm-12">
	      <div>
	      	Search: <input type="text" ng-model="query">
			<hr>
	          <table class="table table-bordered table-striped table-hover">
	          	<thead>
	          		<th ng-click="orderProp = ''">Id</th>
	          		<th ng-click="orderProp = 'user_id'">Nom d'utilisateur</th>
	          		<th ng-click="orderProp = 'prenom'">Email</th>
	          		<th></th>
	          		<th style="width: 63px"></th>
	          	</thead>
	          	<tbody>

	          		<tr class="{{item.statut}}" ng-repeat="item in items | filter:query | orderBy:orderProp:reverse" ng-dblclick="getView(item.user_id)">
		          		<td>{{item.user_id}}</td>
		          		<td>{{item.username}}</td>
		          		<td>{{item.email}}</td>
		          		<td><img ng-if="item.src" alt="{{item.username}}" src="/assets/image/users|thumbs/60x60/{{item.src}}"></td>
		          		<td>
		          			<div>
									<a href="#/{{section}}/edit/{{item.user_id}}"><i class="icon-pencil circle-icon"></i></a>
									<button ng-show="items.length > 1" ng-click="validation(item.user_id)"><i class="icon-trash circle-icon"></i></button>
							</div>
		          		</td>
		          	</tr>
	          	</tbody>
	          </table>
	      </div>
		</div>
	</div>
</section>

<section id="popups">
	<?php $self->load->view('admin/views/desktop/shared/delete_validation', FALSE); ?>
</section>


