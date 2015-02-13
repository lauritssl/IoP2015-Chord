var crypto = require('crypto');
var ip = require('ip');

var Node = function(){

	this.predecessor = null;
	this.successor = null;

	this.port = randomInt(1000, 9999);
	this.ip = ip.address();
	this.id = hash(this.ip, this.port);

	this.create = function(){
		this.successor = this;
	}

	this.join = function(n){

		this.predecessor = n.find_predecessor(this.id);
		this.successor = this.predecessor.successor;

		this.successor.notify(this);
		this.predecessor.notify(this);
	}

	this.leave = function(){
		this.successor.predecessor = this.predecessor;
		this.predecessor.successor = this.successor;
	}

	this.find_successor = function(id){
		n0 = this.find_predecessor(id);
		return n0.successor;
	}

	this.find_predecessor = function(id){
		if(this.id > id && this.successor.id < id){
			return this.successor.find_predecessor(id);
		}

		if(this.id > id && this.successor.id > id){
			if(this.id >= this.successor.id){
				return this;
			} else{
				return this.successor.find_predecessor(id);
			}
		}

		if(this.id < id && this.successor.id > id){
			return this;
		}

		if(this.id < id && this.successor.id < id){
			if(this.id >= this.successor.id){
				return this;
			} else{
				return this.successor.find_predecessor(id);
			}
		}
	}

	this.notify = function(n){
		if(this.predecessor == null || this.predecessor.id === n.predecessor.id){
			this.predecessor = n;
		}
		if(this.successor.id === this.id || this.successor.id === n.successor.id){
			this.successor = n;
		}
	}

}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function hash(ip, port){
	//Hashing the ip and the port with SHA-1
	var shasum = crypto.createHash('sha1');
	shasum.update(ip+':'+port);
	
	//Return hash in hex
	return shasum.digest('hex');
}

if(process.argv[2]){
	n = new Node();
	known = process.argv[2];

	n.join(known);

}else{
	n = new Node();
	n.create();

	n1 = new Node();
	n1.join(n);

	n2 = new Node();
	n2.join(n);

	n3 = new Node();
	n3.join(n);

	console.log(n.id+' = '+n.successor.id+' : '+n.predecessor.id);
	console.log(n1.id+' = '+n1.successor.id+' : '+n1.predecessor.id);
	console.log(n2.id+' = '+n2.successor.id+' : '+n2.predecessor.id);
	console.log(n3.id+' = '+n3.successor.id+' : '+n3.predecessor.id);

	console.log(n.find_successor('9876').id);
}