requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});

requirejs(['app/point', 'app/pointCollection', 'app/table', 'js/node_modules/canvasjs/dist/canvasjs.js'], function(Point, PointCollection, normalize, CanvasJS) {

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

	

	function drawScoreChart() {
		var dataPoints = [];

		var xValue = 10;
		for (key in pointCollection.stats) {
			dataPoints.push({ x : xValue, y : 2 * Math.abs(normalize(key, pointCollection.stats[key]) - 0.5) * 100, label : key });
			xValue += 10;
		}

		var chart = new CanvasJS.Chart("chartContainer",
		{
		title:{
			text: "Score"
		},

		data: [
			{
				type: "bar",
				dataPoints: dataPoints
			}
		]
	});

	chart.render();
	}

	function manualInsert(event) {
		point = new Point(event, canvas, true);
		addPoint(point);

		if (numPoints == pointLimit) {
				complete();
		}
	}

	function complete() {
		canvas.removeEventListener('click', manualInsert);
		btnRandomGen.removeEventListener('click', randomFill);
		btnRandomGen.disabled = true;
		pointCollection.writeStatsNormalized(divStats);
		drawScoreChart();
	}

	function randomFill() {
		canvas.removeEventListener('click', manualInsert);
		randomGenInterval = setInterval(addRandPoint, 200);
	}

	function addPoint(point) {
		pointCollection.insert(point, divStats);
		ctx.fillRect(canvas.width * point.x, canvas.height * point.y, 2.5, 2.5);
		numPoints++;
		spanNumPoints.innerHTML = "Input " + (pointLimit - numPoints) + " points";
	}

	function addRandPoint() {
		point = new Point(Math.random(), Math.random(), false);

		addPoint(point);
		pointsGenerated++;

		if (pointsGenerated == fillAmount || numPoints == pointLimit) {
			clearInterval(randomGenInterval);
			pointsGenerated = 0;
			canvas.addEventListener('click', manualInsert);

			if (numPoints == pointLimit) {
				complete();
			}
		}
	}

	function clear() {
		pointCollection = new PointCollection();
		divStats.innerHTML = "";
		divStatsNormalized.innerHTML = "";
		numPoints = 0;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		clearInterval(randomGenInterval);
		spanNumPoints.innerHTML = "Input " + pointLimit + " points";
		canvas.addEventListener('click', manualInsert, false);
		btnRandomGen.addEventListener('click', randomFill, false);
		console.log("Delete points\n");

		btnRandomGen.disabled = false;
	}
});
