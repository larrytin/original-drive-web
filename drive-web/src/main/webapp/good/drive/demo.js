'use strict';
goog.provide('good.drive.demo');

goog.require('goog.net.CrossDomainRpc');

good.drive.demo.start = function() {
	var opt_continuation = function(e) {
		console.log(e);
	};
	// goog.net.CrossDomainRpc.send('http://realtime.goodow.com/ah/api/device/v1/deviceinfo', opt_continuation);
};

goog.exportSymbol('good.drive.demo.start', good.drive.demo.start);
