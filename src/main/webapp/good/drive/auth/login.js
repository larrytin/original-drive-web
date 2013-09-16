'use strict';
goog.provide('good.drive.auth');
goog.provide('good.drive.auth.login');

goog.require('good.config');
goog.require('good.drive.auth.signup');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.FocusHandler');



/**
 * login登录控制类
 * @constructor
 * @param {string}
 *          userId
 * @param {string}
 *          access_token
 */
good.drive.auth.Auth = function(userId, access_token) {
  this.userId = userId;
  this.access_token = access_token;
};


/** @type {good.drive.auth.Auth} */
good.drive.auth.Auth.current = null;


/**
 * 登录页面输入框check方法
 * @param {string}
 *          name
 * @param {string}
 *          pwd
 */
good.drive.auth.login = function(name, pwd) {
  if (good.drive.auth.signup.isEmpty(name)) {
    var errormsg_0_Email = goog.dom.getElement('errormsg_0_Email');
    errormsg_0_Email.innerText = '输入您的用户名。 ';
    var Email = goog.dom.getElement('Email');
    Email.className = 'form-error';
    return;
  }

  if (good.drive.auth.signup.isEmpty(pwd)) {
    var errormsg_0_Passwd = goog.dom.getElement('errormsg_0_Passwd');
    errormsg_0_Passwd.innerText = '输入您的密码。 ';
    var Passwd = goog.dom.getElement('Passwd');
    Passwd.className = 'form-error';
    return;
  }

  var rpc = new good.net.CrossDomainRpc('POST', good.config.ACCOUNT,
      good.config.VERSION, 'login/' +
      encodeURIComponent(name) + '/' + encodeURIComponent(pwd),
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && json['token']) {
      var uri = new goog.Uri(window.location);
      var redirect_uri = uri.getParameterValue('redirect_uri');
      var str = new RegExp('http');
      if (str.test(redirect_uri) != true) {
        window.location.assign('../../../' + 'index.html' +
            '#userId=' + json['userId'] +
            '&access_token=' + json['token']);
      } else {
        good.drive.auth.addCookie('userId', json['userId']);
        good.drive.auth.addCookie('access_token', json['token']);
        window.location.assign(redirect_uri);
      }
    } else {
      var errormsg_0_Passwd = goog.dom.getElement('errormsg_0_Passwd');
      errormsg_0_Passwd.innerText = '您输入的用户名或密码不正确。 ';
      var Passwd = goog.dom.getElement('Passwd');
      Passwd.className = 'form-error';
    }
  });
};


/**
 * login.html页面初始化类
 */
good.drive.auth.login.start = function() {
  good.config.start();
  var Passwd = goog.dom.getElement('Passwd');
  goog.events.listen(Passwd, goog.events.FocusHandler.EventType.FOCUSIN,
      function(e) {
        var errormsg_0_Passwd = goog.dom.getElement('errormsg_0_Passwd');
        errormsg_0_Passwd.innerText = '';
        Passwd.className = '';
      });
  var Email = goog.dom.getElement('Email');
  goog.events.listen(Email, goog.events.FocusHandler.EventType.FOCUSIN,
      function(e) {
        var errormsg_0_Email = goog.dom.getElement('errormsg_0_Email');
        errormsg_0_Email.innerText = '';
        Email.className = '';
      });
  var signIn = goog.dom.getElement('signIn');
  goog.events.listen(signIn, goog.events.EventType.CLICK, function(e) {
    var name = goog.dom.getElement('Email').value;
    var pwd = goog.dom.getElement('Passwd').value;
    good.drive.auth.login(name, pwd);
  });
};

/** */
good.drive.auth.check = function() {
  var uri = new goog.Uri(window.location);
  var userId = undefined;
  var access_token = undefined;
  if (uri.scheme_ != 'http') {
    var query = new goog.Uri.QueryData(window.location.hash.substring(1));
    userId = query.get('userId');
    access_token = query.get('access_token');
  } else {
    userId = good.drive.auth.getCookie('userId');
    access_token = good.drive.auth.getCookie('access_token');
  }
  if (!userId || !access_token) {
    var uri = new goog.Uri('good/drive/auth/ServiceLogin.html');
    uri.setParameterValue('redirect_uri', window.location);
    window.location.assign(uri.toString());
  } else {
    var auth = new good.drive.auth.Auth(userId, access_token);
    good.drive.auth.Auth.current = auth;
  }
};

/**
 * @param {string} c_name
 * @param {string} value
 * @param {string} expiredays
 */
good.drive.auth.addCookie = function(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  var str = escape(value);
  if (expiredays == null) {
    str += '';
  } else {
    str += ';expires=' + exdate.toGMTString();
  }
  document.cookie = c_name + '=' + str + ';path=/';
};

 /**
  * @param {string} c_name
  * @return {string}
  */
 good.drive.auth.getCookie = function(c_name) {
  var name = escape(c_name);
  var allcookies = document.cookie;
  name += '=';
  var pos = allcookies.indexOf(name);
  if (pos != -1) {
    var start = pos + name.length;
    var end = allcookies.indexOf(';', start);
    if (end == -1) end = allcookies.length;
    var value = allcookies.substring(start, end);
    return (value);
  } else {
    return '';
  }
};

/**
 * @param {string} name
 */
good.drive.auth.delCookie = function(name) {
  var exp = new Date();
  var cval = good.drive.auth.getCookie(name);
  exp.setTime(exp.getTime() - 1);
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
  }
};

goog.exportSymbol('good.drive.auth.login.start', good.drive.auth.login.start);
