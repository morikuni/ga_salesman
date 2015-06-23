var Point = Class.Create({
	property : {
		x : 0,
		y : 0
	},
	
	set : function(x, y){
		this.x = x;
		this.y = y;
	}
});

var City = Class.Create({
	property : {
		id : null
	},
	
	init : function(id){
		this.id = id;
	}
	
}).Extends(Point);

var DestinationsFactory = Class.Create({
	property : {
		maxX : 0,
		maxY : 0
	},
	
	/**
	 * @param {Number} numOfDest 生成する目的地の数
	 */
	create : function(numOfDest){
		if(this.maxX < numOfDest){
			this.maxX = numOfDest;
		}
		if(this.maxY < numOfDest){
			this.macY = numOfDest;
		}
		
		var xList = [];
		var yList = [];	
		for(var i=0; i<numOfDest; i++){
			while(j != i){
				var rand = parseInt(Math.random()*this.maxX);
				for(var j=0; j<i; j++){
					if(xList[j] == rand){
						break;
					}
				}
			}
			xList[i] = rand;
		}
		for(var i=0; i<numOfDest; i++){
			while(j != i){
				var rand = parseInt(Math.random()*this.maxY);
				for(var j=0; j<i; j++){
					if(yList[j] == rand){
						break;
					}
				}
			}
			yList[i] = rand;
		}
		
		var destinations = [];
		var count = 0;
		for(var i=0; i<numOfDest; i++){
			destinations.push(new City(count));
			destinations[i].set(xList[i], yList[i]);
			count++;
		}
		
		return destinations;
	}
});


var Salesman = Class.Create({
	property : {
		destIDs : [],
		sumOfDist : 0
	},
	
	/**
	 * @param {Array<Number>} destinatinIDList Cityのidの配列
	 */
	init : function(destinationIDList){
		this.destIDs = destinationIDList;
	},
	
	/**
	 * @param {Array<City>} destinationsList Cityのidをインデックスとした配列
	 */
	solveDist : function(destinationsList){
		this.sumOfDist = 0;
		for(var i=0; i<this.destIDs.length-1; i++){
			var point1 = destinationsList[this.destIDs[i]];
			var point2 = destinationsList[this.destIDs[i+1]];
			this.sumOfDist += Salesman.getDistOfPointToPoint(point1, point2);
		}
		return this.sumOfDist;
	}
});
/**
 * @static
 * @param {Point} point1
 * @param {Point} point2
 */
Salesman.getDistOfPointToPoint = function(point1, point2){
	var x = point1.x - point2.x;
	var y = point1.y - point2.y;
	return Math.sqrt(x*x + y*y);
}


