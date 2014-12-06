<div id="viewTools">
	<?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>

<section class="asided-right animated fadeIn" ng-if="item" >
	<h1 class="page-title">Template {{'#' + item.id + ' ' + item.name}}</h1>

	<div error-sumary></div>

	<div class="row">
		<div class="col-md-12">
			<form name="editForm" class="form form-horizontal" novalidate>
				<div class="row">
					<div class="col-md-6">
						<div class="form-group">
							<label class="control-label col-sm-2" for"inputName">Nom</label>
							<div class="controls col-sm-6">
								<?php print_input($self, 'text', 'pages_templates', 'name', 'item', 'editForm') ?>
							</div>
						</div>
					</div>
					<div class="col-md-6">
						<div class="form-group">
							<label class="control-label col-sm-2" for"inputName">Type de contenu</label>
							<div class="controls col-sm-6">
								<?php print_input($self, 'select', 'pages_templates', 'type', 'item', 'editForm') ?>
							</div>
						</div>
					</div>
				</div>
				
				<div class="control-group" ng-if="item.type == 'file'">
					<label>Contenu</label>
					<select name="type" ng-model='item.content'>
						<option ng-repeat="templateFile in templateFiles" value="{{templateFile}}">{{templateFile}}</option>
					</select>
				</div>

				<div class="control-group" ng-if="item.type == 'database'">
					<label>Contenu</label>
					<?php print_input($self, 'htmleditor', 'pages_templates', 'content', 'item', 'editForm') ?>
				</div>
			</form>
		</div>
	</div>	
</section>

<div class="big-aside right">
	<?php $this->load->view('admin/views/desktop/shared/edit_infos'); ?>
</div>
