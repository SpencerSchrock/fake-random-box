define(['app/collectionstats', 'app/table'], function(CollectionStats, normalize) {
	console.log("Loaded point collection!");

	function PointCollection() {
		// holds points in order the order they were added
		this.points = [];

		this.sortedPointsX = [];
		this.sortedPointsY = [];

		this.gapsX = [];
		this.gapsY = [];

		this.sortedGapsX = [];
		this.sortedGapsY = [];

		this.stats = new CollectionStats();

		this.stats["maxDistance"] = 0;
		this.stats["minDistance"] = 1.5;

		this.insert = function(point, divStats) {
			this.points.push(point);
			this.sortedPointsX.push(point); // implement binary search
			this.sortedPointsY.push(point); // push ... later

			// can be avoided with binary push
			this.sortedPointsX.sort(function(a, b) {return a.x - b.x});
			this.sortedPointsY.sort(function(a, b) {return a.y - b.y});

			// very inefficient way of finding gaps
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

			// keeps gap sorted
			this.sortedGapsX.sort();
			this.sortedGapsY.sort();

			this.updateStats(point);
			this.writeStats(divStats);
		}

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

		this.writeStats = function(divStats) {
			divStats.innerHTML = "";
			for (key in this.stats) {
				divStats.innerHTML += key + " : " + this.stats[key] + "<br />";
			}
		}

		this.writeStatsNormalized = function(divStats) {
			divStatsNormalized.innerHTML = "";
			for (key in this.stats) {
				divStatsNormalized.innerHTML += key + " : " + normalize(key, this.stats[key]) + "<br />";
			}
		}
	}

	return PointCollection;
});