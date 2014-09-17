
<div>

		<?php //include('./menu.php'); ?>


		<div>
			<div class="content-preview">
				 	<div class="no-content well" ng-show="page.content.length == 0">
						<h3>Vous n'avez ajouté aucun contenu.</h3>
						<p>Cliquez pour ajouter un template puis éditez le contenu selon vos envies.</p>
					</div>
				<div class="viewPnl" ui:sortable="sortableOptions" ng:model="fieldValue">
					<div 
						ng-repeat="row in fieldValue" 
						class="row-items"
						>
						<header>
							<div class="addMenu">
								<span>+</span>
								<button ng-click="addCol($index, 'text')"><i class="fa fa-font"></i></button>
								<button ng-click="addCol($index, 'img')"><i class="fa fa-picture-o"></i></button>
							</div>
							<button ng-click="removeRow($index)"><i class="fa fa-trash-o"></i></button>
							<button ng-click="moveRow( 'up', $index)" ng-hide="$index==0"><i class="fa fa-caret-up"></i></button>
							<button ng-click="moveRow( 'down', $index)" ng-hide="$index == fieldValue.content.length -1"><i class="fa fa-caret-down"></i></button>
						</header>
						<div class="row" ui:sortable="sortableOptionsCols" ng:model="row.cols">
							<div 
								ng-repeat="col in row.cols"
								class="col-sm-{{col.width}} col-item">

								<header>
									<button ng-click="removeCol($parent.$index, $index)"><i class="fa fa-trash-o"></i></button>
									<button ng-click="editContent($parent.$index, $index)" ><i class="fa fa-pencil"></i></button>
									<button ng-click="moveCol( 'up', $index, $parent.$index)" ng-hide="$index==0"><i class="fa fa-caret-up"></i></button>
									<button ng-click="moveCol( 'down', $index, $parent.$index)" ng-hide="$index == row.cols.length -1"><i class="fa fa-caret-down"></i></button>
									<!-- redim -->
								</header>

								<div class="{{col.cssClass}}" ng-if="col.type != 'img'" ng-bind-html=col.content>
								</div>
								<div class="{{col.cssClass}}" ng-if="col.type == 'img'">
										
									<div image-upload config="uploader" item="col.content" ></div>
								</div>
								<button class="divider divider-right"
									ng-hide="$index == row.cols.length - 1"
									ng-click="redimCol( 'right', 'plus', $index, $parent.$index)">
									<i class="fa fa-caret-right"></i>
								</button>
								<button class="divider divider-left"
									ng-hide="$index == 0"
									ng-click="redimCol( 'left', 'plus', $index, $parent.$index)"
									>
									<i class="fa fa-caret-left"></i>
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
			
	<div id="grid-content-edition-modal-{{uniqueId}}" class="modal fade {{editPane}} ">
        <div class="modal-content">
            <div class="modal-header">
            <div class="container">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h3>Edition :</h3>
            </div>
          </div>
          <div class="modal-body container" ng-if="edit">
          	<div>
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
          	</div>
            <div>
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
					<div image-upload config="uploader" item="edit.content" ></div>
				</div>
            </div>

            <div>
            	<label for="cssClassEdit">Classe Css</label>
				<input type="text" id="cssClassEdit" ng-model="edit.cssClass">
				<div ng-show="edit.type == 'img'">
					<label>Chemin de l'image (relatif au répertoire (Imapges/Pages)</label>
					<input type="text" ng-model="edit.content">
					<label for="AltEdit">Texte alternatif</label>
					<input type="text" id="AltEdit" ng-model="edit.altText">
				</div>
            </div>

          </div>
          <footer class="modal-footer">
          	<div class="container">
          		<button class="btn btn-danger" data-dismiss="modal" aria-hidden="true">Annuler</button>
          		<button class="btn btn-primary" ng-click='endEdit(true)'>Terminer</button>
          	</div>
		  </footer>
        </div>
       
    </div>