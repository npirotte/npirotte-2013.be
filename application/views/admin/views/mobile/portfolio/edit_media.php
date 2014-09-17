<div id="viewTools">
<a class="btn" href="#/portfolio/edit/{{item.parent_id}}">Retour</a>
				<button data-role="submit" class="btn btn-primary" ng-click="save()" >Enregistrer</button>
	      		<button data-role="cancel" class="btn btn-danger" ng-click="reset()" >Annuler</button>
	      		<button data-role="delete" class="btn btn-danger" ng-click="delete()">Supprimer</button>
		      	{{alert}}
</div>

<div>
	<h1>Media: #{{item.id}} {{item.title}}</h1>
	<hr>

	<div class="row">
		<?php //include('./menu.php'); ?>

		<div class="span12">
			<form class="form form-horizontal">
				
		      	Portfolio : <a href="#/portfolio/edit/{{item.parent_id}}">#{{item.parent_id}}</a>

					<div class="control-group">
						<label class="control-label" for"inputTitle">Titre</label>
						<div class="controls">
							

							<input type="text" id="inputTitle" name="title" ng-model="item.img_title">
						</div>
					</div>

					<div class="control-group">
						<label class="control-label" for"inputAlt">texte alternatif</label>
						<div class="controls">
							<input type="text" id="inputAlt" name="alt" ng-model="item.alt">
						</div>
					</div>

					<div class="control-group">
						<label class="control-label" for"inputWeight">Ordre</label>
						<div class="controls">
							<input type="text" id="inputWeight" name="alt" ng-model="item.weight">
						</div>
					</div

			</form>
			<h3>Image</h3>
			<hr>
			<form id="fichier" action="/file_upload/image/portfolio_thumbs" enctype="multipart/form-data" method="POST">
					    <input type="file" name="file" onchange="angular.element(this).scope().uploadFile(this.files)"/>

					    <div ng-show="progressVisible">
				            <div class="percent">{{progress}}%</div>
				            <div class="progress-bar">
				                <div class="uploaded" ng-style="{'width': progress+'%'}"></div>
				            </div>
				        </div>
					</form>
					<div id="upload-output">
						<img id="thumb" width="100px" src="/assets/images/portfolio/items/small/{{item.src}}" alt="{{item.src}}">
					</div>
    
</div>
			

</div>
