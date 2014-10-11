
<div id="viewTools">
	<?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>

<div>
	<h1>Feuille de style : #{{item.id}}</h1>
	<hr>
	<div error-sumary></div>
	<div class="row">
		<?php //include('./menu.php'); ?>

		<div class="col-md-9">

			<h3>Informations</h3>
			<hr>
			<form name="editForm" class="form form-horizontal">
					
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
								<label class="control-label col-xs-2" for"inputWeight">Nom</label>
								<div class="col-xs-6">
									<?php print_input($self, 'text', 'global_stylesheets', 'name', 'item', 'editForm') ?>
								</div>
							</div>
						</div>
						<div class="col-md-6">
							<div class="checkbox">
								<label >
									<checkbox ng-model="item.is_active" value="true"></checkbox> Utiliser la feuille de style
							    </label>
							</div>
						</div>
					</div>
	
			</form>
			<hr />
			<div class="row">
				<div class="col-md-3 item-list">
					<div ng-class="childs[0].id === 'new' ? 'success' : ''" ng-click="createNewVersion()" class="item btn-ripple">
						<h4>Nouveau</h4>
						<span class="data">Créer une nouvelle version</span>
					</div>
					<div 
	      				class="item btn-ripple"
	      				id="item-{{item.id}}"
	      				ng-repeat="item in childs | filter:{id : '!new'}" 
	      				ng-click="getVersion(item.id)"
	      				ng-class="{success : item.statut === 'online', active : item.id === activeChild.id}"
	      				>
	      				<h4>{{item.created_on}}</h4>
	      				<span class="date">{{item.statut}}</span>
	      			</div>
				</div>
				<div class="col-md-9">
					<h3>{{activeChild.id ? 'Version ' + activeChild.version : 'Nouvelle version' }}</h3>
					<form name="childForm">
						<div class="form-group clearfix">
							<label class="control-label col-xs-2">Statut</label>
							<div class="col-md-4">
								<select name="childStatut" ng-model="activeChild.statut">
									<option value="draft">Brouillon</option>
									<option value="online">Courrante</option>
									<!-- <option value="offline">Offline</option> -->
								</select>
							</div>
						</div>
						
						
						<div ui-ace="{
		  useWrapMode : true,
		  showGutter: true,
		  theme:'twilight',
		  mode: 'css',
		  onLoad: aceLoaded}" ng-model="activeChild.content" style="height: 200px"></div>

				</form>
				</div>
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
