<div id="viewTools">
<button data-role="submit" class="btn btn-primary" ng-click="save()" >Enregistrer<i class="icon-ok-sign"></i></button>

	      		<button data-role="cancel" class="btn btn-danger" ng-click="reset()" >Annuler<i class="icon-remove-sign"></i></button>
	      		{{alert}}
</div>


<div>
	<h1>Configuration</h1>
	<hr>

	<div class="row">
		<?php //include('./menu.php'); ?>

		<div class="span12">
	      <div>
	      	<form name="form" class="form-horizontal">

					<div class="control-group">
						<label class="control-label" for"inputMail">{{items[0].param}}</label>
						<div class="controls">
	    					<input data-required="true" id="inputMail" data-format="email" type="email" name="mail" ng-model="items[0].value"/>
						</div>
			         </div>

			         <h3>Informations de contact</h3>
			         <hr>
			         <div ng-hide="editMode">
			         	<h4>Ajout rapide</h4>
				         <div class="row-fluid">
				         	<div class="span6">
				         		<label>Nom</label>
				         		<input type="text" ng-model="newContactInfo.name" >
				         		<label>Icone</label>
				         		<input type="text" ng-model="newContactInfo.icon" >
				         	</div>
				         	<div class="span6">
				         		<label>Valeur</label>
				         		<input type="text" ng-model="newContactInfo.value" >
				         		<label>Url</label>
					          	<input type="text" ng-model="newContactInfo.target" >
				         	</div>
				         </div>
				         <br>
				         <button class="btn btn-primary" ng-click="addContactInfo()" >Ajouter</button>	
			         </div>
			         <div ng-show="editMode">
			         	<h4>Modification</h4>
				         <div class="row-fluid">
				         	<div class="span6">
				         		<label>Nom</label>
				         		<input type="text" ng-model="editedItem.name" >
				         		<label>Icone</label>
				         		<input type="text" ng-model="editedItem.icon" >
				         	</div>
				         	<div class="span6">
				         		<label>Valeur</label>
				         		<input type="text" ng-model="editedItem.value" >
				         		<label>Url</label>
					          	<input type="text" ng-model="editedItem.target" >
				         	</div>
				         </div>
				         <br>
				         <button ng-click="updateContactInfo()" class="btn btn-primary" >Enregistrer</button>	
				         <button ng-click="deleteContactInfo()" class="btn btn-danger" >Supprimer</button>	
				         <button ng-click="editMode = false" class="btn" >Annuler</button>
			         </div>
			         
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
			          	<tbody ui-sortable ng-model="contactItems">

			          		<tr ng-repeat="contactItem in contactItems | orderBy:'weight'">
			          			<td>#{{contactItem.weight}}</td>
						         <td>{{contactItem.name}}</td>
						         <td>{{contactItem.value}}</td>
						         <td>{{contactItem.target}}</td>
						         <td><i class="{{contactItem.icon}}"></i></td>
						         <td>
						         	<button ng-click="switchEditMode(contactItem)">
				          				<i class="icon-pencil circle-icon"></i>
				          			</button>
				          			<div class="pull-right reorder">
				          				<button ng-hide="$index == 0" ng-click="reorder(contactItem, 'minus')">
					          				<i class="icon-angle-up"></i>
					          			</button>
					          			<button ng-hide="$index == contactItems.length-1" ng-click="reorder(contactItem, 'plus')">
					          				<i class="icon-angle-down"></i>
					          			</button>
				          			</div>
						         </td>
				          	</tr>
				   
			          	</tbody>
			         </table>

			         <div>
    <ul ui-sortable ng-model="contactItems" >
        <li ng:repeat="item in contactItems" class="item">{{item.name}}</li>
    </ul>
    <hr />
    <div ng:repeat="item in list">{{item.name}}</div>
</div>
	      	</form>
	      	
	      </div>
		</div>
	</div>
</div>