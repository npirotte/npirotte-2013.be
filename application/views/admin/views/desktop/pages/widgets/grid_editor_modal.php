<div class="modal-content">
    <div class="modal-header">
      <div class="container">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h3>itemion :</h3>
      </div>
    </div>
    <div class="modal-body container" ng-if="item">
    	<div>
    		<label class="radio-inline" style="display: inline">
		<input type="radio" ng-model="item.type" value="text">
		Texte
	</label>
	<label class="radio-inline" style="display: inline">
		<input type="radio" ng-model="item.type" value="img">
		Image
	</label>
	<label class="radio-inline" style="display: inline">
		<input type="radio" ng-model="item.type" value="rawHtml">	
		Html
	</label>
    	</div>
      <div>
      	<div ng-if="item.type == 'text'">
		<textarea ui-tinymce="tinymceOptions" ng-model="item.content"></textarea>
	</div>

	<div ng-if="item.type == 'rawHtml'">
		<div ui-ace="{
useWrapMode : true,
showGutter: true,
theme:'twilight',
mode: 'html',
onLoad: aceLoaded}" ng-model="item.content" style="height: 200px"></div>
	</div>

	<div ng-if="item.type == 'img'">
		<div image-upload config="uploader" item="item.content" ></div>
	</div>
      </div>

      <div>
      	<label for="cssClassitem">Classe Css</label>
	<input type="text" id="cssClassitem" ng-model="item.cssClass">
	<div ng-show="item.type == 'img'">
		<label>Chemin de l'image (relatif au répertoire (Imapges/Pages)</label>
		<input type="text" ng-model="item.content">
		<label for="Altitem">Texte alternatif</label>
		<input type="text" id="Altitem" ng-model="item.altText">
	</div>
      </div>

    </div>
    <footer class="modal-footer">
    	<div class="container">
    		<button class="btn btn-danger" ng-click='cancel()'>Annuler</button>
    		<button class="btn btn-primary" ng-click='ok()'>Terminer</button>
    	</div>
</footer>
</div>