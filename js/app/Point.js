define(function() {
	console.log("Loaded point!");

	return function(param0, param1, fromCanvas) {
		if (fromCanvas) {
			// http://stackoverflow.com/a/18053642
			// create point from coordinates of canvas
			// on-click event
			// param0 = event
			// param1 = canvas

			var rect = param1.getBoundingClientRect();
			this.x = (param0.clientX - rect.left) / param1.width;
			this.y = (param0.clientY - rect.top) / param1.height;

		} else {
			// create point with given coordinates
			// param0 = x
			// param1 = y

			this.x = param0;
			this.y = param1;
		}
	}
});
