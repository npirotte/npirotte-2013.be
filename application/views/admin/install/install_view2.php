<h2>2 - Utilisateur</h2>
<br /> 

<form required name="userdata">
	<div class="form-group">
		<label class="control-label col-sm-4">Identifiant</label>
		<div class="col-sm-4">
			<input type="text" ng-model="data.username" required>
		</div>
	</div>

	<div class="form-group">
		<label class="control-label col-sm-4">Email</label>
		<div class="col-sm-4">
			<input type="email" name="email" ng-model="data.email" ng-maxlength="100" data-required="true" validation="mail" />
			<div class="label label-danger" ng-show="userdata.email.$error.required && userdata.email.$dirty">Ce champ est requis</div>
			<div class="label label-danger" ng-show="userdata.email.$error.validation">Ce champ doit être de type Email</div>
			<div class="label label-danger" ng-show="userdata.email.$error.maxlength">Max. 100 caractères.</div>
		</div>
	</div>

	<div class="form-group">
		<label class="control-label col-sm-4">Mot de passe</label>
		<div class="col-sm-4">
			<input type="password" ng-model="data.pwd1"validation="password" name="pwd1"  data-required="true" />
			<div class="label label-important" ng-show="userdata.pwd1.$error.validation">{{inputPwd1}}</div>
		</div>
	</div>

	<div class="form-group" ng-show="data.pwd1">
		<label class="control-label col-sm-4">Repetez</label>
		<div class="col-sm-4">
			<input type="password" ng-model="data.pwd2" required>
		</div>
	</div>

	<div class="text-center">
		<button ng-click="submitData()" class="btn btn-primary btn-lg" ng-disabled="userdata.$invalid">Créer l'utilisateur</button>		
	</div>

</form>