<div id="fileDropper-{{uploaderId}}" class="widget-imageupload" ng-class="uploaderClass(model)" ng-style="{ 'max-width' : config.w > 0 ? (config.w + 8) + 'px' : 'none'}">

	<div class="widget-imageupload-tools">
		<button 
		class="upload upload-img" 
		ng-click="triggerUpload()"							
		>
			<i class="fa fa-upload" ng-class="model && model != '' ? 'circle-icon' : ''"></i>
		</button>
		<button ng-click="reset()" class="delete-img">
			<i class="fa fa-times circle-icon"></i>
		</button>	
	</div>
	
	<img ng-if="model && model != ''" class="upload-container" src="/assets/image/{{config.assetPath}}/{{config.w}}x{{config.h}}/{{model}}" alt="">


	<input type="file" name="file" class="hide" id="fileUploader-{{uploaderId}}" onchange="angular.element(this).scope().uploadFile(this.files)"/>

	<?php $this->load->view('admin/views/desktop/shared/crop_holder', FALSE); ?>
</div>

<div id="progress-bar" >
		<div class="uploaded bar" ng-style="{'width': uploader.progress+'%'}"></div>
</div>