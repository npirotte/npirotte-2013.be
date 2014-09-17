<h3>Plats</h3>
			         <hr/>
						
					<button class="btn btn-primary" ng-click="editModeOpen = !editModeOpen;">
						Ajouter 
						<i  class="icon-plus"></i>
					</button>
					<br />
					<br />

					<div class="modal-backdrop fade in" ng-show="editModeOpen" ng-click="editModeOpen = !editModeOpen"></div>

			         <div id="item-creation-popup" class="modal" ng-show="editModeOpen">
						<div class="modal-header">
							<div class="modal-inner">
								<h2 ng-if="!editMode">Création d'un plat</h2>
								<h2 ng-if="editMode">Modification d'un plat</h2>
							</div>
						</div>

						<div class="modal-body">
							<div class="modal-inner">

										<form name="itemCreation" ng-hide="editMode">
									         <div class="row-fluid" >
									         	<div class="col-sm-6">
									         		<label>Nom</label>
									         		<?php print_input($self, 'text', 'carte_items', 'name', 'newCarteItem', 'itemCreation') ?>
									         	</div>
									         	<div class="col-sm-6">
									         		<label>Prix</label>
									         		<?php print_input($self, 'text', 'contact_infos', 'price', 'newCarteItem', 'itemCreation') ?>
									         	</div>
									         </div>
									         <div class="row-fluid" >

									         	<div class="col-sm-12">
									         		<label>Description</label>
									         		<?php print_input($self, 'textarea', 'contact_infos', 'desc', 'newCarteItem', 'itemCreation') ?>
									         	</div>
									         </div>
									         <br />
									         <button ng-disabled="itemCreation.$invalid" class="btn btn-primary" ng-click="addCarteItem()" >Ajouter</button>	
											<button ng-click="editMode = false; editModeOpen = false" class="btn" >Annuler</button>
								         </form>

								          <form name="itemEdit" ng-show="editMode">
								         	<h4>Modification</h4>
									         <div class="row-fluid">
									         	<div class="col-sm-6">
									         		<label>Nom</label>
									         		<?php print_input($self, 'text', 'carte_items', 'name', 'editedItem', 'itemEdit') ?>
									         	</div>
									         	<div class="col-sm-6">
									         		<label>Prix</label>
									         		<?php print_input($self, 'text', 'contact_infos', 'price', 'editedItem', 'itemEdit') ?>
									         	</div>
									         </div>
									         <div class="row-fluid">

									         	<div class="col-sm-12">
									         		<label>Description</label>
									         		<?php print_input($self, 'textarea', 'contact_infos', 'desc', 'editedItem', 'itemEdit') ?>
									         	</div>

									         </div>
									         <br>
									         <button ng-disabled="itemEdit.$invalid" ng-click="updateCarteItem()" class="btn btn-primary" >Enregistrer</button>	
									         <button ng-click="deleteCarteItem()" class="btn btn-danger" >Supprimer</button>	
									         <button ng-click="editMode = false; editModeOpen = false" class="btn" >Annuler</button>

									         <br />   
								         </form>

							</div>
						</div>
					</div>
					
			         
				    <div ng-show="carteItems.length == 0" class="alert alert-warning">Cette catégorie ne contient aucun élément. <a href="" ng-click="editModeOpen = !editModeOpen;" >Ajouter</a></div>   		

			         <table class="table table-bordered table-striped table-hover" ng-if="carteItems.length > 0">
			          	<thead>
			          		<th ng-click="orderProp = 'id'; reverse=!reverse">Id</th>
			          		<th>Nom</th>
			          		<th>Description</th>
			          		<th>Prix</th>
			          		<th width="76px">
			          		
			          		</th>
			          	</thead>
			          	<tbody ui:sortable="sortableOptions" ng:model="carteItems">

			          		<tr ng-repeat="carteItem in carteItems | orderBy:'weight'">
			          			<td>#{{carteItem.weight}}</td>
						         <td>{{carteItem.name}}</td>
						         <td>{{carteItem.desc}}</td>
						         <td>{{carteItem.price}}</td>
						         <td>
						         	<button ng-click="switchEditMode(carteItem)">
				          				<i class="icon-pencil circle-icon"></i>
				          			</button>
				          			<div class="pull-right reorder">
				          				<button ng-hide="$index == 0" ng-click="reorder(carteItem, 'minus')">
					          				<i class="icon-angle-up"></i>
					          			</button>
					          			<button ng-hide="$index == carteItems.length-1" ng-click="reorder(carteItem, 'plus')">
					          				<i class="icon-angle-down"></i>
					          			</button>
				          			</div>
						         </td>
				          	</tr>
				   
			          	</tbody>
			         </table>