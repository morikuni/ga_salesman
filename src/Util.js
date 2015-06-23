/**
 * クラスを作成する(Classクラスではない)
 * @class クラスを作成するクラス
 * @param {Object} definition 作成するクラスの定義
 * @return {Function} 作成したクラスのコンストラクタ
 * @constructor
 */
Class = function(definition){
	return Class.Create(definition);
};
/**
 * クラスを作成する(Classクラスではない)
 * @param {Object} definition 作成するクラスの定義
 * @return {Function} 作成したクラスのコンストラクタ
 * @static
 */
Class.Create = function(definition){
	var properties = {};
	var methods = {};
	for(var key in definition){
		if(key === 'property'){
			for(var prop in definition.property){
				properties[prop] = definition.property[prop];
			}
		}else{
			methods[key] = definition[key];
		}
	}
	
	var Constructor = function Class(){
		for(var prop in Constructor.property){
			this[prop] = Constructor.property[prop];
		}
		Constructor.prototype.init.apply(this, arguments);
	}
	Constructor.property = properties;
	Constructor.prototype = methods;
	Constructor.prototype.constructor = Constructor;
	Constructor.prototype.super = function(){};
	if(Constructor.prototype.init == null){
		Constructor.prototype.init = function(){};
	}
	
	return Constructor;
}

Function.prototype.Extends = function(superClass){
	for(var propSuper in superClass.property){
		var subHasProp = false;
		for(var propSub in this.property){
			if(propSuper === propSub){
				subHasProp = true;
				break;
			}
		}
		if(!subHasProp){
			this.property[propSuper] = superClass.property[propSuper];
		}
	}
	this.prototype.__proto__ = superClass.prototype;
	return this;
}

/**
 * クラスに継承関係を持たせる(継承できるのは１つのクラスまで)
 * @param {Function} subClass 継承先のクラスのコンストラクタ
 * @param {Function} superClass 継承元のクラスのコンストラクタ
 * @return {Function} subClassに指定したクラスにsuperClassを継承させたクラスのコンストラクタ
 * @static
 */
Class.Extends = function(subClass, superClass){
	return Function.prototype.Extends.call(subClass, superClass);
}


//var Foo = Class.Create({
//	property : {
//		hoge : null
//	},
//	
//	say : function(){
//		console.log(this.hoge);
//	}
//	
//	
//})
//
//var Hoge = Class.Create({
//	property : {
//		aho : null
//	},
//	
//	init : function(){
//		this.hoge = '123';
//	}
//	
//}).Extends(Foo);
//
//Class.Extends(Hoge, Foo);