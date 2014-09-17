<div id="viewTools">
<button data-role="submit" class="btn btn-primary" ng-click="save()" >Enregistrer<i class="icon-ok-sign"></i></button>
	      		<a data-role="cancel" class="btn" href="#/manager/comptes">Annuler<i class="icon-remove-sign"></i></a>
		      	{{alert}}
</div>


<div>
	<h1>Créer un utilisateur</h1>
	<hr>

	<div class="row">
		<?php include('../menu.php'); ?>

		<div class="span9">

			<form class="form form-horizontal">
				<div class="control-group">
					<label class="control-label" for"inputName">Identifiant</label>
					<div class="controls">
						<input data-required="true" data-length="20" type="text" id="inputName" name="name">
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for"inputNewPwd">Mot de passe</label>
					<div class="controls">
						<input data-required="true" data-format="new_password" type="password" id="inputNewPwd" name="newpwd">
					</div>
				</div>
					<div class="control-group">
					<label class="control-label" for"inputPwdcheck">Répétez</label>
					<div class="controls">
						<input data-required="true" type="password" id="inputPwdcheck" name="pwdcheck">
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for"inputEmail">Email</label>
					<div class="controls">
						<input data-required="true" data-format="email" type="email" id="inputEmail" name="email">
					</div>
				</div>
				
			</div>
		</form>