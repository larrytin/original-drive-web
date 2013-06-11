"use strict";

var gdr = gdr || {};
gdr.demo = gdr.demo || {};

gdr.demo.connect = function(token) {
    var socket = gdr.demo.socket;
    if (socket != null) {
      socket.close();
    }

    var channel = new goog.appengine.Channel(token);

    var socket = channel.open();
    gdr.demo.socket = socket;

    socket.onopen = function() {
    	console.log("op");
    };
    socket.onmessage = function(msg) {
      console.log("msg:"+msg.data);
    };
    socket.onerror = function(err) {
      console.log("error "+err.code+"" +err.description);
    };
    socket.onclose = function() {
    	console.log("close");
    };
};