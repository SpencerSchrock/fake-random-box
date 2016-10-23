requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app'
    }
});

requirejs(['app/point'], function(Point) {
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

	// FUNCTIONs

	console.log(typeof(Point));
	// ranged from 0 to 1

	function PointCollection() {
		// an array to hold the points in order of least-recent to most-recent
		this.points = [];

		this.sortedPointsX = [];
		this.sortedPointsY = [];

		this.gapsX = [];
		this.gapsY = [];

		this.sortedGapsX = [];
		this.sortedGapsY = [];


		this.stats = new CollectionStats();

		this.insert = function(point) {
			this.points.push(point);
			this.sortedPointsX.push(point); // implement binary search
			this.sortedPointsY.push(point); // push ... later

			// can be avoided with binary push
			this.sortedPointsX.sort(function(a, b) {return a.x - b.x});
			this.sortedPointsY.sort(function(a, b) {return a.y - b.y});

			// Very inefficient way of finding gaps
			this.gapsX = [];
			this.gapsY = [];
			this.sortedGapsX = [];
			this.sortedGapsY = [];
			
			for (var i = 1; i < this.sortedPointsX.length; i++) {
				this.gapsX.push(this.sortedPointsX[i].x - this.sortedPointsX[i - 1].x);
				this.gapsY.push(this.sortedPointsY[i].y - this.sortedPointsY[i - 1].y);
				this.sortedGapsX.push(this.gapsX[i - 1]); // binary search insert
				this.sortedGapsY.push(this.gapsY[i - 1]); // ... later
			}

			// this way of keeping gaps sorted is somewhat awful
			this.sortedGapsX.sort();
			this.sortedGapsY.sort();


			this.updateStats(point);
			this.writeStats();
			if (points + 1 == num) {
				this.writeStatsNormalized();
			}
		}

		this.stats["maxDistance"] = 0;
		this.stats["minDistance"] = 1.5;

		this.updateStats = function(point) {
			this.stats.minX = Math.min(this.stats.minX, point.x);
			this.stats.minY = Math.min(this.stats.minY, point.y);
			this.stats.maxX = Math.max(this.stats.maxX, point.x);
			this.stats.maxY = Math.max(this.stats.maxY, point.y);

			this.stats.rangeX = this.stats.maxX - this.stats.minX;
			this.stats.rangeY = this.stats.maxY - this.stats.minY;

			this.stats["E(min X gap)"] = 1/Math.pow(this.points.length, 2);
			this.stats["E(min Y gap)"] = 1/Math.pow(this.points.length, 2);

			this.stats["min(X gap)"] = this.sortedGapsX[0];
			this.stats["min(Y gap)"] = this.sortedGapsY[0];

			this.stats["E(max X gap)"] = Math.log(this.points.length)/this.points.length;
			this.stats["E(max Y gap)"] = Math.log(this.points.length)/this.points.length;

			this.stats["max(X gap)"] = this.sortedGapsX[this.sortedGapsX.length - 1];
			this.stats["max(Y gap)"] = this.sortedGapsY[this.sortedGapsY.length - 1];

			for (var gap = 1; gap < this.points.length - 2; gap++) {
				for (var combo = 0; combo < this.points.length - gap; combo++) {
					var p0 = this.points[combo];
					var p1 = this.points[combo + gap];
					var distance = Math.pow(Math.pow(p0.x-p1.x, 2)+Math.pow(p0.y-p1.y,2),1/2);
					console.log(distance);
					this.stats["minDistance"] = Math.min(distance,this.stats.minDistance);
					this.stats["maxDistance"] = Math.max(distance,this.stats.maxDistance);
				}
			}

		}

		this.writeStats = function() {
			divStats.innerHTML = "";
			for (key in this.stats) {
				divStats.innerHTML += key + " : " + this.stats[key] + "<br />";
			}
		}

		this.writeStatsNormalized = function() {
			divStatsNormalized.innerHTML = "";
			for (key in this.stats) {
				divStatsNormalized.innerHTML += key + " : " + normalize(key, this.stats[key]) + "<br />";
			}
		}
	}

	// an object to contain the results of statistical analysis on a PointCollection.
	function CollectionStats() {
		this.minX = 1;
		this.minY = 1;
		this.maxX = 0;
		this.maxY = 0;
	}

	// http://stackoverflow.com/a/18053642
	// I will probably add a plain addpoint(x, y) for drawpoint and drawRandPoint.
	function addPoint(x, y) {
		pointCollection.insert(new Point(x, y, false));
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
