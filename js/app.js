requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});

requirejs(['app/point', 'app/pointcollection'], function(Point, PointCollection) {
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var btnRandomGen = document.getElementById("btnRandomGen");
	var btnClear = document.getElementById("btnClear");
	var num = 20;
	btnRandomGen.innerHTML = "Generate " + num + " points";
	var divStats = document.getElementById("divStats");
	var divStatsNormalized = document.getElementById("divStatsNormalized");
	var randomGenInterval;

	var pointCollection = new PointCollection();
	var points = 0;

	canvas.addEventListener('click', drawPoint, false);
	btnRandomGen.addEventListener('click', randomFill, false);
	btnClear.addEventListener('click', clear, false);

	// http://stackoverflow.com/a/18053642
	// I will probably add a plain addpoint(x, y) for drawpoint and drawRandPoint.
	function addPoint(x, y) {
		pointCollection.insert(new Point(x, y, false), divStats);
		ctx.fillRect(canvas.width*x, canvas.height*y, 5, 5);

		points++;
	}

	function drawPoint(event) {
		var rect = canvas.getBoundingClientRect();
		var x = (event.clientX - rect.left)/300;
		var y = (event.clientY - rect.top)/300;
		addPoint(x, y);
		btnRandomGen.disabled = true;

		if (points == num) {
			canvas.removeEventListener('click', drawPoint);

		}

		//console.log("Add point at " + x + ", " + y + "\n");
	}

	function addRandPoint() {
		var x = Math.random();
		var y = Math.random();

		addPoint(x, y);

		if (randomGenInterval && points == num) {
			clearInterval(randomGenInterval);
		}

		//console.log("Add point at " + x + ", " + y + "\n");
	}

	function randomFill() {
		randomGenInterval = setInterval(addRandPoint, 200);

		btnRandomGen.disabled = true;
		canvas.removeEventListener('click', drawPoint);
	}

	function clear() {
		pointCollection = new PointCollection();
		divStats.innerHTML = "";
		points = 0;

		canvas.addEventListener('click', drawPoint, false);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		console.log("Delete points\n");

		btnRandomGen.disabled = false;
	}
});
