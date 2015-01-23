
<div class="container">
	<div class="row">
		<div class="col-md-6">
			<h1>Inscription</h1>
			<form id="register-step1" method="POST">
				<div class="alert alert-danger hidden"></div>
				<div class="form-group">
					<label for="exampleInputEmail1">Nom d'utilisateur *</label>
			    	<?php print_model_input($this, 'text', 'user_accounts', 'username', 'item', 'editForm') ?>
				</div>
				<div class="form-group">
					<label for="exampleInputEmail1">Email address *</label>
			    	<?php print_model_input($this, 'text', 'user_accounts', 'email', 'item', 'editForm') ?>
				</div>
				<div class="form-group">
					<label for="exampleInputEmail1">Mot de passe *</label>
			    	<?php print_model_input($this, 'text', 'user_accounts', 'pwd', 'item', 'editForm') ?>
				</div>
				<div class="form-group">
					<label for="exampleInputEmail1">Type de compte *	</label>
			    	<select name="userGroup" id="">
			    		<?php foreach ($groupsList as $group): ?>
			    			<option value="<?=$group['id']?>"><?=$group['ugrp_name']?></option>
			    		<?php endforeach; ?>
			    	</select>
				</div>
				<button class="btn btn-success">Créer un compte</button>
			</form>
		</div>
	</div>
</div>

<script>
	jQuery(document).ready(function()
	{
		var $form = $('#register-step1');
		$form.submit(function(event) {
			event.preventDefault();
			var $_this = $(this),
				formData  = $_this.serialize();

			$.ajax({
				method: 'POST',
				url: "<?= site_url('accounts/register-profile') ?>",
				data : formData
			}).error(function(data)
			{
				console.log(data.responseTex);
				$_this.find('.alert').html(data.responseText).removeClass('hidden');
			})
			.success(function(data)
			{
				PeaksMaster.$page.html(data);
			});
		});
	})
</script>