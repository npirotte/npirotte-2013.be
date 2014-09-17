<div id="viewTools">
<button data-role="submit" class="btn btn-primary" ng-click="save()" >Enregistrer<i class="icon-ok-sign"></i></button>
	      		<a data-role="cancel" class="btn" href="#/manager/comptes">Annuler<i class="icon-remove-sign"></i></a>
	      		<button data-role="delete" class="btn btn-danger" ng-click="delete()">Supprimer<i class="icon-trash"></i></button>
		      	{{alert}}
</div>


<div>
	<h1>Compte : {{item.user_id}}</h1>
	<hr>

	<div class="row">
		<?php //include('../menu.php'); ?>

		

			<form class="form form-horizontal">
				<div class="span6">
				<h4>Informations complémentaires</h4>
				<hr>
		      	<input type="hidden" id="inputOldName" name="oldname" value="{{item.old_id}}">
				<div class="control-group">
					<label class="control-label" for"inputName">Identifiant</label>
					<div class="controls">
						<input data-required="true" data-length="20" type="text" id="inputName" name="name" ng-model="item.user_id">
					</div>

				</div>
				<div class="control-group">
					<label class="control-label" for"inputPwd">Mot de passe</label>
					<div class="controls">
						<input data-required="true" type="password" id="inputPwd" name="pwd">
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for"inputNewPwd">Nouveau mot de passe</label>
					<div class="controls">
						<input ng-model="item.pwd1" data-format="new_password" type="password" id="inputNewPwd" name="newpwd">
					</div>
				</div>
					<div class="control-group">
					<label class="control-label" for"inputPwdcheck">Répétez</label>
					<div class="controls">
						<input ng-model="item.pwd2" type="password" id="inputPwdcheck" name="pwdcheck">
					</div>
				</div>
				<div class="control-group">
					<label class="control-label" for"inputEmail">Email</label>
					<div class="controls">
						<input data-required="true" data-format="email" type="email" id="inputEmail" name="email" ng-model="item.mail">
						<div class="errors">
							<div data-alert="required" class="alert alert-error hide">
								<button type="button" class="close" data-dismiss="alert">&times;</button>
												  Ce champ est requis !
							</div>
							<div data-alert="format" class="alert alert-error hide">
								<button type="button" class="close" data-dismiss="alert">&times;</button>
												  Ce champ doit être un email (nom@domaine.com)
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="span6">
				<h4>Informations complémentaires</h4>
				<hr>
				<div class="control-group">
					<label for="inputFirstName" class="control-label">Nom</label>
					<div class="controls">
						<input id="inputFirstName" type="text" ng-model="item.first_name" data-length="20" name="first-name">
					</div>
				</div>
				<div class="control-group">
					<label for="inputLastName" class="control-label">Prénom</label>
					<div class="controls">
						<input id="inputLastName" type="text" ng-model="item.last_name" data-length="20" name="last-name">
					</div>
				</div>
			</div>
		</form>