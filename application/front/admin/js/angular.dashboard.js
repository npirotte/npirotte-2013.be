function DashboardMasterListCtrl($scope, $http) {
	menuControl('dashboard');

	console.log('ok');

	function getVisits()
	{
		$http.get('/admin_manager/day_visits').success(function(data) {
			console.log(data);
	      $scope.visitsNbr = parseInt(data);
	    });
	}

	function clockWidget()
	{
		var date = new Date,
			seconds = date.getSeconds(),
			minutes = date.getMinutes(),
			hours = date.getHours();

		date.setDate(date.getDate());

		var monthNames = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre" ]; 
		var dayNames= ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

		$scope.clock = {
			seconds : seconds < 10 ? '0' + seconds : seconds,
			minutes : minutes < 10 ? '0' + minutes : minutes,
			hours : hours,
			day : dayNames[date.getDay()],
			date : date.getDate(),
			month : monthNames[date.getMonth()],
			year : date.getFullYear(),
			transition : 'no-transition'
		}

	    setInterval(function(){
	    	date = new Date;
	    	seconds = date.getSeconds();
			minutes = date.getMinutes();
			hours = date.getHours();

	        $scope.$apply(function() {
	            $scope.clock = {
					seconds : seconds < 10 ? '0' + seconds : seconds,
					minutes : minutes < 10 ? '0' + minutes : minutes,
					hours : hours,
					day : dayNames[date.getDay()],
					date : date.getDate(),
					month : monthNames[date.getMonth()],
					year : date.getFullYear(),
					transition : 'transition'
				}
	        });
	    }, 1000);
	}

	
	setTimeout("init_page()",10);
	getVisits();

	dashboardRefresh = setInterval(function()
	    {
		    	$scope.$apply(function()
		    	{
		    		getVisits();
		    	});
	    }, 10000);

	//getAnalitics();
	clockWidget();

}