var util = require('./util');
var peer = require('./peer');

exports.Node = function(ip, port){

	this.predecessor = null;
	this.successor = null;

	this.port = port;
	this.ip = ip;
	this.id = util.hash(this.ip, this.port);

	this.create = function(){
		this.successor = util.peerFromJson( this.toJson() );
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
			
			util.peerFromJson(n0).successor(function(data){
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

		//Closure to access parent object from nested functions
		(function(par){

			n.successor(function(n_successor){

				n.predecessor(function(n_predecessor){

					if(par.predecessor == null || par.predecessor.id == n_predecessor.id){
						par.predecessor = n;
						console.log('predecessor: ' + par.predecessor.id);
					}
					if(par.successor.id == par.id || par.successor.id == n_successor.id){
						par.successor = n;
						console.log('successor: ' + par.successor.id);
					}

				});
			});

		}(this));
	}

	this.lookup = function(id, callback){
		if(this.id == id){
			callback(this.toJson());
		}else{
			this.find_successor(id, callback);
		}
	}

	this.toJson = function(){
		return {ip: this.ip, port: this.port, id: this.id};
	}

}
