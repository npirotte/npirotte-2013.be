<div id="viewTools">
     <?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>


<section>
	<h1>Catégorie: #{{item.id}} {{item.name}}</h1>
	<hr>
	<div error-sumary></div>

	<div class="row">
		<?php //include('../menu.php'); ?>

		<div class="col-md-9">
			<form name="editForm" class="form form-horizontal">
				
				<div class="row">

					<div class="col-md-6">
						<h3>Identité</h3>
						<hr/>

						<?php foreach($this->lang->languages as $lang): ?>
							<div class="form-group">
								<label class="control-label col-sm-2" for"inputName">Titre <?=$lang?></label>
								<div class="col-sm-6">
									<?php print_input($self, 'text', 'portfolio_categories', 'name_'.$lang, 'item', 'editForm') ?>
								</div>
							</div>
						<?php endforeach; ?>

						<div class="form-group">
							<label class="control-label col-sm-2" for"inputWeight">Ordre</label>
							<div class="col-sm-6">
								<?php print_input($self, 'text', 'portfolio_categories', 'weight', 'item', 'editForm') ?>
							</div>
						</div>
					</div>

					<div class="col-md-6">
						<h3>Métas</h3>
						<hr />
						<tabset>
							<?php foreach($this->lang->languages as $lang): ?>
								<tab heading="<?=$lang?>">
									<br />
									<div class="form-group">
										<label class="control-label col-sm-2">Titre <?=$lang?></label>
										<div class="col-sm-6">
											<?php print_input($self, 'text', 'portfolio_categories', 'meta_title_'.$lang, 'item', 'editForm') ?>
										</div>
									</div>

									<div class="form-group">
										<label class="control-label col-sm-2">Description <?=$lang?></label>
										<div class="col-sm-6">
											<?php print_input($self, 'textarea', 'portfolio_categories', 'meta_description_'.$lang, 'item', 'editForm') ?>
										</div>
									</div>

									<div class="form-group">
										<label class="control-label col-sm-2">Keywords</label>
										<div class="col-sm-6">
											<input
											id="page_keywords"
										    type="hidden"
										    ui-select2="select2Tags"
										    ng-model="item.meta_keywords_<?=$lang?>"
										    ng-if="select2Tags.tags && item"
										    >
										</div>
									</div>

								</tab>
							<?php endforeach; ?>
						</tabset>
						
					</div>
					
				</div>		

			</form>
		</div>
		<div class="col-md-2 col-md-offset-1">
			<?php $this->load->view('admin/views/desktop/shared/edit_infos'); ?>
		</div>
	</div>
</section>