<div id="viewTools">
	<button data-role="submit" class="btn btn-primary" ng-click="save()" ng-disabled="editForm.$invalid">Enregistrer<i class="fa fa-check-circle"></i></button>
	<a data-role="cancel" class="btn btn-default" ui-sref="newsItemsList">Annuler<i class="fa fa-reply"></i></a>
	<button data-role="delete" ng-hide="item.name == 'home' || mode == 'new'" class="btn btn-danger" ng-click="delete()">Supprimer<i class="fa fa-trash-o"></i></button>
	<span ng-hide="mode == 'new'">
		<button ng-show="statut == 'pending' || statut == 'draft'" ng-click="pushOnline()" class="btn btn-success">Mettre en ligne <i class="fa fa-upload"></i></button>
		<button ng-show="statut == 'online'" ng-click="pushOffline()" class="btn btn-danger">Archiver <i class="fa fa-archive"></i></button>
	</span>
	<span id="mainAlert">{{alert}}</span>
</div>


<section class="asided-right animated fadeIn" ng-if="item" >
	<h1 class="page-title">News: #{{item.id}} {{item.title}}</h1>

	<div error-sumary></div>

	<div class="row">
		<div class="col-md-12">
			
			<form name="editForm" class="form form-horizontal">

				<tabset class="edit-tabs">
					<tab>
						<tab-heading>
							<i class="fa fa-pencil fa-fw"></i>&nbsp;&nbsp;<strong>News</strong>
						</tab-heading>
						<div class="row">
							<div class="col-md-6">
								<h3>Titre</h3>
								<hr />

								<div class="form-group">
									<label class="control-label col-xs-2" for"inputDbTitle">Titre</label>
									<div class="col-xs-8">
										<?php print_input($self, 'text', 'news_items', 'title', 'item', 'editForm') ?>
									</div>
								</div>

								<div class="form-group">
									<label class="control-label col-xs-2" for"inputIcon">Icone</label>
									<div class="col-xs-8">
										<?php // print_input($self, 'text', 'news_items', 'icon', 'item', 'editForm') ?>
										<span icons-picker ng-model="item.icon"></span>
									</div>
								</div>

							</div>
							<div class="col-md-6">
								
								<h3>Publication</h3>
								<hr />

								<div class="form-group">
									<label class="control-label col-xs-4">Catégorie</label>
									<div class="col-md-8">
										<select name="parent_id" ng-model="item.parent_id">
											<option ng-repeat="category in categories" ng-selected="category.id === item.parent_id" ng-value="category.id">{{category.name}}</option>
										</select>
									</div>
									
								</div>

								<div class="form-group">
									<label class="control-label col-sm-4">Langue</label>
									<div class="controls col-sm-8">
										<?php print_input($self, 'select', 'news_items', 'lang', 'item', 'editForm') ?>
									</div>
								</div>
								
								<div class="form-group">
									<label class="control-label col-xs-4" for"inputDbTitle">Date de publication</label>
									<div class="col-xs-6">
										<input type="text" class="form-control" datepicker-popup="dd-MM-yyyy" ng-model="item.published_on" is-open="opened" min="minDate" />
									</div>
								</div>

								<div class="form-group">
									<label class="control-label col-xs-4" for"inputDbTitle">Date d'archivage</label>
									<div class="col-xs-6">
										<input type="text" class="form-control" datepicker-popup="dd-MM-yyyy" ng-model="item.archived_on" is-open="opened2" min="minDate" />
									</div>
								</div>		

							</div>
						</div>

						<h3>Contenu</h3>
						<hr />

						<div class="row">
							<div class="col-md-4">
								<div image-upload config="uploader" item="item.src" ></div>
							</div>
							<div class="col-md-8">
								<div class="control-group">
									<label class="control-label" for"inputResume">Résumé</label>
									<div class="controls">
										<?php print_input($self, 'textarea', 'news_items', 'resume', 'item', 'editForm') ?>
									</div>
								</div>
								<div class="control-group">
								<label class="control-label" for"inputDbContent_1">Contenu</label>
								<div class="controls">
									<div ng-if="item || mode == 'new' ">
										<?php print_input($self, 'wysiwyg', 'news_items', 'content', 'item', 'editForm') ?>
									</div>
								</div>
							</div>	
							</div>
						</div>
					</tab>

					<tab>
						<tab-heading>
							<i class="fa fa-picture-o fa-fw"></i>&nbsp;&nbsp;<strong>Gallerie</strong>
						</tab-heading>

						<h2>Gallerie d'images</h2>
						<div ng-if="item.id" assets-list-modal></div>
					</tab>
				</tabset>
			</form>

		</div>
	</div>
</div>

<div class="big-aside right">
	<?php $this->load->view('admin/views/desktop/shared/edit_infos'); ?>

	<div class="panel panel-default">
		<div class="panel-heading">
			Meta
		</div>
		<div class="panel-body">
			<label>Keywords</label>
			<?php // print_input($self, 'textarea', 'pages', 'meta_keywords', 'item', 'editForm') ?>
			<input
				id="page_keywords"
			    type="hidden"
			    ui-select2="select2Tags"
			    ng-model="item.meta_keywords"
			    ng-if="select2Tags.tags && item"
			    >
		</div>
	</div>
</div>