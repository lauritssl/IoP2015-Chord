var crypto = require('crypto');
var ip = require('ip');
var request = require('request');

<<<<<<< Updated upstream
// ****************************************** Initial Setup ******************************************
var port = randomInt(1000, 9999);
var currentIP = ip.address();
=======
var Node = function(){
>>>>>>> Stashed changes

	this.predecessor = null;
	this.successor = null;

<<<<<<< Updated upstream
var Node = function(id, ip, port){
	this.id = id;
	this.ip = ip;
	this.port = port;
	
	this.getAddress = function(){
		return this.ip + ':' + this.port;
	}
	
	this.getJson = function(){
		return JSON.stringify({id: this.id, ip: this.ip, port: this.port});
	}
}

// ****************************************** Know Peers ******************************************


var successor = new Node(hash, currentIP, port);
var predecessor = new Node(hash, currentIP, port);


if(knownAddress){
	
	request('http://'+knownAddress+'/findsuccessor/'+hash, function (error, response, body) {
	    var json = JSON.parse(body);
	    successor = new Node(json.id, json.ip, json.port);
	    console.log( successor.getJson() );
	});
	
}

// ****************************************** Server setup ******************************************

app.get('/', function(req, res){
	res.send('<html><head><title></title></head><body style="text-align:center"> \
	<h1>'+hash+'</h1> \
	</body></html>');
});
=======
	this.port = randomInt(1000, 9999);
	this.ip = ip.address();
	this.id = hash(this.ip, this.port);

	this.getHash = function(){
		return this.id;
	}

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
>>>>>>> Stashed changes

		if(this.id > id && this.successor.id > id){
			if(this.id >= this.successor.id){
				return this;
			} else{
				return this.successor.find_predecessor(id);
			}
		}

<<<<<<< Updated upstream
app.listen(port);
console.log('server listen on: '+currentIP+':'+port); 


// ****************************************** Chord functions ******************************************

function findSuccessor(key){
	id = parseInt(key, 16);
	myID = getKey();
	successorID = parseInt(successor.id, 16);
	
	if(myID < id <= successorID){
		return successor.getJson();
	}else{
		request('http://'+successor.getAddress()+'/findsuccessor/'+key, function (error, response, body) {
		    console.log(body);
		    return body;
		});
	}
	
}


























/*-------------- HELP METHODS -----------------------*/


=======
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
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream

function getKey(){
	return parseInt(getHash(currentIP, port), 16);
=======
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

	console.log(n.getHash()+' = '+n.successor.id+' : '+n.predecessor.id);
	console.log(n1.getHash()+' = '+n1.successor.id+' : '+n1.predecessor.id);
	console.log(n2.getHash()+' = '+n2.successor.id+' : '+n2.predecessor.id);
	console.log(n3.getHash()+' = '+n3.successor.id+' : '+n3.predecessor.id);

	console.log(n.find_successor(9876).id);
>>>>>>> Stashed changes
}