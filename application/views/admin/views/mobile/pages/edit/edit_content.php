<div id="viewTools">
<button data-role="submit" class="btn btn-primary" ng-click="save()" >Enregistrer<i class="icon-ok-sign"></i></button>
	      		<a data-role="cancel" class="btn" href="#/pages/list">Annuler<i class="icon-remove-sign"></i></a>
	      		<button data-role="delete" ng-hide="item.name == 'home' || mode == 'new'" class="btn btn-danger" ng-click="delete()">Supprimer<i class="icon-trash"></i></button>
		      	{{alert}}
</div>

<div>
	<h1>Pages: #{{item.id}} {{item.db_title}} </h1>
	<hr>

	<div class="row">
		<?php //include('./menu.php'); ?>
		

		<div class="span12">
			<form class="form form-horizontal">
				Page : <a href="#/pages/edit/{{item.parent_id}}">#{{item.parent_id}}</a>
			    <h3>Contenu</h3>
				<hr>

				<div class="db_content">
					<div class="control-group">
						<label class="control-label" for"inputDbTitle">Titre</label>
						<div class="controls">
							<input type="text" id="inputDbTitle" name="db_title_default" ng-model="item.db_title">
						</div>
					</div>

					<div class="control-group">
						<label class="control-label" for"inputDbContent_1">Contenu</label>
						<div class="controls">

							<div class="editArea" ng-show="editHide" ng-click="editText('inputDbContent_1')" data-model="db_content">{{item.db_content}}</div>
							
						</div>

						<div ng-show="editShow" id="edit-popup" class="">
									  	<div class="controls">
											<textarea class="ckeditor" id="inputDbContent_1" name="db_content_1" ng-model="item.db_content"></textarea>
											<div class="footer">
												<button class="" ng-click="closeArea('cancel')"><i class="icon-remove circle-icon"></i></button>
												<button class="" ng-click="closeArea('ok')"><i class="icon-ok circle-icon"></i></button>
											</div>
											
										</div>
										<div class="edit-bg"></div>
						</div>

					</div>
				</div>
			</form>
		</div>


		<section id="popups">
			
		</section>