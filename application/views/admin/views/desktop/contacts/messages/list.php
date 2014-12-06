
<aside class="big-aside left">
	<h1 class="title">
		{{isSpam == 0 ? 'Messages' : 'Spams' }} 
		<button ng-click="refresh()"><i class="fa fa-refresh circle-icon"></i></button>
	</h1>

	<input type="text" placeholder="Rechercher" ng-model="query" ng-change="search()"> 

	<div class="item-list">
		<div 
			class="item btn-ripple"
			id="item-{{item.id}}"
			ng-repeat="item in items | orderBy:'id':true" 
			ng-click="getResume(item.id)"
			ng-class="item.read_on ? '' : 'success'"
			>
			<h4>{{item.sender}}</h4>
			<span class="date">{{item.created_on}}</span>
		</div>

		<button ng-if="items.length < total_items" class="btn btn-default btn-block" ng-click="getMore()">Plus</button>
	</div>
</aside>

<section id="content" class="asided-left">

	<h1 class="page-title" ng-if="resume">{{resume.sender}}</h1>

	<div class="row" >
		<?php //include('./menu.php'); ?>

		<div class="col-sm-12" ng-show="items.length > 0 || query != null">


	      			<div ng-show="resume">
	      				<div class="tools pull-right">
	      					<a href="mailto:{{resume.sender}}"><i class="icon-reply circle-icon"></i></a>
	      					<a ng-click="validation(resume.id)"><i class="icon-trash circle-icon"></i></a>
	      				</div>
	      				<p><strong>De :</strong> <a href="mailto:{{resume.sender}}">{{resume.sender}}</a></p>
						<p><small><strong>Envoyé le :</strong> {{resume.created_on}}</small></p>
						<p><small><strong>Formulaire</strong> <a href="#/contacts/forms/edit/{{resume.form_id}}">#{{resume.form_id}}</a></small></p>
						<hr>

						<div ng-repeat="field in resume.fields">
							<p><strong>{{field.field_name}} : </strong><br ng-if="field.field_value.length > 100"/>
								{{field.field_value}}
							</p>
						</div>
	      			</div>
	      			<div ng-hide="resume">
	      				<br /> <br />
	      				<div class="alert alert-warning">Aucun élément sélectionné</div>
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
