<div id="viewTools">
<button data-role="submit" class="btn btn-primary" ng-click="save()" >Enregistrer<i class="icon-ok-sign"></i></button>
	      		<a data-role="cancel" class="btn" href="#/portfolio/list">Annuler<i class="icon-remove-sign"></i></a>
	      		<button data-role="delete" ng-hide="item.name == 'home' || mode == 'new'" class="btn btn-danger" ng-click="delete()">Supprimer<i class="icon-trash"></i></button>
		      	{{alert}}
</div>


<div>
	<h1>Portfolio: #{{item.id}} {{item.db_title_default}}</h1>
	<hr>

	<div class="row">
		<?php //include('../menu.php'); ?>
		<form class="form form-horizontal">
			<div class="span6">
			

				<h3>Contenu</h3>
				<hr>


					<div class="control-group">
						<label class="control-label" for"inputDbTitle">Titre</label>
						<div class="controls">
							<input type="text" data-required="true" data-length="30" id="inputDbTitle" name="db_title" ng-model="item.db_title_default">
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
							<div class="editArea" ng-click="editText('inputDbContent_1')" data-model="db_content_default">{{item.db_content_default}}</div>
						</div>
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


					<div class="control-group">
						<label class="control-label" for"inputWeight">Ordre</label>
						<div class="controls">
							<input type="text" id="inputWeight" name="weight" ng-model="item.weight">
						</div>
					</div>
				</div>
				<div class="span6">
					<div class="control-group">
						<h3>Catégories</h3>
						<hr>
						<!-- <div class="controls">
							<input type="text" id="inputCategory" data-format="page_name" name="weight" ng-model="item.category">
						</div> -->
						<form class="form form-horizontal">
							<label for="">Ajouter &nbsp;</label>
				      		<table>
				      			<tr>
				      				<td>
				      					<input ng-model="newCategory.name" type="text">
				      				</td>
				      				<td>
				      					<button ng-click="createNewCategoty()"><i class="circle-icon icon-plus"></i></button>
				      				</td>
				      			</tr>
				      		</table>
				      	</form>
				      	<br>
						<div style="float:left; margin-left: 20px">
							<label class="" ng-repeat="category in categories">
						      <input type="checkbox" ng-model="category.checked" value="{{category.id}}"> {{category.name}}
						    </label>
						</div>
						
					</div>
				</div>
				<div class="clear"></div>
				<div class="span6" ng-hide="hideForNew">
					<h3>Media</h3>
					<hr>
					<table class="table table-bordered table-striped table-hover">
						<tbody>

			          		<tr ng-repeat="media in medias | filter:query | orderBy:orderProp:reverse">

			          					<td><a href="#/portfolio/media/{{media.id}}">#{{media.id}}</a></td>
						          		<td><img id="preview_img" src="/assets/images/portfolio/items/small/{{media.src}}" alt=""></td>
				          	</tr>

			          	</tbody>
					</table>
					<a href="#/portfolio/media/{{item.id}}/new" class="btn btn-primary">Ajouter</a>
				</div>

				<div class="span6">
					<h3>Cover</h3>
					<hr>
					<form id="fichier" action="/file_upload/image/portfolio_thumbs" enctype="multipart/form-data" method="POST">
					    <input type="file" name="file" ng-model="item.src" onchange="angular.element(this).scope().uploadFile(this.files)"/>

					    <div ng-show="progressVisible">
				            <div class="percent">{{progress}}%</div>
				            <div class="progress-bar">
				                <div class="uploaded" ng-style="{'width': progress+'%'}"></div>
				            </div>
				        </div>
					</form>
					<div id="upload-output">
						<img id="thumb" width="100px" src="/assets/images/portfolio/thumbs/{{item.src}}" alt="{{item.src}}">
					</div>

				</div>
				<div class="clear"></div>
				<div class="span6">

				<h3>Meta</h3>
				<hr>

				<div class="control-group">
					<label class="control-label" for"inputTitle">Titre</label>
					<div class="controls">
						<input type="text" id="inputTitle" name="title" ng-model="item.meta_title">
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
		</form>
		