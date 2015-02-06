var app = require('express')();
var http = require('http');
var crypto = require('crypto');
var ip = require('ip');

//Generating random portnumber
var port = randomInt(1000, 9999);
var currentIP = ip.address();

var knownAddress = process.argv[2] || false;
var hash = getHash(currentIP, port);

if(knownAddress){
	
	knownAddress = knownAddress.split(':');
	
	var options = {
	  host: knownAddress[0],
	  port: knownAddress[1],
	  path: '/findsuccessor/'+hash,
	  method: 'GET'
	};
	
	http.get(options, function(res){

	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  res.on('data', function(chunk) {
	    // You can process streamed parts here...
	    bodyChunks.push(chunk);
	  }).on('end', function() {
	    var body = Buffer.concat(bodyChunks);
	    console.log('BODY: ' + body);
	    // ...and/or process the entire body here.
	  })
	});
}

app.get('/', function(req, res){
	res.send('<html><head><title></title></head><body style="text-align:center"> \
	<h1>'+hash+'</h1> \
	</body></html>');
});

app.get('/findsuccessor/:key', function(req, res){
	res.send( findSuccessor(req.params.key) );
});


//starting server on given port
app.listen(port);
console.log('server listen on: '+currentIP+':'+port) 

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

function findSuccessor(key){
	id = parseInt(key, 16);
	myID = parseInt(getHash(currentIP, port), 16);
	
	if(id > myID <= finger[0]){
		return finger[0];
	}else{
		
	}
	
	return JSON.stringify({ip: currentIP, port: port});
}
