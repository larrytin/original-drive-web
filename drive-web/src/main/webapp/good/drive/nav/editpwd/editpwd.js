'use strict';
goog.provide('good.drive.nav.editpwd');

goog.require('good.auth.signup');
goog.require('good.config');
goog.require('good.drive.nav.userinfo');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');


/**
 *
 */
good.drive.nav.editpwd.start = function() {
  good.config.start();
  var $ = goog.dom.getElement;
  var query = new goog.Uri.QueryData(window.location.hash.substring(1));
  var userId = query.get('userId');
  var access_token = query.get('access_token');

  new good.drive.nav.userinfo.Headuserinfo();
  var array = new Array('OldPasswd', 'Passwd', 'PasswdAgain');
  good.auth.signup.focus(array);

  var submit = goog.dom.getElement('save');
  goog.events.listen(submit, goog.events.EventType.CLICK, function(e) {
    if (!good.auth.signup.formCheck(array)) {
      return false;
    }

    var name = goog.dom.getElement('gbgs4dn').innerText;
    var OldPasswd = $('OldPasswd').value;
    var pwd = $('Passwd').value;
    var rpc = new good.net.CrossDomainRpc('POST', good.config.ACCOUNT,
        good.config.VERSION, 'login/' + encodeURIComponent(name) + '/' +
        encodeURIComponent(OldPasswd));
    rpc.send(function(json) {
      if (json && json['token']) {
        var rpc = new good.net.CrossDomainRpc('POST', good.config.ACCOUNT,
            good.config.VERSION, 'updateAccountInfo');
        var body = {
          'userId': userId,
          'name' : name,
          'token' : pwd
        };
        rpc.body = body;
        rpc.send(function(json) {
          if (json && !json['error']) {
            window.location.assign('index.html' + '#userId=' +
                json['userId'] + '&access_token=' + json['token']);
          }
        });
      } else {
        var errormsg_0_Passwd = goog.dom.getElement('errormsg_0_OldPasswd');
        errormsg_0_Passwd.innerText = '所提供的密码不正确。 ';
        var Passwd = goog.dom.getElement('OldPasswd');
        Passwd.className = 'form-error';
      }
    });
  });

  var cancel = goog.dom.getElement('cancel');
  goog.events.listen(cancel, goog.events.EventType.CLICK, function(e) {

    var uri = new goog.Uri('index.html' + '#userId=' +
        userId + '&access_token=' + access_token);

    window.location.assign(uri.toString());


    //    var rpc = new good.net.CrossDomainRpc('GET', good.config.ACCOUNT,
    //        good.config.VERSION, 'accountinfo/' + userId);
    //    rpc.send(function(json) {
    //      if (json && !json['error']) {
    //        var uri = new goog.Uri('index.html' + '#userId=' +
    //            json['userId'] + '&access_token=' + json['token']);
    //        window.location.assign(uri.toString());
    //      }
    //    });
  });
};

goog.exportSymbol('good.drive.nav.editpwd.start', good.drive.nav.editpwd.start);
