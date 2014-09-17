<div id="viewTools">
<a href="#/contacts/messages" class="btn">Liste<i class="icon-reorder"></i></a>
</div>

<div>
	<h1>Message</h1>
	<hr>

	<div class="row">
		<?php //include('./menu.php'); ?>

		<div class="span12">
			<a href="mailto:{{item.sender}}" class="btn btn-primary">Répondre</a>
			<hr>
			<p><strong>De :</strong> {{item.sender}}</p>
			<p><small><strong>Envoyé le :</strong> {{item.date}}</small></p>
			<hr>
			<p>
				<strong>Message :</strong>
			</p>
			<p>{{item.content}}</p>
		</div>
	</div>
</div>