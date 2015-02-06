var app = require('express')();
var http = require('http');
var crypto = require('crypto');
var ip = require('ip');

var knownAddress = process.argv[2] || false;

if(knownAddress){
	
	knownAddress = knownAddress.split(':');
	
	var options = {
	  host: 'http://'+knownAddress[0],
	  port: knownAddress[1],
	  path: '/',
	  method: 'GET'
	};
	
	
	http.get(options, function(res){
		console.log('jeg fik svar!');
	});
}

var server = http.createServer(function(req, res){
	console.log(req);
	res.writeHead(200);
	res.end('<html><head><title></title></head><body style="text-align:center"> \
	<h1>'+getHash(currentIP, port)+'</h1> \
	</body></html>');
});




/*
app.get('/findSucessor', function(req, res){
	console.log(req);
	//res.send(findSuccessor());
});
*/

//Generating random portnumber
var port = randomInt(1000, 9999);
var currentIP = ip.address();

//starting server on given port
server.listen(port);
console.log('server listen on: '+currentIP+':'+port) 

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

var getHash = function(ip, port){
	//Hashing the ip and the port with SHA-1
	var shasum = crypto.createHash('sha1');
	shasum.update(ip+':'+port);
	
	//Return hash in hex
	return shasum.digest('hex');
}

var findSuccessor = function(key){
	return JSON.stringify({ip: this.currentIP, port: this.port});
}
