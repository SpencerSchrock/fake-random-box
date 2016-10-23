define(function() {
	console.log("Added CollectionStats!");

	return function() {
		this.minX = 1;
		this.minY = 1;
		this.maxX = 0;
		this.maxY = 0;
	}
});