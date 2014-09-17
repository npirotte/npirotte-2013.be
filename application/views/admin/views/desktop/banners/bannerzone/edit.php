
<div id="viewTools">
	<?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>


<div>
	<h1>Zone de bannière : #{{item.id}} {{item.name}}</h1>
	<hr>
	<div error-sumary></div>
	<div class="row">
		<div class="col-md-9">
			
		
			<div class="row">
				<form name="editForm" class="form form-horizontal">
					<div class="col-sm-6">
					

						<h3>Informations</h3>
						<hr>


						<div class="form-group">
							<label class="control-label col-xs-3" for"inputDbTitle">Nom de la zone</label>
							<div class="col-xs-6">
								<?php print_input($self, 'text', 'banners_zones', 'name', 'item', 'editForm') ?>
							</div>
						</div>

						<div class="form-group">
							<label class="control-label col-xs-3" for"inputHeight">Hauteur</label>
							<div class="col-xs-6">
								<?php print_input($self, 'text', 'banners_zones', 'height', 'item', 'editForm') ?>
							</div>
						</div>

						<div class="form-group">
							<label class="control-label col-xs-3" for"inputWidth">Largeur</label>
							<div class="col-xs-6">
								<?php print_input($self, 'text', 'banners_zones', 'width', 'item', 'editForm') ?>
							</div>
						</div>	

						<div class="form-group">
							<label class="control-label col-xs-3" for"inputCssclass">Classe Css</label>
							<div class="col-xs-6">
								<?php print_input($self, 'text', 'banners_zones', 'cssclass', 'item', 'editForm') ?>
							</div>
						</div>				

					</div>
					<div class="col-sm-6">
						<h3>Configuration</h3>
						<hr>
						<div class="form-group">
							<label class="control-label col-xs-3" for"selectType">Type</label>
							<div class="col-xs-6">
								<?php print_input($self, 'select', 'banners_zones', 'type', 'item', 'editForm') ?>
							</div>
						</div>
						<div ng-if="item.type=='slideshow'" class="well">
							<div class="form-group">
								<label class="control-label col-xs-3" for"inputSpeed">Vitesse (ms)</label>
								<div class="col-xs-6">
									<?php //print_input($self, 'text', 'banners_zones', 'speed', 'item', 'editForm') ?>	
									<div slider ng-model="item.speed" step=100 start=0 end=10000></div>
								</div>
								<div class="col-xs-2">
									{{item.speed}} ms
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-xs-3" for"inputEffect">Effect (slide/fade)</label>
								<div class="col-xs-6">
									<?php print_input($self, 'select', 'banners_zones', 'effect', 'item', 'editForm') ?>
								</div>
							</div>
						</div>
						
					</div>
						
					<div class="clear"></div>
					<div class="col-sm-6" ng-if="item.id">
						<h3>Bannières</h3>
						<hr>
						<div assets-list ></div>
					</div>


				</form>
			</div>

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

		