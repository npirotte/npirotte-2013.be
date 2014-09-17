<div id="viewTools">
	<button data-role="submit" class="btn btn-primary" ng-click="save()" >Enregistrer<i class="icon-ok-sign"></i></button>
	<a data-role="cancel" class="btn" href="#/news/list">Annuler<i class="icon-remove-sign"></i></a>
	<button data-role="delete" ng-hide="item.name == 'home' || mode == 'new'" class="btn btn-danger" ng-click="delete()">Supprimer<i class="icon-trash"></i></button>
	<span ng-hide="mode == 'new'">
		<button ng-show="item.is_online == 0" ng-click="pushOnline()" class="btn btn-success">Mettre en ligne <i class="icon-upload"></i></button>
		<button ng-show="item.is_online == 1" ng-click="pushOffline()" class="btn btn-danger">Archiver <i class="icon-archive"></i></button>
	</span>
	<span class="alert-container">
		{{alert}}
	</span>
</div>


<div>
	<h1>News: #{{item.id}} {{item.title}}</h1>
	<hr>
	<form class="form form-horizontal">

	<div class="row">
		<?php //include('../menu.php'); ?>

		<div class="span9">

			<div ng-hide="mode == 'new'" class="well">
				<p><strong>Statut :</strong> {{statut}}</p>
				<p><strong>Date de création :</strong> {{date_formated}}</p>
				<p><strong>Auteur : </strong> {{person.last_name}} {{person.first_name}}</p>
			</div>
			

				<h3>Contenu</h3>
				<hr>


					<div class="control-group">
						<label class="control-label" for"inputDbTitle">Titre</label>
						<div class="controls">
							<input type="text" data-required="true" data-length="30" id="inputDbTitle" name="title" ng-model="item.title">
						</div>
					</div>

					<div class="control-group">
						<label class="control-label" for"inputIcon">Icone</label>
						<div class="controls">
							<input type="text" data-length="20" id="inputIcon" name="icon" ng-model="item.icon">
							&nbsp;
							<i class="{{item.icon}}"></i>
							<br>
							<a href="http://fortawesome.github.io/Font-Awesome/icons/" target="_blank"><small>Liste des icones</small></a>
						</div>
					</div>

					<div class="control-group">
						<label class="control-label" for"inputResume">Résumé</label>
						<div class="controls">
							<textarea type="text" data-length="147" id="inputResume" name="resume" ng-model="item.resume"></textarea>
						</div>
					</div>

					<div class="control-group">
						<label class="control-label" for"inputDbContent_1">Contenu</label>
						<div class="controls">
							<div class="editArea" ng-click="editText('inputDbContent_1')" data-model="content">{{item.content}}</div>
						</div>
					</div>
					
					<div ng-show="editShow" id="edit-popup" class="">
									  	<div class="controls">
											<textarea class="ckeditor" id="inputDbContent_1" name="content" ng-model="item.content"></textarea>
											<div class="footer">
												<button class="" ng-click="closeArea('cancel')"><i class="icon-remove circle-icon"></i></button>
												<button class="" ng-click="closeArea('ok')"><i class="icon-ok circle-icon"></i></button>
											</div>
											
										</div>
										<div class="edit-bg"></div>
						</div>

			
		</div>
		</form>
	</div>