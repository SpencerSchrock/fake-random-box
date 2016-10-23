requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});

requirejs(['app/point', 'app/pointcollection'], function(Point, PointCollection) {

	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var divStats = document.getElementById("divStats");
	var divStatsNormalized = document.getElementById("divStatsNormalized");
	var btnRandomGen = document.getElementById("btnRandomGen");
	var btnClear = document.getElementById("btnClear");


	var pointLimit = 20;
	var numPoints = 0;
	var fillAmount = pointLimit;

	btnRandomGen.innerHTML = "Generate " + numPoints + " points";


	var randomGenInterval;

	var pointCollection = new PointCollection();

	canvas.addEventListener('click', manualInsert, false);
	btnRandomGen.addEventListener('click', randomFill, false);
	btnClear.addEventListener('click', clear, false);

	function manualInsert(event) {
		point = new Point(event, canvas, true);

		pointCollection.insert(point, divStats);
		ctx.fillRect(canvas.width * point.x, canvas.height * point.y, 2.5, 2.5);

		numPoints++;
	}

	function randomFill() {
		for (var i = 0; i < fillAmount; i++) {
			point = new Point(Math.random(), Math.random(), false);

			pointCollection.insert(point, divStats);
			ctx.fillRect(canvas.width * point.x, canvas.height * point.y, 2.5, 2.5);

			numPoints++;
		}

		if (numPoints == pointLimit) {

		} 
	}

	function clear() {
		pointCollection = new PointCollection();
		divStats.innerHTML = "";
		numPoints = 0;

		canvas.addEventListener('click', drawPoint, false);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		console.log("Delete points\n");

		btnRandomGen.disabled = false;
	}
});
