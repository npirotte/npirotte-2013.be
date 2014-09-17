<h2>1 - Configuration du site</h2>
<br /> 

<form required name="database">
	<div class="form-group">
		<label class="control-label col-sm-4">Nom du site</label>
		<div class="col-sm-4">
			<input type="text" ng-model="data.configData.sitename">
		</div>
	</div>

	<hr />

	
	<div class="form-group">
		<label class="control-label col-sm-4">Hostname</label>
		<div class="col-sm-4">
			<input type="text" name="hostname" ng-model="data.dbData.hostname" required />
		</div>
	</div>
	<div class="form-group">
		<label class="control-label col-sm-4">Nom de la base de donnée</label>
		<div class="col-sm-4">
			<input type="text" name="database" ng-model="data.dbData.databaseName" required />
		</div>
	</div>

	<div class="form-group">
		<label class="control-label col-sm-4">Utilisateur de la base de donnée</label>
		<div class="col-sm-4">
			<input type="text" name="username" ng-model="data.dbData.username" required />
		</div>
	</div>
	<div class="form-group">
		<label class="control-label col-sm-4">Mot de passe de la base de donnée</label>
		<div class="col-sm-4">
			<input type="text" name="password" ng-model="data.dbData.password">
		</div>
	</div>

	<div class="form-group">
		<label class="control-label col-sm-4">Préfixe de table</label>
		<div class="col-sm-4">
			<input type="text" name="prefix" ng-model="data.dbData.prefix">
		</div>
	</div>

	<div class="text-center">
		<button ng-click="submitData()" class="btn btn-primary btn-lg" ng-disabled="database.$invalid">Générer la base de donnée</button>		
	</div>
	<div class="text-center">
		<div class="message">{{message}} <i ng-show="working" class="fa fa-spin fa-spinner"></i></div>
	</div>

</form>