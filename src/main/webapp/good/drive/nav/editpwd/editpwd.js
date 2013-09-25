'use strict';
goog.provide('good.drive.nav.editpwd');

goog.require('good.config');
goog.require('good.drive.auth.cookit');
goog.require('good.drive.auth.signup');
goog.require('good.drive.nav.userinfo');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');
/**
 * 修改用户信息类
 */
good.drive.nav.editpwd.start = function() {
  good.config.start();
  var $ = goog.dom.getElement;
  var str = new RegExp('http');
  var userId = undefined;
  var access_token = undefined;
  if (str.test(window.location.toString()) != true) {
    var query = new goog.Uri.QueryData(window.location.hash.substring(1));
    userId = query.get('userId');
    access_token = query.get('access_token');
  } else {
    userId = good.drive.auth.cookit.getCookie('userId');
    access_token = good.drive.auth.cookit.getCookie('access_token');
  }
  new good.drive.nav.userinfo.Headuserinfo();
  var array = new Array('OldPasswd', 'Passwd', 'PasswdAgain');
  good.drive.auth.signup.focus(array);

  var submit = goog.dom.getElement('save');
  goog.events.listen(submit, goog.events.EventType.CLICK, function(e) {
    if (!good.drive.auth.signup.formCheck(array)) {
      return false;
    }
    var name = goog.dom.getElement('gbgs4dn').innerText;
    var OldPasswd = $('OldPasswd').value;
    var pwd = $('Passwd').value;
    var displayname = $('newname').value;
    var rpc = new good.net.CrossDomainRpc('POST', good.config.ACCOUNT,
        good.config.VERSION, 'login/' + encodeURIComponent(name) +
        '/' + encodeURIComponent(OldPasswd),
        good.config.SERVERADRESS);
    rpc.send(function(json) {
      if (json && json['token']) {
        var rpc = new good.net.CrossDomainRpc('POST', good.config.ACCOUNT,
            good.config.VERSION, 'updateAccountInfo',
            good.config.SERVERADRESS);
        if (displayname != null && displayname != '') {
          json['displayName'] = displayname;
        }
        json['token'] = pwd;
        delete json['kind'];
        delete json['etag'];
        rpc.body = json;
        rpc.send(function(json) {
           if (json && !json['error']) {
             var uri = new goog.Uri(window.location);
             var str = new RegExp('http');
             if (str.test(uri.toString()) != true) {
                window.location.assign('index.html' + '#userId=' +
                  + json['userId'] + '&access_token=' + json['token']);
             } else {
               good.drive.auth.cookit.delCookie('userId');
               good.drive.auth.cookit.delCookie('access_token');
               good.drive.auth.cookit.addCookie('userId', json['userId']);
               good.drive.auth.cookit.addCookie('access_token', json['token']);
               window.location.assign('index.html');
             }
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

  var cancel = goog.dom.getElement('edit_cancel');
  goog.events.listen(cancel, goog.events.EventType.CLICK, function(e) {
    var str1 = new RegExp('http');
    if (str1.test(window.location.toString()) != true) {
      var uri = new goog.Uri('index.html' + '#userId=' +
          userId + '&access_token=' + access_token);
      window.location.assign(uri.toString());
    } else {
      window.location.assign('index.html');
    }
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
