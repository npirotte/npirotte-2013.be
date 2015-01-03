<div id="viewTools">
	<?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>


<section class="asided-right animated fadeIn" ng-if="item" >
	<h1 class="page-title">Catégorie de news : #{{item.id}} {{item.name}}</h1>

	<div error-sumary></div>

	<div class="row">
		<div class="col-md-12">
			
			<form name="editForm" class="form form-horizontal">
			<div class="row">
				<div class="col-md-6">
					<h3>Informations</h3>
			
					<tabset vertical="true" class="vertical-tab lang-tab block-tab" type="pills">
						<?php foreach($this->lang->languages as $lang): ?>
							<tab heading="<?=$lang?>">
								<div class="form-group">
									<label class="control-label col-sm-2" for"inputDbTitle">Nom de la catégories <?=$lang?></label>
									<div class="col-sm-6">
										<?php print_input($self, 'text', 'news_categories', 'name_'.$lang, 'item', 'editForm') ?>
									</div>
								</div>

								<div class="form-group">
									<label class="control-label col-sm-2" for"inputHeight">Slug <?=$lang?></label>
									<div class="col-sm-6">
										<?php print_input($self, 'text', 'news_categories', 'slug_'.$lang, 'item', 'editForm') ?>
									</div>
								</div>
							</tab>
						<?php endforeach; ?>
					</tabset>

				</div>

				<div class="col-md-6">
					<h3>Configuration</h3>
					<hr>
					<div class="form-group">
						<label class="control-label col-sm-2" for"inputHeight">Hauteur</label>
						<div class="col-sm-6">
							<?php print_input($self, 'text', 'news_categories', 'thumb_h', 'item', 'editForm') ?>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label col-sm-2" for"inputWidth">Largeur</label>
						<div class="col-sm-6">
							<?php print_input($self, 'text', 'news_categories', 'thumb_w', 'item', 'editForm') ?>
						</div>
					</div>	
				</div>

				<div class="col-md-12">
					<section ng-if="item.id">

				      	<div class="tools clearfix">

				      		<!-- Search: <input type="text" ng-model="query"> -->

					      	<div class="pull-right">
					      		<div class="pull-right" ng-if="totalItems >= itemPerPage">
					      			<pagination total-items="totalItems" page="currentPage" items-per-page="itemPerPage" on-select-page="setGetPage(page)" previous-text="&lsaquo;" next-text="&rsaquo;" first-text="&laquo;" last-text="&raquo;" boundary-links="true" rotate="false" max-size="3"></pagination>
					      		</div>
					      		<div class="pull-right">
					      			{{offset + 1}} à {{offset + itemPerPage > totalItems ? totalItems : offset + itemPerPage}} / {{totalItems}} &nbsp;
					      		</div> 		
					      	</div>
				      	</div>
				      	
				      	
				      	<hr>

				      	<div ng-show="childs.length == 0" class="alert alert-warning">Cette catégorie ne contient aucun élément. <a href="#/{{section}}/edit/new">Ajouter</a></div> 

					          <table ng-show="childs.length > 0" class="table table-striped table-hover">
					          	<thead>
					          		<th ng-click="orderProp = 'id'; reverse=!reverse">Id</th>
					          		<th>Titre</th>
					          		<th width="96px"></th>
					          	</thead>
					          	<tbody>

					          		<tr ng-dblclick="getView(child.id)" class="{{child.statut}}" ng-repeat="child in childs | filter:query | orderBy:orderProp:reverse">

					          					<td><a ui-sref="newsItemsEdit({id : child.id})">#{{child.id}}</a></td>
								          		<td>{{child.title}}</td>
								          		<td>
								          			<div class="btn-group">
														<a ui-sref="newsItemsEdit({id : child.id})" ><i class="fa fa-pencil  circle-icon"></i></a>
													</div>
								          		</td>
						          	</tr>

					          	</tbody>
					          </table>
				      	</div>
		
					</section>

					<section id="popups">
						<?php $self->load->view('admin/views/desktop/shared/delete_validation', FALSE); ?>
					</section>
				</div>
			
		</div>

	</div>
</section>

<div class="big-aside right">
	<?php $this->load->view('admin/views/desktop/shared/edit_infos'); ?>
</div>