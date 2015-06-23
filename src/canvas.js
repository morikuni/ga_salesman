var Canvas = Class.Create({
	property : {
		context : null,
		pointSize : 5,
		width : 0,
		height : 0
	},
	
	/**
	 * @param {String} canvasID
	 */
	init : function(canvasID){
		var c = document.getElementById(canvasID);
		this.width = c.width;
		this.height = c.height;
		this.context = c.getContext('2d');
	},
	
	/**
	 * @param {Point} point
	 */
	drawPoint : function(point){
		var c = this.context;
		var size = this.pointSize;
		c.beginPath();
		c.rect(point.x-(size/2), point.y-(size/2), size, size);
		c.closePath();
		c.fill();
	},
	
	/**
	 * @param {Point} start
	 * @param {Point} end
	 */
	drawLine : function(start, end){
		var c = this.context;
		c.beginPath();
		c.moveTo(start.x, start.y);
		c.lineTo(end.x, end.y);
		c.closePath()
		c.stroke();
	},
	
	/**
	 * @param {Salesman} salesman
	 * @param {Array<City>} destinations
	 */
	drawRouteOfSalesman : function(salesman, destinations){
		ids = salesman.destIDs;
		for(var i=0; i<ids.length-1; i++){
			this.drawLine(destinations[ids[i]], destinations[ids[i+1]]);
		}
	},
	
	/**
	 * @param {Array<City>} destinations
	 */
	drawDestinations : function(destinations){
		for(var i=0; i<destinations.length; i++){
			this.drawPoint(destinations[i]);
		}
	},
	
	clear : function(){
		this.context.clearRect(0, 0, this.width, this.height);
	}
	
});