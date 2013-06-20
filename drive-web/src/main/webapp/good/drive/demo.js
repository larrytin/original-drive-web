'use strict';
goog.provide('good.drive.demo');

goog.require('good.net.CrossDomainRpc');

good.drive.demo.start = function() {
  var opt_continuation = function(e) {
    console.log(e);
  };
  var rpc = new good.net.CrossDomainRpc('GET', 'http://realtime.goodow.com/ah/api/device/v1/deviceinfo');
  rpc.send(function(json) {
    var a = json;
  });
};

goog.exportSymbol('good.drive.demo.start', good.drive.demo.start);
