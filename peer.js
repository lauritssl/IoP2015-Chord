var restify = require('restify');
var	util = require('./util');

exports.Peer = function(ip, port){

	this.ip = ip;
	this.port = port;
	this.id = util.hash(ip, port);

	this.find_successor = function(id, callback){
		restify.createJsonClient({
			url: 'http://'+this.ip+':'+this.port
		}).get('/find_successor/'+id, function(err, req, res, data){
			callback(data);
		});
	}

	this.find_predecessor = function(id, callback){
		restify.createJsonClient({
			url: 'http://'+this.ip+':'+this.port
		}).get('/find_predecessor/'+id, function(err, req, res, data){
			callback(data);
		});
	}

	this.successor = function(callback){
		restify.createJsonClient({
			url: 'http://'+this.ip+':'+this.port
		}).get('/successor', function(err, req, res, data){
			callback(data);
		});
	}

	this.predecessor = function(callback){
		restify.createJsonClient({
			url: 'http://'+this.ip+':'+this.port
		}).get('/predecessor', function(err, req, res, data){
			callback(data);
		});
	}

	this.updatePredecessor = function(n, callback){
		restify.createJsonClient({
			url: 'http://'+this.ip+':'+this.port
		}).post('/predecessor/' + n.ip + '/' + n.port, function(err, req, res, data){
			callback(data);
		});
	}

	this.updateSuccessor = function(n, callback){

		restify.createJsonClient({
			url: 'http://'+this.ip+':'+this.port
		}).post('/successor/' + n.ip + '/' + n.port, function(err, req, res, data){
			callback(data);
		});
	}

	this.notify = function(n){
		restify.createJsonClient({
			url: 'http://'+this.ip+':'+this.port
		}).post('/notify/' + n.ip + '/' + n.port, function(err, req, res, data){
			
		});
	}

	this.lookup = function(id, callback){
		restify.createJsonClient({
			url: 'http://'+this.ip+':'+this.port
		}).get('/lookup/'+id, function(err, req, res, data){
			callback(data);
		});
	}

	this.closest_preceding_node = function(id, callback){
		restify.createJsonClient({
			url: 'http://'+this.ip+':'+this.port
		}).get('/closest_preceding_node/'+id, function(err, req, res, data){
			callback(data);
		});
	}	

	this.fetchData = function(){
		restify.createJsonClient({
			url: 'http://'+this.ip+':'+this.port
		}).post('/fetchData', function(err, req, res, data){
		});
	}

	this.toJson = function(){
		return {ip: this.ip, port: this.port, id: this.id};
	}
}