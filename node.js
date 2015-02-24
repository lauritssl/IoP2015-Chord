var util = require('./util');
var peer = require('./peer');

exports.Node = function(ip, port){

	this.predecessor = null;
	this.successor = null;

	this.port = port;
	this.ip = ip;
	this.id = util.hash(this.ip, this.port);

	this.finger = [];
	this.m = 20;

	this.create = function(){
		this.successor = util.peerFromJson( this.toJson() );
		this.predecessor = util.peerFromJson( this.toJson() );

		this.finger[1] = this.successor;

		for (var i = 2; i <= this.m; i++) {
			var tor = ((parseInt(this.id, 16) + Math.pow(2, i - 1)) % Math.pow(2, this.m)).toString(16);
			
			(function(par, i){
				par.find_successor(tor, function(data){
					par.finger[i] = util.peerFromJson(data);
				});
			}(this, i));
		};
	}

	this.join = function(n){

		n = util.peerFromJson(n);

		//Closure to access parent object from nested functions
		(function(par){
			n.find_predecessor(par.id, function(data){
				par.predecessor = util.peerFromJson(data);
				console.log('predecessor: ' + par.predecessor.id);

				par.predecessor.successor(function(data){
				 	par.successor = util.peerFromJson(data);
				 	console.log('successor: ' + par.successor.id);
				 	
				 	par.successor.notify(par.toJson(), function(data){
				 		par.predecessor.notify(par.toJson(), function(data){

				 			par.finger[1] = par.successor;

							for (var i = 2; i <= par.m; i++) {
								var tor = ((parseInt(par.id, 16) + Math.pow(2, i - 1)) % Math.pow(2, par.m)).toString(16);
								
								(function(par, i){
									par.find_successor(tor, function(data){
										par.finger[i] = util.peerFromJson(data);
									});
								}(par, i));
							};

				 			console.log('Join succesfull');
				 		});
				 	});
				});
			});
		
		}(this));
	}

	this.leave = function(){

		//Closure to access parent object from nested functions
		(function(par){
			par.successor.updatePredecessor(par.predecessor, function(data){
				par.predecessor.updateSuccessor(par.successor, function(data){
					//Once both is updated, process can be terminated
					process.kill();
				});
			});
		}(this));
		
	}

	this.find_successor = function(id, callback){

		this.find_predecessor(id, function(n0){
			n0 = util.peerFromJson(n0);

			n0.successor(function(data){
				callback(data);
			});

		});
	}

	this.find_predecessor = function(id, callback){
		if(this.id > id && this.successor.id < id){
			this.successor.find_predecessor(id, function(data){
				callback(data);
			});
			//return this.successor.find_predecessor(id);
		}

		if(this.id > id && this.successor.id >= id){
			if(this.id >= this.successor.id){
				callback( this.toJson() ); //return this
			} else{
				this.successor.find_predecessor(id, function(data){
					callback(data);
				});
				//return this.successor.find_predecessor(id);
			}
		}

		if(this.id < id && this.successor.id >= id){
			callback( this.toJson() ); //return this
		}

		if(this.id < id && this.successor.id < id){
			if(this.id >= this.successor.id){
				callback( this.toJson() ); //return this
			} else{
				this.successor.find_predecessor(id, function(data){
					callback(data);
				});
				//return this.successor.find_predecessor(id);
			}
		}
	}

	this.notify = function(n){

		n = util.peerFromJson(n);

		//Closure to access parent object from nested functions
		(function(par){

			n.predecessor(function(n_predecessor){
				if(par.predecessor == null || util.isBetween(n.id, par.predecessor.id, par.id)){
					par.predecessor = n;
					console.log(par.id+' - p: '+par.predecessor.id);
				}	
			});

		}(this));

			
	}

	this.lookup = function(id, callback){
		if(this.id == id){
			callback(this.toJson());
		}else if(util.isBetween(id, this.id, this.successor.id) || id == this.successor.id){
			callback(this.successor.toJson());
		}else{
			this.closest_preceding_node(id, function(data){
				n0 = util.peerFromJson(data);
				n0.find_successor(id, function(data){
					callback(data);
				});
			});
		}
	}

	this.toJson = function(){
		return {ip: this.ip, port: this.port, id: this.id};
	}

	this.closest_preceding_node = function(id, callback){
		
		found = false;

		for (var i = this.m; i >= 1; i--) {
			if(util.isBetween(this.finger[i].id, this.id, id)){
				found = true;
				callback(this.finger[i].toJson());
			}
		};

		if(!found){

			this.finger[this.m].lookup(id, callback);
		}

	}

	this.stabilize = function(){

		(function(par){
			par.successor.predecessor(function(x){
				x = util.peerFromJson(x);

				if(typeof x.ip !== 'undefined' && util.isBetween(x.id, par.id, par.successor.id)){
					par.successor = x;
					console.log(par.id+' - s: '+par.successor.id);
				}
				par.successor.notify(par.toJson());
			});
		}(this));

	}

	this.fix_fingers = function(){

		this.stabilize();

		this.finger[1] = this.successor;

		for (var i = 2; i <= this.m; i++) {
			var tor = ((parseInt(this.id, 16) + Math.pow(2, i - 1)) % Math.pow(2, this.m)).toString(16);
			
			(function(par, i){
				par.find_successor(tor, function(data){
					par.finger[i] = util.peerFromJson(data);
				});
			}(this, i));
		};
	}

	this.getFingerTable = function(callback){

		var fingerTable = [];

		for (var i = 1; i <= this.m; i++) {
			tor = ((parseInt(this.id, 16) + Math.pow(2, i - 1)) % Math.pow(2, this.m)).toString(16);
			fingerTable[i] = {node: this.finger[i].id, start: tor};
		};

		callback(fingerTable);
	}

}
