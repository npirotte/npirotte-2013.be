
<div id="viewTools">
	<?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>

<div>
	<h1>Bannière: #{{item.id}} {{item.img_title}}</h1>
	Zone de bannière : <a href="#/banner-zones/edit/{{item.parent_id}}">#{{item.parent_id}}</a>
	<hr>
	<div error-sumary></div>
	<div class="row">
		<?php //include('./menu.php'); ?>

		<div class="col-md-9">

			<h3>Image</h3>
			<hr>
			<small>Min. {{parent.width}} x {{parent.height}}</small>
			<div ng-if="uploader" image-upload config="uploader" item="item.src" ></div>

			<br />
			<h3>Contenu</h3>
			<hr />

			<form name="editForm" class="form form-horizontal">
					
					<tabset>
						<?php foreach($this->lang->languages as $lang): ?>
							<tab heading="<?=$lang?>">
								<br />
								<div class="form-group">
									<label class="control-label col-xs-2" for"inputTitle">Titre (image) <?=$lang?></label>
									<div class="col-xs-6">
										<?php print_input($self, 'text', 'banners_banners', 'img_title_'.$lang, 'item', 'editForm') ?>
									</div>
								</div>

								<div class="form-group">
									<label class="control-label col-xs-2" for"inputAlt">texte alternatif <?=$lang?></label>
									<div class="col-xs-6">
										<?php print_input($self, 'text', 'banners_banners', 'alt_'.$lang, 'item', 'editForm') ?>
									</div>
								</div>

								<div class="form-group">
									<label class="control-label col-xs-2" for"inputLink">Lien (URL) <?=$lang?></label>
									<div class="col-xs-6">
										<?php print_input($self, 'text', 'banners_banners', 'link_'.$lang, 'item', 'editForm') ?>
									</div>
								</div>

								<div class="form-group">
									<label class="control-label col-xs-2" for"inputContent">Contenu <?=$lang?></label>
									<div class="col-xs-6">
										<div ng-if="item || mode == 'new'">
											<?php print_input($self, 'wysiwyg', 'banners_banners', 'content_'.$lang, 'item', 'editForm') ?>
										</div>
									</div>
								</div>
								
							</tab>
						<?php endforeach; ?>
					</tabset>

					<div class="form-group">
						<label class="control-label col-xs-2" for"inputWeight">Ordre</label>
						<div class="col-xs-6">
							<?php print_input($self, 'text', 'banners_banners', 'weight', 'item', 'editForm') ?>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label col-xs-2" for"inputCssclass">Classe Css</label>
						<div class="col-xs-6">
							<?php print_input($self, 'text', 'banners_banners', 'cssclass', 'item', 'editForm') ?>
						</div>
					</div>

			</form>
			
		</div>

		<div class="col-md-2 col-md-offset-1">
			<aside id="edit-aside" class="well" ng-if="item.created_on">
				<strong>Crée le :</strong> {{item.created_on}} <br />
				<strong>Par : </strong><manager-user-infos userid="item.created_by" ></manager-user-infos>

				<div ng-if="item.modified_by">
					<strong>Modifié le : </strong> {{item.modified_on}} <br />
					<strong>Par : </strong><manager-user-infos userid="item.modified_by" ></manager-user-infos>
				</div>
			</aside>
		</div>
    
	</div>

</div>
