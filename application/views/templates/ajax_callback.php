<script>
	(function()
	{
		/*titre*/
		document.title = "<?=$title?>";
		/*body class*/
		var body = document.querySelectorAll('body');
		body[0].className = "<?=$bodyclass?>";
	}).call(this);
</script>