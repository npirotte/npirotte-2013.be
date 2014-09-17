<div id="fileDropper-{{uploaderId}}" class="widget-imageupload" ng-class="uploaderClass(model)">
	<button 
	class="upload upload-img" 
	ng-click="triggerUpload()"							
	>
		<i class="fa fa-upload"></i>
	</button>
	<button ng-click="reset()" class="delete-img">
		<i class="fa fa-times"></i>
	</button>
	<img ng-if="model && model != ''" class="upload-container" src="/assets/image/{{config.assetPath}}/{{config.w}}x{{config.h}}/{{model}}" alt="">


	<input type="file" name="file" class="hide" id="fileUploader-{{uploaderId}}" onchange="angular.element(this).scope().uploadFile(this.files)"/>

	<?php $this->load->view('admin/views/desktop/shared/crop_holder', FALSE); ?>
</div>

<div id="progress-bar" >
		<div class="uploaded bar" ng-style="{'width': uploader.progress+'%'}"></div>
</div>