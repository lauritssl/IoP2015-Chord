var restify = require('restify');
var ipTool = require('ip');
var readline = require('readline');
var util = require('./util');
var node = require('./node');
var peer = require('./peer');

var ip = ipTool.address();
var port = util.randomPort();

if(process.argv[2]){
	n = new node.Node(ip, port);

	known_ip = process.argv[2];
	known_port = process.argv[3];

	known = new peer.Peer(known_ip, known_port);
	n.join(known);

}else{
	n = new node.Node(ip, port);
	n.create();
}

//Creating server using restify
var server = restify.createServer();

//Return default interface
server.get('/', restify.serveStatic({
  directory: './',
  default: 'index.html'
}));

//Responses to get requests
server.get('/find_successor/:id', function (req, res, next){
	n.find_successor(req.params.id, function(data){
		res.send(200, data);
		next();
	});
});

server.get('/find_predecessor/:id', function (req, res, next){
	n.find_predecessor(req.params.id, function(data){
		res.send(200, data);
		next();
	});
});

server.get('/successor/', function (req, res, next){
	res.send(200, n.successor);
	next();
});

server.get('/predecessor/', function (req, res, next){
	res.send(200, n.predecessor);
	next();
});

server.get('/node/', function (req, res, next){
	res.send(200, n.toJson());
	next();
});

server.post('/notify/:ip/:port', function (req, res, next){
	n.notify( util.peerFromJson(req.params) );
	res.send(200, 'success');
	next();
});

server.post('/predecessor/:ip/:port', function (req, res, next){
	n.predecessor = util.peerFromJson(req.params);
	console.log('predecessor: '+n.predecessor.id);
	res.send(200, 'success');
	next();
});

server.post('/successor/:ip/:port', function (req, res, next){
	n.successor = util.peerFromJson(req.params);
	console.log('predecessor: '+n.successor.id);
	res.send(200, 'success');
	next();
});

//Take command line inputs
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

server.listen(port, function(){
	console.log('Chord peer is active on http://' + ip + ':' + port);
	console.log('My id is: '+ util.hash(ip, port));

	console.log('\nType help to see avalible commands');

	//Listen for command line input
	rl.on('line', function(cmd) {
		switch(cmd){
			case 'leave':
				console.log('\nPerforming nice leave, please wait\n');
				n.leave();
				break;
			case 'successor':
				console.log('ip:   '+n.successor.ip);
				console.log('port: '+n.successor.port);
				console.log('id:   '+n.successor.id);
				break;
			case 'predecessor':
				if(n.predecessor){
					console.log('ip:   '+n.predecessor.ip);
					console.log('port: '+n.predecessor.port);
					console.log('id:   '+n.predecessor.id);
				}else{
					console.log('none (only node?)')
				}
				break;
			case 'exit':
				process.kill();
			case 'help':
				console.log('\nleave:       Perform nice leave');
				console.log('successor:   Return successor information');
				console.log('predecessor: Return predecessor information');
				console.log('exit:        Terminate node (brutal)');
				console.log('help:        Returns this information :)\n');
				break;
			default:
				console.log('Unknown command');
		}
	});

});