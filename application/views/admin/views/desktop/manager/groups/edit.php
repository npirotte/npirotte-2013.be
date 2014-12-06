<div id="viewTools">
	<?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>


<section class="asided-right animated fadeIn" ng-if="item">
<section class="asided-right >
	<h1 class="page-title">Groupe d'utilisateur : #{{item.id}} {{item.name}}</h1>

	<div class="row">
		<div class="col-md-12">
			<div error-sumary></div>
			<form name="editForm" class="form form-horizontal">
			<div class="row">
				<div class="col-md-6">
					<h3>Informations</h3>
					<hr>
					<div class="form-group">
						<label class="control-label col-sm-2" for"inputHeight">Nom</label>
						<div class="col-sm-6">
							<?php print_input($self, 'text', 'user_groups', 'ugrp_name', 'item', 'editForm') ?>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label col-sm-2" for"inputHeight">Description</label>
						<div class="col-sm-6">
							<?php print_input($self, 'textarea', 'user_groups', 'ugrp_desc', 'item', 'editForm') ?>
						</div>
					</div>

				</div>

				<div class="col-md-6">
					<h3>Configuration</h3>
					<hr>
					<div class="form-group">
						<label class="control-label col-sm-3" for"inputHeight">Est administrateur</label>
						<div class="col-sm-6">
							<checkbox ng-model="item.ugrp_admin" value="1"></checkbox>
						</div>
					</div>
				</div>
			
		</div>
	</div>
</div>

<div class="big-aside right">
	<?php $this->load->view('admin/views/desktop/shared/edit_infos'); ?>
</div>