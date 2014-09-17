<div id="progress-bar" >
		<div class="uploaded bar" ng-style="{'width': progress+'%'}"></div>
</div>

<div id="viewTools">
<button data-role="submit" class="btn btn-primary" ng-click="save()" >Enregistrer<i class="icon-ok-sign"></i></button>
	      		<a data-role="cancel" class="btn" href="{{backUrl}}">Retour<i class="icon-remove-sign"></i></a>
	      		<button data-role="delete" ng-hide="mode == 'new'" class="btn btn-danger" ng-click="delete()">Supprimer<i class="icon-trash"></i></button>
		      	<span id="mainAlert">{{alert}}</span>
</div>

<div>

	<hr>

		<?php //include('./menu.php'); ?>


	<form class="form form-horizontal">

		<div class="row-fluid">
			<div class="col-sm-12" id="content-preview">
				<h1>Edition d'un contenu</h1>
				<hr/>
				 	<div class="no-content well" ng-show="page.content.length == 0">
						<h3>Vous n'avez ajouté aucun contenu.</h3>
						<p>Cliquez pour ajouter un template puis éditez le contenu selon vos envies.</p>
					</div>
				<div id="viewPnl" ui:sortable="sortableOptions" ng:model="item.content">
					<div 
						ng-repeat="row in item.content" 
						class="row-items"
						>
						<header>
							<div class="addMenu">
								<span>+</span>
								<button ng-click="addCol($index, 'text')"><i class="icon-font"></i></button>
								<button ng-click="addCol($index, 'img')"><i class="icon-picture"></i></button>
							</div>
							<button ng-click="removeRow($index)"><i class="icon-trash"></i></button>
							<button ng-click="moveRow( 'up', $index)" ng-hide="$index==0"><i class="icon-caret-up"></i></button>
							<button ng-click="moveRow( 'down', $index)" ng-hide="$index == item.content.length -1"><i class="icon-caret-down"></i></button>
						</header>
						<div class="row-fluid" ui:sortable="sortableOptionsCols" ng:model="row.cols">
							<div 
								ng-repeat="col in row.cols"
								class="col-sm-{{col.width}} col-item">

								<header>
									<button ng-click="removeCol($parent.$index, $index)"><i class="icon-trash"></i></button>
									<button ng-click="editContent($parent.$index, $index)" ><i class="icon-pencil"></i></button>
									<button ng-click="moveCol( 'up', $index, $parent.$index)" ng-hide="$index==0"><i class="icon-caret-up"></i></button>
									<button ng-click="moveCol( 'down', $index, $parent.$index)" ng-hide="$index == row.cols.length -1"><i class="icon-caret-down"></i></button>
									<!-- redim -->
								</header>

								<div class="{{col.cssClass}}" ng-if="col.type != 'img'" ng-bind-html=col.content>
								</div>
								<div class="{{col.cssClass}}" ng-show="col.type == 'img'">
										<button 
											class="upload upload-img" 
											ng-click="triggerUpload($index, $parent.$index)"
											ng-class="uploaderClass(col.content)"
											>
											<i class="icon-upload"></i>
										</button>
										<button class="delete-img"
											ng-click="col.content = ''"
											ng-class="uploaderClass(col.content)">
											<i class="icon-remove"></i>
										</button>
									<img ng-if="safeImg(col.content, col.type)" src="{{safeImg( '<?= APPPATH ?>' + col.content, col.type)}}" alt="">
								</div>
								<button class="divider divider-right"
									ng-hide="$index == row.cols.length - 1"
									ng-click="redimCol( 'right', 'plus', $index, $parent.$index)">
									<i class="icon-caret-right"></i>
								</button>
								<button class="divider divider-left"
									ng-hide="$index == 0"
									ng-click="redimCol( 'left', 'plus', $index, $parent.$index)"
									>
									<i class="icon-caret-left"></i>
								</button>
							</div>
						</div>

					</div>
					<footer>
						<br />
						<button ng-click="addRow(['text'])" class="btn btn-primary">Ajouter 1 col</button>
						<button ng-click="addRow(['text', 'text'])" class="btn btn-primary">Ajouter 2 col</button>
						<button ng-click="addRow(['text', 'text', 'text'])" class="btn btn-primary">Ajouter 3 col</button>
						<button ng-click="addRow(['text', 'img'])" class="btn btn-primary">Ajouter texte + image</button>
					</footer>
				</div>
			</div>
		</div>

		<!-- <button ng-click="addContent('text')" class="btn btn-primary">Ajouter texte</button>
		<button ng-click="addContent('img')" class="btn btn-primary">Ajouter image</button> -->

		<input type="file" name="file" id="fileUploader" onchange="angular.element(this).scope().uploadFile(this.files)"/>
		
	</form>

	<section id="edit-panel" class="{{editPane}}"  ng-if="editPane == 'open'">
		<h2>Edition du contenu</h2>
		<hr/>
		<label class="radio-inline" style="display: inline">
			<input type="radio" ng-model="edit.type" value="text">
			Texte
		</label>
		<label class="radio-inline" style="display: inline">
			<input type="radio" ng-model="edit.type" value="img">
			Image
		</label>
		<label class="radio-inline" style="display: inline">
			<input type="radio" ng-model="edit.type" value="rawHtml">	
			Html
		</label>

		<hr />
		
		<div id="text-edit" class="row-fluid">
			<div class="col-sm-8">
				<label for="contentEdit">Contenu</label>
				
				<div ng-if="edit.type == 'text'">
					<textarea ui-tinymce="tinymceOptions" ng-model="edit.content"  ></textarea>
				</div>

				<div ng-if="edit.type == 'rawHtml'">
					<div ui-ace="{
  useWrapMode : true,
  showGutter: true,
  theme:'twilight',
  mode: 'html',
  onLoad: aceLoaded}" ng-model="edit.content" style="height: 200px"></div>
				</div>

				<div ng-if="edit.type == 'img'">
					<img src="<?= APPPATH ?>{{edit.content}}" alt="">
				</div>
				
			</div>
			<div class="col-sm-4">
				<label for="cssClassEdit">Style</label>
				<input type="text" id="cssClassEdit" ng-model="edit.cssClass">
				<div ng-show="edit.type == 'img'">
					<label for="AltEdit">Texte alternatif</label>
					<input type="text" id="AltEdit" ng-model="edit.altText">
				</div>
			</div>
		</div>
		<footer>
			<button class="btn" ng-click='endEdit()'>Fermer</button>
		</footer>
	</section>
	
		<section id="popups">
			
		</section>