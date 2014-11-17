<br>

<div id="hello">
	<h1>Bienvenue dans votre administration !</h1>
</div>

<br>

<div class="row">
	<div class="col-lg-3">
		<div id="clock" class="well">
			<div class="date">
				{{clock.day}} {{clock.date}} {{clock.month}} {{clock.year}}
			</div>
			<div class="clock">
				<span>{{clock.hours}}</span>&nbsp;:&nbsp;<span>{{clock.minutes}}</span> <span class="seconds">{{clock.seconds}}</span>
			</div>
		</div>
	</div>
		
	<!-- <div id="visit-counter" class="col-lg-1 col-md-6 dashboard-counter">
		<div class="padding">
			<span class="number">
				{{visitsNbr}}
			</span><br>
			<small>Visites aujourd'hui</small>
		</div>
	</div> -->
	<a href="#/contacts/messages" id="messages-counter" class="col-lg-1 col-md-6 dashboard-counter">
		<div class="padding">
			<div unread-messages-nbr></div>
		</div>
	</a>
	<div class="col-lg-4 col-sm-12">
		<div serve-usage ></div>
	</div>
</div>

<div id="last-message" class="row dashboard-list">
	<div class="col-lg-4" last-messages></div>
	<div class="col-lg-4">
		<!-- <h3>News en attente :</h3> -->
	</div>
</div>

<br>


<!-- <br /> -->
<!-- <h3>Données Analitics</h3>
<div class="row-fluid">
	<div class="col-sm-12">
		<div id="visitsNbr" style="min-height: 80px"></div>		
	</div>
</div>
<br>
<div class="row-fluid">
	<div class="col-sm-12">
		<div id="visitsTime" style="min-height: 80px"></div>		
	</div>
</div> -->



