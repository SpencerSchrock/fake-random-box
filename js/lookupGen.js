var fs = require('fs');
var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

requirejs(['app/point', 'app/pointCollection'], function(Point, PointCollection) {
	function genRandPointCollection(size) {
		coll = new PointCollection();
		for (var i = 0; i < size; i++) {
			coll.insert(genRandPoint());
		}
		return coll;
	}

	function genRandPoint() {
		return new Point(Math.random(), Math.random());
	}

	fs.writeFile("app/table.js", "define(function() {\n\
	return function(key, value) {\n\
		table = {\n", function(err) {
	    if(err) {
	        return console.log(err);
	    }
	});

    data = {}

	// genRandPointColl of 20
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
		dataTruncated = [];
		for (var i = 0; i < 10000; i += 10) {
			dataTruncated.push(data[key][i]);
		}
		fs.appendFile("app/table.js", "\"" + key + "\" : [" + dataTruncated + "],\n");
		dataTruncated = [];
	}

	fs.appendFile("app/table.js", "};\n\
		for (var i = 0; i < table[key].length; i++) {\n\
			if (table[key][i] > value) {\n\
				return i / table[key].length;\n\
			}\n\
		}\n\
		return 1;\n\
	}\n\
});\n");
});