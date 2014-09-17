<div id="viewTools">
<button data-role="submit" class="btn btn-primary" ng-click="save()" >Enregistrer<i class="icon-ok-sign"></i></button>
	      		<a data-role="cancel" class="btn" href="#/portfolio/categories">Annuler<i class="icon-remove-sign"></i></a>
	      		<button data-role="delete" ng-hide="mode == 'new'" class="btn btn-danger" ng-click="delete()">Supprimer<i class="icon-trash"></i></button>
		      	{{alert}}
</div>


<div>
	<h1>Catégorie: #{{item.id}} {{item.name}}</h1>
	<hr>

	<div class="row">
		<?php //include('../menu.php'); ?>

		<div class="span12">
			<form class="form form-horizontal">

				<h3>Général</h3>
				<hr>


					<div class="control-group">
						<label class="control-label" for"inputName">Titre</label>
						<div class="controls">
							<input type="text" data-required="true" data-length="30" id="inputName" name="db_title" ng-model="item.name">
						</div>
					</div>

					<div class="control-group">
						<label class="control-label" for"inputWeight">Ordre</label>
						<div class="controls">
							<input type="text" id="inputWeight" ng-model="item.weight">
						</div>
					</div>

			</form>
		</div>