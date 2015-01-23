
<div class="container">
	<div class="row">
		<div class="col-md-6">
			<h1>Votre profil</h1>
			<p>Type de compte : <strong><?=$groupName?></strong></p>
			<form method="POST" id="register-step2">
				<?= form_hidden($accountData); ?>
				<div class="form-group">
					<label for="inputFirstName" class="control-label">Nom</label>
					<div>
						<?php print_model_input($this, 'text', 'user_profiles', 'first_name', 'item', 'editForm') ?>
					</div>
				</div>
				<div class="form-group">
					<label for="inputLastName" class="control-label">Prénom</label>
					<div>
						<?php print_model_input($this, 'text', 'user_profiles', 'last_name', 'item', 'editForm') ?>
					</div>
				</div>

				<div class="form-group">
					<label for="inputBithDay" class="control-label">Date de naissance</label>
					<div>
						<input type="text" class="form-control" datepicker-popup="dd-MM-yyyy" ng-model="item.birthdate" is-open="opened" min="minDate" />
					</div>
				</div>          

				<div class="form-group">
					<label class="control-label">Photo</label>
					<div>
						<div image-upload config="uploader" item="item.src" ></div>
					</div>
				</div>
				<button class="btn btn-success">Créer un compte</button>
			</form>
		</div>
	</div>
</div>

<script>
	jQuery(document).ready(function()
	{
		var $form = $('#register-step2');
		$form.submit(function(event) {
			event.preventDefault();
			var $_this = $(this),
				formData  = $_this.serialize();

			$.ajax({
				method: 'POST',
				url: "<?= site_url('accounts/create') ?>",
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