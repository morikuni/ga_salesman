/*
遺伝的アルゴリズム
ランキング選択方式
順序交叉
突然変異は遺伝子のランダムな2点間の都市の順番を逆にする(逆位)
親は次世代にそのまま引き継がれる
*/

window.onload = function(){
	
	
	makeCity();
	
	calculate();
	
	
	
}

var makeCity = function(){
	var canvas = new Canvas('canvas');
	var df = new DestinationsFactory();
	df.maxX = df.maxY = 500;
	
	Data.CityNum = parseInt((document.getElementById('cityNum')).value);
	
	canvas.clear();
	Data.Destinations = df.create(Data.CityNum);
	canvas.drawDestinations(Data.Destinations);
}

var calculate = function(){
	var canvas = new Canvas('canvas');
	var No1OfGenerations = [];
	
	Data.SalesmanNum = parseInt((document.getElementById('salesmanNum')).value);
	Data.GenerationNum = parseInt((document.getElementById('generationNum')).value);
	Data.MutationProb = parseInt((document.getElementById('mutationProb')).value)/100;
	
	canvas.clear();
	canvas.drawDestinations(Data.Destinations);
	var g = new Generation(makeInitialGeneration(Data.SalesmanNum));
	g.sort();
	No1OfGenerations.push(g.no1);
	console.log('initial',g.no1.solveDist(Data.Destinations));
	canvas.drawRouteOfSalesman(g.no1, Data.Destinations);
	for(var i=0; i<Data.GenerationNum; i++){
		g = g.makeChildren();
		g.sort();
		No1OfGenerations.push(g.no1);
	}
	console.log('final',g.no1.solveDist(Data.Destinations));
	
	var slider = document.getElementById('slider');
	var generation = document.getElementById('generation');
	var distance = document.getElementById('distance');
	distance.innerHTML = No1OfGenerations[0].sumOfDist.toPrecision(7);
	generation.innerHTML = 0;
	slider.max = Data.GenerationNum;
	slider.value = 0;
	slider.step = 1;
	slider.onchange = function(){
		generation.innerHTML = slider.value;
		distance.innerHTML = No1OfGenerations[slider.value].sumOfDist.toPrecision(7);
		canvas.clear();
		canvas.drawDestinations(Data.Destinations);
		canvas.drawRouteOfSalesman(No1OfGenerations[slider.value], Data.Destinations);
	}
	var inc = document.getElementById('increment');
	var dec = document.getElementById('decrement');
	inc.onclick = function(){
		slider.value = parseInt(slider.value) + 1;
		slider.onchange();
	}
	dec.onclick  =function(){
		slider.value = parseInt(slider.value) - 1;
		slider.onchange();
	}
	
}

var makeInitialGeneration = function(parentNum){
	var salesmans = [];
	for(var i=0; i<parentNum; i++){
		var idList = [];
		for(var j=0; j<Data.CityNum; j++){
			idList[j] = j;
		}
		for(var j=0; j<Data.CityNum-1; j++){
			var max = Data.CityNum - j;
			var index = parseInt(Math.random() * max) + j;
			var tmp = idList[j];
			idList[j] = idList[index];
			idList[index] = tmp;
		}
		salesmans[i] = new Salesman(idList);
	}
	return salesmans;
}

var Generation = Class.Create({
	property : {
		parents : [],
		crossStart : 0,
		crossEnd : 0,
		mutationProb : Data.MutationProb,
		no1 : null
	},
	
	/**
	 * @param {Array<Salesman>} parents
	 */
	init : function(parents){
		this.parents = parents;
		this.crossStart = parseInt(Math.random() * (Data.CityNum/2));
		this.crossEnd = this.crossStart + 10;
	},
	
	makeChildren : function(){
		var selected = this.select();
		
		var children = [];
		for(var i=0; i<selected.length; i++){
			for(var j=0; j<selected.length; j++){
				children.push(this.cross(selected[i], selected[j]));
			}
		}
		
		children = this.mutation(children);
		
		return new Generation(children);
	},

	/**
	 * @return {Array<Salesman>}
	 */
	select : function(){
		this.sort();
		
		var selected = this.parents.slice(0, Math.sqrt(Data.SalesmanNum));
		return selected;
	},
	
	/**
	 * @param {Salesman} parent1
	 * @param {Salesman} parent2
	 * @return {Salesman}
	 */
	cross : function(parent1, parent2){
		var idList = [];
		for(var i=this.crossStart; i<=this.crossEnd; i++){	//１点交叉
			idList.push(parent1.destIDs[i]);
		}
		var remainIDList = [];
		for(var i=this.crossEnd+1; i!=this.crossEnd; i++){	//順序交叉のための配列作り
			if(i >= parent2.destIDs.length){ i = 0; };
			remainIDList.push(parent2.destIDs[i]);
		}
		remainIDList.push(parent2.destIDs[i]);	//上のfor分ではlength-1個しかコピーされないので最後の１個を追加
		
		for(var i=0; i<idList.length; i++){
			for(var j=0; j<remainIDList.length; j++){
				if(idList[i] == remainIDList[j]){
					remainIDList.splice(j, 1);
					break;
				}
			}
		}
		
		var cutIndex = Data.CityNum - 1 - this.crossEnd;
		var remainBehind = remainIDList.slice(0, cutIndex);
		var remainFront = remainIDList.slice(cutIndex);
		
		idList = remainFront.concat(idList);
		idList = idList.concat(remainBehind);
		
		return new Salesman(idList);
	},
	
	/**
	 * @param {Array<Salesman>} parents
	 * @return {Array<Salesman>}
	 */
	mutation : function(children){
		for(var i=0; i<children.length; i++){
			if(Math.random()*1 < this.mutationProb){
				var start = Math.min(parseInt(Math.random() * Data.CityNum), Data.CityNum-3);
				var end  = Math.min(Math.max(parseInt(Math.random() * (Data.CityNum-start))+start, start+2), Data.CityNum-1);
				var front = children[i].destIDs.slice(0, start);
				var middle = children[i].destIDs.slice(start, end);
				var behind = children[i].destIDs.slice(end);
				middle.reverse();
				var ids = front.concat(middle);
				ids = ids.concat(behind);
				children[i].destIDs = ids;
			}
		}
		return children;
	},
	
	sort : function(){
		for(var i=0; i<this.parents.length; i++){
			this.parents[i].solveDist(Data.Destinations);
		}
		this.parents.sort(function(a, b){return a.sumOfDist - b.sumOfDist});
		this.no1 = this.parents[0];
	}
	
});