// Creation Date: 2015.03.06
// Author: Fernando L. Canizo - http://flc.muriandre.com/

"use strict";


function getFortune(callback) {
	var spawn = require('child_process').spawn;
	var child = spawn('fortune', ['-s']);
	var fortune = "";

	child.stdout.on('data', function (data) {
		fortune += data;
	});

	child.stdout.on('end', function () {
		callback(fortune);
	});
}


module.exports = {
	get: getFortune
};
