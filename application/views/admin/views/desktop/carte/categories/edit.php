<div id="viewTools">
	<button data-role="submit" class="btn btn-primary" ng-click="save()" ng-disabled="editForm.$invalid">Enregistrer<i class="icon-ok-sign"></i></button>
	<a data-role="cancel" class="btn" href="#/carte/list">Annuler<i class="icon-remove-sign"></i></a>
	<button data-role="delete" ng-hide="item.name == 'home' || mode == 'new'" class="btn btn-danger" ng-click="delete()">Supprimer<i class="icon-trash"></i></button>
	<span id="mainAlert">{{alert}}</span>
</div>

<div>
	<h1>Carte : #{{item.id}} {{item.name}}</h1>
	<hr />

	<form name="editForm" class="form form-horizontal">
		<div class="row">
			<div class="col-sm-12">
				<h3>Informations</h3>
				<hr />
			</div>
		</div>
		<div class="row">

			<div class="col-sm-6">
				<div class="control-group">
					<label class="control-label">Nom</label>
					<div class="controls">
						<?php print_input($self, 'text', 'carte_categories', 'name', 'item', 'editForm') ?>
					</div>
				</div>
				<div class="control-group">
					<label class="control-label">Description</label>
					<div class="controls">
						<?php print_input($self, 'textarea', 'carte_categories', 'desc', 'item', 'editForm') ?>
					</div>
				</div>
			</div>

			<div class="col-sm-6">
				<div class="control-group">
					<label class="control-label">Ordre</label>
					<div class="controls">
						<?php print_input($self, 'text', 'carte_categories', 'weight', 'item', 'editForm') ?>
					</div>
				</div>
			</div>
		</div>
	</form>

		<div class="row" ng-if="item.id">
			<div class="col-sm-12">
				<div carte-items ></div>
			</div>
		</div>
	
</div>