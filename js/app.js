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
	var spanNumPoints = document.getElementById("spanNumPoints");

	var pointLimit = 20;
	var numPoints = 0;
	var fillAmount = pointLimit;

	btnRandomGen.innerHTML = "Generate " + fillAmount + " points";

	var randomGenInterval;
	var pointsGenerated = 0;

	var pointCollection = new PointCollection();

	canvas.addEventListener('click', manualInsert, false);
	btnRandomGen.addEventListener('click', randomFill, false);
	btnClear.addEventListener('click', clear, false);

	function manualInsert(event) {
		point = new Point(event, canvas, true);
		addPoint(point);

		if (numPoints == pointLimit) {
				canvas.removeEventListener('click', manualInsert);
				btnRandomGen.removeEventListener('click', randomFill);

				btnRandomGen.disabled = true;
		}
	}

	function randomFill() {
		randomGenInterval = setInterval(addRandPoint, 200);
	}

	function addPoint(point) {
		pointCollection.insert(point, divStats);
		ctx.fillRect(canvas.width * point.x, canvas.height * point.y, 2.5, 2.5);
		numPoints++;
	}

	function addRandPoint() {
		point = new Point(Math.random(), Math.random(), false);

		addPoint(point);
		pointsGenerated++;

		if (pointsGenerated == fillAmount || numPoints == pointLimit) {
			clearInterval(randomGenInterval);
			pointsGenerated = 0;

			if (numPoints == pointLimit) {
				canvas.removeEventListener('click', manualInsert);
				btnRandomGen.removeEventListener('click', randomFill);
				btnRandomGen.disabled = true;
			}
		}
	}

	function clear() {
		pointCollection = new PointCollection();
		divStats.innerHTML = "";
		numPoints = 0;
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		canvas.addEventListener('click', manualInsert, false);
		btnRandomGen.addEventListener('click', randomFill, false);
		console.log("Delete points\n");

		btnRandomGen.disabled = false;
	}
});
