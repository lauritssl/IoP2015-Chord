var app = require('express')();
var http = require('http');
var crypto = require('crypto');
var ip = require('ip');
var request = require('request');

// ****************************************** Initial Setup ******************************************
var port = randomInt(1000, 9999);
var currentIP = ip.address();

var knownAddress = process.argv[2] || false;
var hash = getHash(currentIP, port);

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

app.get('/findsuccessor/:key', function(req, res){
	res.send( findSuccessor(req.params.key) );
});

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



function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function getHash(ip, port){
	//Hashing the ip and the port with SHA-1
	var shasum = crypto.createHash('sha1');
	shasum.update(ip+':'+port);
	
	//Return hash in hex
	return shasum.digest('hex');
}


function getKey(){
	return parseInt(getHash(currentIP, port), 16);
}