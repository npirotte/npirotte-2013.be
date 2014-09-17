<h3>Champs du formulaire</h3>
			         <hr/>
						
					<button class="btn btn-primary" onclick="$('#item-creation-popup').modal()">
						Ajouter 
						<i  class="icon-plus"></i>
					</button>
					<br />
					<br />

					<!-- <div class="modal-backdrop fade in" ng-show="editModeOpen" ng-click="editModeOpen = !editModeOpen"></div> -->

			         <div id="item-creation-popup" class="modal fade">
			         	<div class="modal-content">
			         		
							<div class="modal-header">
								<div class="modal-inner container">
									<h2 ng-if="!editMode">Création d'un champ</h2>
									<h2 ng-if="editMode">Modification d'un champ</h2>
								</div>
							</div>

							<div class="modal-body">
								<div class="modal-inne container">

											<form name="itemCreation" ng-hide="editMode">
										         <div class="row" >
										         	<div class="col-sm-6">
										         		<label>Nom</label>
										         		<?php print_input($self, 'text', 'contact_forms_fields', 'name', 'newField', 'itemCreation') ?>
										         	</div>
										         	<div class="col-sm-6">
										         		<label>Type de champ</label>
										         		<?php print_input($self, 'select', 'contact_forms_fields', 'field_type', 'newField', 'itemCreation') ?>
										         	</div>
										         </div>
										         <div class="row" >

										         	<div class="col-sm-6">
										         		<label>Label</label>
										         		<?php print_input($self, 'text', 'contact_forms_fields', 'display_name', 'newField', 'itemCreation') ?>
										         	</div>
										         	<div class="col-sm-6">
										         		<label>Placeholder</label>
										         		<?php print_input($self, 'text', 'contact_forms_fields', 'placeholder', 'newField', 'itemCreation') ?>
										         	</div>

										         </div>

										         <div class="row">
										         	<div class="col-sm-6">
										         		<label>Champ requis <input type="checkbox" ng-model="newField.is_mandatory"></label>
										         		
										         	</div>
										         	<div class="col-sm-6">
										         		<label>Validation</label>
										         		<?php print_input($self, 'select', 'contact_forms_fields', 'validation', 'newField', 'itemCreation') ?>

										         		<div ng-show="newField.validation == 'regexp'">
											         		<label>Expression régulière</label>
											         		<?php print_input($self, 'text', 'contact_forms_fields', 'validation_regexp', 'newField', 'itemCreation') ?>
											         	</div>
										         	</div>
										         </div>

										         <div ng-show="newField.field_type == 'checkbox_list' || newField.field_type == 'radio_list' || newField.field_type == 'select' " class="row-fluid">
										         	<div class="col-sm-12">
										         		<h3>Valeurs</h3>
										         		<table>
										         			<thead>
										         				<tr>
										         					<th>Valeur</th>
										         					<th>Label</th>
										         					<th></th>
										         				</tr>
										         			</thead>
										         			<tbody>
										         				<tr ng-repeat="fieldValue in newField.field_values">
										         					<td><input type="text" ng-model="fieldValue.field_value"></td>
										         					<td><input type="text" ng-model="fieldValue.field_display_value"></td>
										         					<td>
										         						<button ng-click="fieldvalues.remove('newField', $index)">
													          				<i class="icon-trash circle-icon"></i>
													          			</button>
										         					</td>
										         				</tr>
										         			</tbody>
										         		</table>
										         		<button ng-click="fieldvalues.add('newField')" class="btn btn-primary">Ajouter</button>
										         	</div>
										         </div>
										         <br />
										         <button ng-disabled="itemCreation.$invalid" class="btn btn-primary" ng-click="addField()" >Ajouter</button>	
												<button ng-click="editMode = false" data-dismiss="modal" class="btn btn-default" >Annuler</button>
									         </form>

									          <form name="itemEdit" ng-show="editMode">
									         	<h4>Modification</h4>
										         <div class="row" >
										         	<div class="col-sm-6">
										         		<label>Nom</label>
										         		<?php print_input($self, 'text', 'contact_forms_fields', 'name', 'editedItem', 'itemEdit') ?>
										         	</div>
										         	<div class="col-sm-6">
										         		<label>Type de champ</label>
										         		<?php print_input($self, 'select', 'contact_forms_fields', 'field_type', 'editedItem', 'itemEdit') ?>
										         	</div>
										         </div>
										         <div class="row" >

										         	<div class="col-sm-6">
										         		<label>Label</label>
										         		<?php print_input($self, 'text', 'contact_forms_fields', 'display_name', 'editedItem', 'itemEdit') ?>
										         	</div>
										         	<div class="col-sm-6">
										         		<label>Placeholder</label>
										         		<?php print_input($self, 'text', 'contact_forms_fields', 'placeholder', 'editedItem', 'itemEdit') ?>
										         	</div>

										         </div>

										         <div class="row">

										         	<div class="col-sm-6">
										         		<label>Champ requis <input type="checkbox" ng-model="editedItem.is_mandatory"  ng-checked="editedItem.is_mandatory == 1"></label>
										         		
										         	</div>
										         	<div class="col-sm-6">
										         		<label>Validation</label>
										         		<?php print_input($self, 'select', 'contact_forms_fields', 'validation', 'editedItem', 'itemEdit') ?>

										         		<div ng-show="newField.validation == 'regexp'">
											         		<label>Expression régulière</label>
											         		<?php print_input($self, 'text', 'contact_forms_fields', 'validation_regexp', 'editedItem', 'itemEdit') ?>
											         	</div>
										         	</div>
										         </div>

										         <div ng-show="editedItem.field_type == 'checkbox_list' || editedItem.field_type == 'radio_list' || editedItem.field_type == 'select' " class="row-fluid">
										         	<div class="col-sm-12">
										         		<h3>Valeurs</h3>
										         		<table>
										         			<thead>
										         				<th>
										         					<td>Valeur</td>
										         					<td>Label</td>
										         					<td></td>
										         				</th>
										         			</thead>
										         			<tbody>
										         				<tr ng-repeat="fieldValue in editedItem.field_values">
										         					<td><input type="text" ng-model="fieldValue.field_value"></td>
										         					<td><input type="text" ng-model="fieldValue.field_display_value"></td>
										         					<td>
										         						<button ng-click="fieldvalues.remove('editedItem', $index)">
													          				<i class="icon-trash circle-icon"></i>
													          			</button>
										         					</td>
										         				</tr>
										         			</tbody>
										         		</table>
										         		<button ng-click="fieldvalues.add('editedItem')" class="btn btn-primary">Ajouter</button>
										         	</div>
										         </div>
										         <br>
										         <button ng-disabled="itemEdit.$invalid" ng-click="updateField()" class="btn btn-primary" >Enregistrer</button>	
										         <button ng-click="deleteField()" data-dismiss="modal" class="btn btn-danger" >Supprimer</button>	
										         <button ng-click="editMode = false" data-dismiss="modal" class="btn btn-default" >Annuler</button>

										         <br />   
									         </form>

								</div>
							</div>

						</div>
					</div>
					
			         
				    <div ng-show="formFields.length == 0" class="alert alert-warning">Cette catégorie ne contient aucun élément. <a href="" onclick="$('#item-creation-popup').modal()" >Ajouter</a></div>   

					<div class="form-library" ui:sortable="sortableOptions" ng:model="formFieldsSamples">
						<div class="item" ng-repeat="formField in formFieldsSamples">
							<div class="form-field" ng-class="formField.field_type">
								{{formField.display_name}}
							</div>
						</div>	
					</div>

				    <div class="form-preview" ng-if="formFields.length > 0" ui:sortable="sortableOptions" ng:model="formFields" >
				    	<div class="item row" ng-repeat="formField in formFields | orderBy:'weight'">
				    		<div ng-class="formField.field_type != 'help_text' ? 'col-sm-4' : 'col-sm-11'" class="form-field-label">{{formField.display_name}}</div>
				    		<div ng-if="formField.field_type != 'help_text'" class="col-sm-7">
				    			<div class="form-field" ng-class="formField.field_type">{{formField.placeholder}}</div>
				    		</div>
				    		<div class="col-sm-1">
				    			<button ng-click="switchEditMode(formField)">
				          			<i class="fa fa-pencil circle-icon"></i>
				          			</button>
				          		<div class="pull-right reorder">
				          			<button ng-hide="$index == 0" ng-click="reorder(formField, 'minus')">
					          			<i class="fa fa-angle-up"></i>
					          		</button>
					          		<button ng-hide="$index == formField.length-1" ng-click="reorder(formField, 'plus')">
					          			<i class="fa fa-angle-down"></i>
					          		</button>
				          		</div>
				    		</div>
				    	</div>
				    </div>		

			    