<div id="viewTools">
	<?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>

<section>
	<h1>Page : #{{item.id}} {{item.name}}</h1>
	<hr />
	<div error-sumary></div>

	<div class="row">
		<div class="col-md-9">
			<form name="editForm" class="form form-horizontal" novalidate>

				<div class="row">
					
					<div class="col-md-6">
						<h3>Identité</h3>
						<hr />

						<div class="form-group">
							<label class="control-label col-sm-2">Nom</label>
							<div class="controls col-sm-6">
								<?php print_input($self, 'text', 'pages', 'name', 'item', 'editForm') ?>
							</div>
						</div>

						<div class="form-group">
							<label class="control-label col-sm-2">Slug</label>
							<div class="controls col-sm-6">
								<?php print_input($self, 'text', 'pages', 'slug', 'item', 'editForm') ?>
							</div>
						</div>

						<div class="form-group">
							<label class="control-label col-sm-2">Langue</label>
							<div class="controls col-sm-6">
								<?php print_input($self, 'select', 'pages', 'lang', 'item', 'editForm') ?>
							</div>
						</div>

						<div class="form-group">
							<label class="control-label col-sm-2">Parent</label>
							<div class="controls col-sm-6">
								<select ui-select2 name="type" ng-model='item.parent_id' ng-if="pagesList.length > 0">
									<option ng-if="page.id != item.id" ng-repeat="page in pagesList" value="{{page.id}}">{{page.name}}</option>
								</select>
							</div>
						</div>

						<div class="form-group">
							<label class="control-label col-sm-2">Ordre</label>
							<div class="controls col-sm-6">
								<?php print_input($self, 'text', 'pages', 'weight', 'item', 'editForm') ?>
							</div>
						</div>


					</div>

					<div class="col-md-6">
						<h3>Template</h3>

						<hr />

						<div class="form-group">
							<label class="control-label col-sm-2">Type de template</label>
							<div class="controls col-sm-6">
								<?php print_input($self, 'select', 'pages', 'type', 'item', 'editForm') ?>
							</div>
						</div>

						<div class="form-group" ng-if="item.type">
							<label class="control-label col-sm-2">{{ item.type === 'template' ? 'Template' : 'Fichier' }}</label>
							<div class="controls col-sm-6">
								<select ng-change="getTemplateFields()" ui-select2 name="type" ng-model='item.template'>
									<option ng-if="item.type === 'file'" ng-repeat="templateFile in templateFiles" value="{{templateFile}}">{{templateFile}}</option>
									<option ng-if="item.type === 'template'" ng-repeat="template in templates" value="{{template.id}}">{{template.name}}</option>
								</select>
							</div>
						</div>

					</div>
				</div>

				<div ng-if="item.type =='template' && item.template != undefined">
					<h3>Contenu</h3>
					<hr />

					<div ng-repeat="templateField in templateFields">
						<h4>{{templateField.name}}</h4>
						<div ng-switch="templateField.type"> 
							<div ng-switch-default>
								<input type="text" ng-model="templateField.fieldValue" />
							</div>
							<div ng-switch-when="textEditor">
								<label class="checkbox">
									<input type="checkbox" ng-model="templateField.raw"> Editeur html
								</label>
								<div ng-if="!templateField.raw" style="min-height: 200px">
									<textarea ui-tinymce="tinymceOptions" ng-model="templateField.fieldValue"  ></textarea>
								</div>
								<div ng-if="templateField.raw" ui-ace="{
								  useWrapMode : true,
								  showGutter: true,
								  theme:'twilight',
								  mode: 'html',
								  onLoad: aceLoaded}" ng-model="templateField.fieldValue" style="height: 200px"></div>
							</div>
							<div ng-switch-when="htmlEditor">
								<div ui-ace="{
								  useWrapMode : true,
								  showGutter: true,
								  theme:'twilight',
								  mode: 'html',
								  onLoad: aceLoaded}" ng-model="templateField.fieldValue" style="height: 200px"></div>
							</div>
							<div ng-switch-when="checkbox">
								<input type="checkbox" ng-checked="templateField.fieldValue == 1" ng-model="templateField.fieldValue">
							</div>
							<div ng-switch-when="gridEditor" class="well">
								<div grid-wizard content="templateField.fieldValue" ></div>
							</div>

							<hr />
						</div>
					</div>
				</div>
			</form>
		</div>

		<div class="col-md-2 col-md-offset-1">
			<?php $this->load->view('admin/views/desktop/shared/edit_infos'); ?>
			<div class="panel panel-default">
				<div class="panel-body">
					<strong>Version :</strong> {{item.version}}
				</div>
			</div>
			<div class="panel panel-default">
				<div class="panel-heading">
					Meta
				</div>
				<div class="panel-body">
					<label>Titre</label>
					<?php print_input($self, 'text', 'pages', 'meta_title', 'item', 'editForm') ?>
					<label>Keywords</label>
					<?php // print_input($self, 'textarea', 'pages', 'meta_keywords', 'item', 'editForm') ?>
					<input
						id="page_keywords"
					    type="hidden"
					    ui-select2="select2Tags"
					    ng-model="item.meta_keywords"
					    ng-if="select2Tags.tags && item"
					    >
					<label>Description</label>
					<?php print_input($self, 'textarea', 'pages', 'meta_description', 'item', 'editForm') ?>
				</div>
			</div>

			<div class="panel panel-default">
				<div class="panel-heading">
					Site Map
				</div>
				<div class="panel-body">
					<div pages-site-map small-size="true" current="mode"></div>
				</div>
			</div>

			<div class="panel panel-default">
				<div class="panel-heading">
					Droits d'accès
				</div>
				<div class="panel-body">
					<div class="checkbox" ng-repeat="group in userGroups">
						<label >
							<checkbox ng-model="group.checked" value="{{group.id}}"></checkbox> {{group.ugrp_name}}
					    </label>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>