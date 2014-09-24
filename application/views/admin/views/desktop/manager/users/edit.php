<div id="viewTools">
	<?php $this->load->view('admin/views/desktop/shared/edit_tools'); ?>
</div>


<div>
	<h1>Compte : {{item.username}}</h1>
	<hr>

	<div error-sumary></div>
	<div ng-if="item.active == 0" activation-message ></div>

	<div class="tabbable" id="edit-tabset" vertical="true">
		<ul class="nav nav-tabs nav-stacked">
			<li ng-class="panes.profile">
	  			<a ng-click="selectPane('panes', 'profile')">
				 <i class="fa fa-user"></i>
				</a>
			</li>
			<li ng-if="item.user_id" ng-class="panes.contact_info">
	  			<a ng-click="selectPane('panes', 'contact_info')">
				 <i class="fa fa-envelope"></i>
				</a>
			</li>
			<li ng-class="panes.config">
	  			<a ng-click="selectPane('panes', 'config')">
				 <i class="fa fa-cog"></i>
				</a>
			</li>
		</ul>

		<div class="tab-content">
			<div class="tab-pane" ng-class="panes.profile">
				<h3>Profil</h3>

				<div class="row">
					<form name="editForm" class="form form-horizontal">
						<div class="col-sm-6">
							<h4>Données d'identification</h4>
							<hr />
							<div class="form-group">
								<label class="control-label col-xs-3" for"inputName">Identifiant</label>
								<div class="col-xs-6">
									<?php print_input($self, 'text', 'user_accounts', 'username', 'item', 'editForm') ?>
								</div>

							</div>
							<div ng-if="item.user_id" class="form-group">
								<label class="control-label col-xs-3" for"inputNewPwd">Changement de mot de passe</label>
								<div class="col-xs-6">
									<input ng-model="item.pwd1" validation="password" type="password" id="inputNewPwd" name="newpwd">
									<div class="label label-important" ng-show="editForm.newpwd.$error.validation">{{inputNewPwd}}</div>
								</div>
							</div>
							<div ng-if="!item.user_id" class="form-group">
								<label class="control-label col-xs-3" for"inputNewPwd">Mot de passe</label>
								<div class="col-xs-6">
									<input ng-model="item.pwd1" data-required="true" validation="password" type="password" id="inputNewPwd" name="newpwd">
								</div>
							</div>
							<div class="form-group" ng-if="item.pwd1">
								<label class="control-label col-xs-3" for"inputPwdcheck">Répétez</label>
								<div class="col-xs-6">
									<input ng-model="item.pwd2" type="password" id="inputPwdcheck" name="pwdcheck">
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-xs-3" for"inputEmail">Email</label>
								<div class="col-xs-6">
									<?php print_input($self, 'text', 'user_accounts', 'email', 'item', 'editForm') ?>
								</div>
							</div>

							<h4>Droits</h4>
							<hr />
							<div class="form-group">
								<label class="control-label col-xs-3" for"inputEmail">Groupe d'utilisateurs</label>
								<div class="col-xs-6">
									<select  ng-model="item.group_fk">
										<option value="{{group.id}}" ng-repeat="group in userGroups">{{group.ugrp_name}}</option>
									</select>
								</div>
							</div>
						</div>
						<div class="col-sm-6" ng-if="item.user_id">
							<h4>Informations complémentaires</h4>
							<hr>
							<div class="form-group">
								<label for="inputFirstName" class="control-label col-xs-3 col-xs-3">Nom</label>
								<div class="col-xs-6">
									<?php print_input($self, 'text', 'user_profiles', 'first_name', 'item', 'editForm') ?>
								</div>
							</div>
							<div class="form-group">
								<label for="inputLastName" class="control-label col-xs-3">Prénom</label>
								<div class="col-xs-6">
									<?php print_input($self, 'text', 'user_profiles', 'last_name', 'item', 'editForm') ?>
								</div>
							</div>

							<div class="form-group">
								<label for="inputBithDay" class="control-label col-xs-3">Date de naissance</label>
								<div class="col-xs-6">
									<input type="text" class="form-control" datepicker-popup="dd-MM-yyyy" ng-model="item.birthdate" is-open="opened" min="minDate" />
								</div>
							</div>          

							<div class="form-group">
								<label class="control-label col-xs-3">Photo</label>
								<div class="col-xs-9">
									<div image-upload config="uploader" item="item.src" ></div>
								</div>
							</div>
						</div>
					</form>
				</div>

				
			</div>

			<div class="tab-pane" ng-class="panes.contact_info" ng-if="item.user_id">
				<div contact-infos item-id="item.user_id" ></div>
			</div>

			<div class="tab-pane" ng-class="panes.config">
				<h3>Configuration</h3>

				<h4>Couleur de l'interface</h4>
				<?php print_input($self, 'text', 'user_accounts', 'custom_ui_admin', 'item', 'editForm') ?>
			</div>
		</div>
	</div>
