<div id="hello">
	<h1>Bienvenue dans votre administration !</h1>
</div>

<br>
<div class="well">
	<div class="row-fluid">
		<div class="span3">
			<a href="#/contacts/messages">
				<div class="well">
					<span ng-show="messagesNbr > 0">
						Vous avez <strong>{{messagesNbr}} </strong> nouveau<span ng-hide="messagesNbr == 1">x</span> message<span ng-hide="messagesNbr == 1">s</span> !
					</span>
					<span ng-show="messagesNbr == 0">
						Vous n'avez aucun nouveau message
					</span>
				</div>
			</a>
		</div>
		<div class="span9">
			<a href="#/contacts/messages/{{last_message.id}}">
				<div class="well">
					<div class="row-fluid">
						<div class="span3">
							<strong>Dernier message :</strong>
						</div>
						<div class="span9">
							<p>{{last_message.sender}}</p>
							<p>{{last_message.content}}</p>
						</div>
					</div>
				</div>
			</a>
		</div>
	</div>
</div>



