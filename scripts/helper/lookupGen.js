var fs = require('fs');

fs.writeFile("./table.js", "table = {\n", function(err) {
    if(err) {
        return console.log(err);
    }
});

data = {}

coll = genRandPointCollection(20);

for (key in coll.stats) {
	data[key] = [coll.stats[key]]
}

for (var i = 0; i < 10000; i++) {
	coll = genRandPointCollection(20);
	for (key in coll.stats) {
		data[key].push(coll.stats[key])
	}
}

for (key in data) {
	data[key].sort()
}
// write
for (key in data) {
	fs.appendFile("./table.js", "\"" + key + "\" : [" + data[key] + "],\n");
}

// STILL NOT CLEAR ON THE WHOLE MODULARIZING THING!!!

function Point(x, y) {
	this.x = x;
	this.y = y;
}

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
				this.stats["minDistance"] = Math.min(distance,this.stats.minDistance);
				this.stats["maxDistance"] = Math.max(distance,this.stats.maxDistance);
			}
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

function genRandPoint() {
	return new Point(Math.random(), Math.random());
}

function genRandPointCollection(size) {
	coll = new PointCollection();
	for (var i = 0; i < size; i++) {
		coll.insert(genRandPoint());
	}
	return coll;
}