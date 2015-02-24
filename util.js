var crypto = require('crypto');
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