<div id="viewTools">
<button data-role="submit" class="btn btn-primary" ng-click="save()" >Enregistrer<i class="icon-ok-sign"></i></button>
	      		<a data-role="cancel" class="btn" href="#/pages/list">Annuler<i class="icon-remove-sign"></i></a>
		      	{{alert}}
</div>

<div>
	<h1>Pages: #{{item.id}} {{item.name}}</h1>
	<hr>

	<div class="row">
		<?php //include('./menu.php'); ?>

		<div class="span12">
			<form class="form form-horizontal">
			    <h3>Général</h3>
				<hr>


		      	<div class="control-group">
					<label class="control-label" for"inputName">Nom</label>
					<div class="controls">
						<input data-required="true" data-length="20" data-format="page_name"type="text" id="inputName" name="name" ng-model="item.name">
					</div>
				</div>

				<div class="control-group">
					<label class="control-label" for"inputLang">Langue</label>
					<div class="controls">
						<select data-required="true" name="lang" id="inputLang" value="fr" ng-model="item.lang">
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
						<select name="file" data-required="true" id="inputFile" ng-model="item.file"> 
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
				<div class="db_content" ng-show="'item.content_type' == 'db'">
					<div class="control-group">
						<label class="control-label" for"inputDbTitle">Titre</label>
						<div class="controls">
							<input type="text" id="inputDbTitle" name="db_title" ng-model="item.db_title">
						</div>
					</div>

					<div class="control-group">
						<label class="control-label" for"inputDbContent_1">Contenu</label>
						<div class="controls">
							<div class="editArea" ng-show="editHide" ng-click="editText('inputDbContent_1')" data-model="db_content_default">{{item.db_content_default}}</div>
						</div>
					</div>
				</div>

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
						<textarea type="text" id="inputDesc" name="description" ng-model="item.description"></textarea>	
					</div>
				</div>

				<div class="control-group">
					<label class="control-label" for"inputMeta">Keywords</label>
					<div class="controls">
						<textarea type="text" id="inputMeta" name="keywords" ng-model="item.meta"></textarea>	
					</div>
				</div>


			</form>
		</div>