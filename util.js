var crypto = require('crypto');
var restify = require('restify');
var mongoose = require('mongoose');
var peer = require('./peer');

exports.randomPort = function() {
	//Returns a random int between 1000 and 9999
    return Math.floor(Math.random() * (9999 - 1000) + 1000);
}

exports.hash = function(ip, port){
	//Hashing the ip and the port with SHA-1
	var shasum = crypto.createHash('sha1');
	shasum.update(ip+':'+port);

	//Return hash in hex
	return shasum.digest('hex').substring(0, 5);
}

exports.peerFromJson = function(json){
	return new peer.Peer(json.ip, json.port);
}

exports.isBetween = function(num, start, end){

	if(start > num && end < num){
		return false;
	}

	if(start > num && end > num){
		if(start >= end){
			return true;
		} else{
			return false;
		}
	}

	if(start < num && end > num){
		return true;
	}

	if(start < num && end < num){
		if(start >= end){
			return true;
		} else{
			return false;
		}
	}

	return false;
}

exports.readCore = function(callback){
	restify.createJsonClient({
			url: 'https://api.spark.io'
		}).get('/v1/devices/53ff6c066667574814522567/temperature?access_token=761660f7e8884a2cd778167bfbd91150dfb85d81', function(err, req, res, data){
			temp = data.result.toFixed(2);

			restify.createJsonClient({
				url: 'https://api.spark.io'
			}).get('/v1/devices/53ff6c066667574814522567/light?access_token=761660f7e8884a2cd778167bfbd91150dfb85d81', function(err, req, res, data){
				light = data.result;
				callback(temp, light);
			});
		});
}