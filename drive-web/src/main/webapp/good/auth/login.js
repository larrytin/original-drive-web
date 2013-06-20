'use strict';
goog.provide('good.auth');

goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');

good.auth.Auth = function(name, pwd) {
  this.name = name;
  this.pwd = pwd;
};

good.auth.Auth.prototype.login = function() {
  var rpc = new good.net.CrossDomainRpc('POST', 'account/v1/login/' + this.name + '/' + this.pwd);
  rpc.send(function(json) {
    if (!json) {
      alert('login success!');
    }
  });
};

good.auth.start = function() {
  var signIn = goog.dom.getElement('signIn');
  goog.events.listen(signIn, goog.events.EventType.CLICK, function(e) {
    var name = goog.dom.getElement('User').value;
    var pwd = goog.dom.getElement('Passwd').value;
    var auth = new good.auth.Auth(name, pwd);
    auth.login();
  });
};

goog.exportSymbol('good.auth.start', good.auth.start);
