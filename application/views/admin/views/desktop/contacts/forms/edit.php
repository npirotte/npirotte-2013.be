<div id="viewTools">
	<?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>

<div>
	<h1>Formulaire : #{{item.id}} {{item.name}}</h1>
	<hr />
	<div error-sumary></div>

	<div class="row">
		<div class="col-md-9">
			

			<form name="editForm" class="form form-horizontal">
				<div class="row">
					<div class="col-sm-12">
						<h3>Informations</h3>
						<hr />
					</div>
				</div>
				<div class="row">

					<div class="col-sm-6">
						<div class="form-group">
							<label class="control-label col-xs-2">Nom</label>
							<div class="col-xs-6">
								<?php print_input($self, 'text', 'contact_forms', 'name', 'item', 'editForm') ?>
							</div>
						</div>
						<div class="form-group">
							<label class="control-label col-xs-2">Email de réception</label>
							<div class="col-xs-6">
								<?php print_input($self, 'text', 'contact_forms', 'mailto', 'item', 'editForm') ?>
							</div>
						</div>
					</div>

					<div class="col-sm-6">
						<div class="form-group">
							<label class="control-label col-xs-2">Message d'envoi</label>
							<div class="col-xs-6">
								<?php print_input($self, 'textarea', 'contact_forms', 'success_message', 'item', 'editForm') ?>
							</div>
						</div>
					</div>
				</div>
			</form>

			<div class="row" ng-if="item.id">
				<div class="col-sm-12">
					<div forms-fields ></div>
				</div>
			</div>

		</div>

		<div class="col-md-2 col-md-offset-1">
			<?php $this->load->view('admin/views/desktop/shared/edit_infos'); ?>
		</div>
	</div>
	
</div>