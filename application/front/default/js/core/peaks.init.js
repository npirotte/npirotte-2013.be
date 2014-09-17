var PeaksMaster = new MyPeaks(document);

jQuery(document).ready(function()
{
	console.log(PeaksMaster);
	PeaksMaster.InitPage();
	PeaksMaster.Ajaxify();
});