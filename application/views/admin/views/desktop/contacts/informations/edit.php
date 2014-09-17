<div id="viewTools">
	      		{{alert}}
</div>


<div>
	<h1>Informations de contact</h1>
	<hr>

	<div class="row">
		<?php //include('./menu.php'); ?>

		<div class="col-sm-12">
	      <div>
			         <form name="contacCreation" ng-hide="editMode">
			         	<h4>Ajout rapide</h4>
				         <div class="row-fluid">
				         	<div class="col-sm-6">
				         		<label>Nom</label>
				         		<?php print_input($self, 'text', 'contact_infos', 'name', 'newContactInfo', 'contacCreation') ?>
				         		<label>Icone</label>
				         		<?php print_input($self, 'text', 'contact_infos', 'icon', 'newContactInfo', 'contacCreation') ?>
				         	</div>
				         	<div class="col-sm-6">
				         		<label>Valeur</label>
				         		<?php print_input($self, 'text', 'contact_infos', 'value', 'newContactInfo', 'contacCreation') ?>
				         		<label>Url</label>
				         		<?php print_input($self, 'text', 'contact_infos', 'target', 'newContactInfo', 'contacCreation') ?>
				         	</div>
				         </div>
				         <br>
				         <button ng-disabled="contacCreation.$invalid" class="btn btn-primary" ng-click="addContactInfo()" >Ajouter</button>	
			         </form>
			         <form name="contacEdit" ng-show="editMode">
			         	<h4>Modification</h4>
				         <div class="row-fluid">
				         	<div class="col-sm-6">
				         		<label>Nom</label>
				         		<?php print_input($self, 'text', 'contact_infos', 'name', 'editedItem', 'contacEdit') ?>
				         		<label>Icone</label>
				         		<?php print_input($self, 'text', 'contact_infos', 'icon', 'editedItem', 'contacEdit') ?>
				         	</div>
				         	<div class="col-sm-6">
				         		<label>Valeur</label>
				         		<?php print_input($self, 'text', 'contact_infos', 'value', 'editedItem', 'contacEdit') ?>
				         		<label>Url</label>
				         		<?php print_input($self, 'text', 'contact_infos', 'target', 'editedItem', 'contacEdit') ?>
				         	</div>
				         </div>
				         <br>
				         <button ng-disabled="contacEdit.$invalid" ng-click="updateContactInfo()" class="btn btn-primary" >Enregistrer</button>	
				         <button ng-click="deleteContactInfo()" class="btn btn-danger" >Supprimer</button>	
				         <button ng-click="editMode = false" class="btn" >Annuler</button>
			         </form>
			         
				     <br>
				     <br>     		
				          	
			         <table class="table table-bordered table-striped table-hover">
			          	<thead>
			          		<th ng-click="orderProp = 'id'; reverse=!reverse">Id</th>
			          		<th>Nom</th>
			          		<th>Valeur</th>
			          		<th>Url</th>
			          		<th>Icone</th>
			          		<th width="76px">
			          		
			          		</th>
			          	</thead>
			          	<tbody>

			          		<tr ng-repeat="contactItem in contactItems | orderBy:'weight'">
			          			<td>#{{contactItem.weight}}</td>
						         <td>{{contactItem.name}}</td>
						         <td>{{contactItem.value}}</td>
						         <td>{{contactItem.target}}</td>
						         <td><i class="{{contactItem.icon}}"></i></td>
						         <td>
						         	<button ng-click="switchEditMode(contactItem)">
				          				<i class="fa fa-pencil circle-icon"></i>
				          			</button>
				          			<div class="pull-right reorder">
				          				<button ng-hide="$index == 0" ng-click="reorder(contactItem, 'minus')">
					          				<i class="fa fa-angle-up"></i>
					          			</button>
					          			<button ng-hide="$index == contactItems.length-1" ng-click="reorder(contactItem, 'plus')">
					          				<i class="fa fa-angle-down"></i>
					          			</button>
				          			</div>
						         </td>
				          	</tr>
				   
			          	</tbody>
			         </table>
	      	
	      </div>
		</div>
	</div>
</div>