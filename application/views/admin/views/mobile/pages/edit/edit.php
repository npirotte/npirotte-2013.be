<div id="viewTools">
<button data-role="submit" class="btn btn-primary" ng-click="save()" >Enregistrer<i class="icon-ok-sign"></i></button>
	      		<a data-role="cancel" class="btn" href="#/pages/list">Annuler<i class="icon-remove-sign"></i></a>
	      		<button data-role="delete" ng-hide="mode == 'new'" class="btn btn-danger" ng-click="delete()">Supprimer<i class="icon-trash"></i></button>
		      	{{alert}}
</div>

<div>
	<h1>Pages: {{item.name}}</h1>
	<hr>

		<?php //include('./menu.php'); ?>

	<form class="form form-horizontal">
		<div class="row">
			<div class="span6">
				<h3>Général</h3>
				<hr>


		      	<div class="control-group">
					<label class="control-label" for"inputName">Nom</label>
					<div class="controls">
						<input data-required="true" data-length="20" data-format="page_name" type="text" id="inputName" name="name" ng-model="item.name">
					</div>
				</div>

				<div class="control-group">
					<label class="control-label" for"inputLang">Langue</label>
					<div class="controls">
						<select data-required="true" name="lang" id="inputLang" ng-model="item.lang" placeholder="selectionner une langue">
							<option value="fr">fr</option>
							<option value="nl">nl</option>
							<option value="en">en</option>
							<option value="de">de</option>
						</select>
					</div>
				</div>

				<div class="control-group">
					<label class="control-label" for"inputFile">Template</label>
					<div class="controls">
						<select name="file" data-required="true" id="inputFile" ng-model="item.file" placeholder="selectionner un fichier"> 
							<?php 
								$dirname = '../../../../application/views/pages/'; 
								$dir = opendir($dirname);
								while($file = readdir($dir)) { 
									if($file != '.' && $file != '..' && !is_dir($dirname.$file)) 
									{ 
										$extension = strrchr($file,'.');
										$extension = substr($extension,1);
										if ( $extension == 'php' or $extension == 'html') {
										  	echo '<option value="'.$file.'">'.$file.'</option>';
										  }  
									} 
								}
							?>
						</select>
					</div>
				</div>
			</div>
			<div class="span6">
				<h3>Meta</h3>
				<hr>

				<div class="control-group">
					<label class="control-label" for"inputTitle">Titre</label>
					<div class="controls">
						<input type="text" id="inputTitle" name="title" ng-model="item.title">
					</div>
				</div>

				<div class="control-group">
					<label class="control-label" for"inputDesc">Description</label>
					<div class="controls">
						<textarea type="text" id="inputDesc" name="description" ng-model="item.meta_description"></textarea>	
					</div>
				</div>

				<div class="control-group">
					<label class="control-label" for"inputMeta">Keywords</label>
					<div class="controls">
						<textarea type="text" id="inputMeta" name="keywords" ng-model="item.meta_keywords"></textarea>	
					</div>
				</div>
			</div>
			<div class="span12">
				<h3>Contenu</h3>
				<hr>

				<div class="control-group">
					<label class="control-label" for"inputType">Type de contenu</label>
					<div class="controls">
						<select name="file" data-required="true" id="inputType" ng-model="item.content_type">
							<option value="statique">Statique</option>
							<option value="resource">Resources Json</option>
							<option value="db">Base de donnée</option>
						</select>
					</div>
				</div>
				<div class="db_content" ng-show="item.content_type == 'db'">
					<div class="control-group">
						<label class="control-label" for"inputDbTitle">Titre</label>
						<div class="controls">
							<input type="text" id="inputDbTitle" name="db_title_default" ng-model="item.db_title_default">
						</div>
					</div>

					<div class="control-group">
						<label class="control-label" for"inputDbContent_1">Contenu</label>
						<div class="controls">

							<div class="editArea" ng-show="editHide" ng-click="editText('inputDbContent_1')" data-model="db_content_default">{{item.db_content_default}}</div>
							
						</div>

						<div ng-show="editShow" id="edit-popup" class="">
									  	<div class="controls">
											<textarea class="ckeditor" id="inputDbContent_1" name="db_content_1" ng-model="item.db_content_default"></textarea>
											<div class="footer">
												<button class="" ng-click="closeArea('cancel')"><i class="icon-remove circle-icon"></i></button>
												<button class="" ng-click="closeArea('ok')"><i class="icon-ok circle-icon"></i></button>
											</div>
											
										</div>
										<div class="edit-bg"></div>
						</div>

					</div>
				</div>
			</div>

		
			    

				

					<div ng-hide="hideForNew" class="span12">
						<h3>Contenu supplémentaire</h3>
						<hr>
						<table class="table table-bordered table-striped table-hover">
							<tbody>

				          		<tr ng-repeat="content in subContents">

				          					<td><a href="#/pages/content/{{content.id}}">#{{content.id}}</a></td>
							          		<td>{{content.db_title}}</td>
					          	</tr>

				          	</tbody>
						</table>
						<a href="#/pages/content/{{item.id}}/new" class="btn btn-primary">Ajouter</a>
					</div>
				
			
				

			</div>
		</form>
