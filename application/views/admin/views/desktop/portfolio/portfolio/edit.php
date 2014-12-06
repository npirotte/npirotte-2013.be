<div id="viewTools">
	<?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>


<section class="asided-right animated fadeIn" ng-if="item" >
	<h1 class="page-title">Portfolio: #{{item.id}} {{item.db_title_default}}</h1>

	<div class="row">

		<div class="col-md-12">

			<form name="editForm" class="form form-horizontal">

				<div class="row">
					<div class="col-sm-6">
				
						<h3>Contenu</h3>
						<hr>

						<?php foreach($this->lang->languages as $lang): ?>
							<div class="form-group">
								<label class="control-label col-sm-2">Titre <?=$lang?></label>
								<div class="col-sm-6">
									<?php print_input($self, 'text', 'portfolio_items', 'name_'.$lang, 'item', 'editForm') ?>
								</div>
							</div>
						<?php endforeach; ?>

						<div class="form-group">
							<label class="control-label col-xs-2" for"inputIcon">Icone</label>
							<div class="col-xs-6">
								<?php //print_input($self, 'text', 'portfolio_items', 'icon', 'item', 'editForm') ?>
								<span icons-picker ng-model="item.icon"></span>
							</div>
						</div>

						<div class="form-group">
							<label class="control-label col-xs-2" for"inputWeight">Ordre</label>
							<div class="col-xs-6">
								<?php print_input($self, 'text', 'portfolio_items', 'weight', 'item', 'editForm') ?>
							</div>
						</div>
					</div>
					<div class="col-sm-6">
						<div>
							<h3>Catégories</h3>
							<hr>
							
					      		<table>
					      			<tr>
					      				<td>
					      					<label for="">Ajouter &nbsp;</label>
					      				</td>
					      				<td>
					      					<input ng-model="newCategory.name" type="text">
					      				</td>
					      				<td>
					      					<button ng-click="createNewCategoty()"><i class="circle-icon fa fa-plus"></i></button>
					      				</td>
					      			</tr>
					      		</table>
					      	
					      	<br>
							<div classs="checkbox" ng-repeat="category in categories">
								<label >
									<checkbox ng-model="item.categories[category.id]" value="{{category.id}}"></checkbox> {{category.name}}
							    </label>
							</div>
							
						</div>
					</div>
						<div class="clear"></div>

						<div class="col-sm-12">
							<tabset>
								<?php foreach($this->lang->languages as $lang): ?>
									<tab heading="<?=$lang?>">
										<br />
										<div class="form-group">
											<label class="control-label col-sm-2">Résumé <?=$lang?></label>
											<div class="col-sm-6">
												<?php print_input($self, 'textarea', 'portfolio_items', 'resume_'.$lang, 'item', 'editForm') ?>
											</div>
										</div>

										<div class="form-group">
											<label class="control-label col-sm-2">Contenu <?=$lang?></label>
											<div class="col-sm-6">
												<div ng-if="item || mode == 'new'">
													<?php print_input($self, 'wysiwyg', 'portfolio_items', 'description_'.$lang, 'item', 'editForm') ?>
												</div>
											</div>
										</div>
									</tab>
								<?php endforeach; ?>
							</tabset>
						</div>

						<div class="clear"></div>
						<div class="col-sm-6" ng-hide="hideForNew">
							<h3>Media</h3>
							<hr>

							<div ng-if="item.id" assets-list-modal></div>
						</div>

						<div class="col-sm-6">
							<h3>Cover</h3>
							<hr>
							<div class="form-group">
							<div image-upload config="uploader" item="item.src" ></div>
						</div>

												
					</div>
				</div>

			</form>		
		</div>
	
	</div>		
</section>

<div class="big-aside right">
  <?php $this->load->view('admin/views/desktop/shared/edit_infos'); ?>

	<div class="panel panel-default">
		<div class="panel-heading">
			Meta
		</div>
		<div class="panel-body">
			<tabset>
				<?php foreach($this->lang->languages as $lang): ?>
					<tab heading="<?=$lang?>">
						<label>Titre <?=$lang?></label>
						<?php print_input($self, 'text', 'portfolio_items', 'meta_title_'.$lang, 'item', 'editForm') ?>
						<label>Keywords <?=$lang?></label>
						<?php // print_input($self, 'textarea', 'pages', 'meta_keywords', 'item', 'editForm') ?>
						<input
							id="page_keywords"
						    type="hidden"
						    ui-select2="select2Tags"
						    ng-model="item.meta_keywords_<?=$lang?>"
						    ng-if="select2Tags.tags && item"
						    >
						<label>Description <?=$lang?></label>
						<?php print_input($self, 'textarea', 'portfolio_items', 'meta_description_'.$lang, 'item', 'editForm') ?>
					</tab>
				<?php endforeach; ?>	
			</tabset>
		</div>
	</div>
</div>