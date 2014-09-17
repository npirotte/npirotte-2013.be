<script type="text/javascript" src="./application/front/default/js/paper-full.min.js"></script>


<canvas id="mon_canvas" resize> 
  Texte alternatif pour les navigateurs ne supportant pas Canvas.
</canvas>


<script type="text/paperscript" canvas="mon_canvas">
	tool.minDistance = 4;
	tool.maxDistance = 45;

	var path;

	function onMouseDown(event) {
		path = new Path();
		path.fillColor = {
			hue: Math.random() * 360,
			saturation: 1,
			brightness: 1
		};
		path.add(event.point);
	}

	function onMouseDrag(event) {
		var step = event.delta;
		step.angle += 90;

		var top = event.middlePoint + step;
		var bottom = event.middlePoint - step;
		
		
		path.add(top);
		path.insert(0, bottom);

		path.smooth();
	}	

	function onMouseUp(event) {
		var delta = event.point - lastPoint;
		delta.length = tool.maxDistance;
		addStrokes(event.point, delta);
		path.closed = true;
		path.smooth();
	}

	function addStrokes(point, delta) {
		var step = delta.rotate(90);
		var strokePoints = strokeEnds * 2 + 1;
		point -= step / 2;
		step /= strokePoints - 1;
		for(var i = 0; i < strokePoints; i++) {
			var strokePoint = point + step * i;
			var offset = delta * (Math.random() * 0.3 + 0.1);
			if(i % 2) {
				offset *= -1;
			}
			strokePoint += offset;
			path.insert(0, strokePoint);
		}
	}
</script>