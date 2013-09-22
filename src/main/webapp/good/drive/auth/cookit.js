'use strict';
goog.provide('good.drive.auth.cookit');

/**
 * @param {string} c_name
 * @param {string} value
 * @param {string} expiredays
 */
good.drive.auth.cookit.addCookie = function(c_name, value, expiredays) {
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
 good.drive.auth.cookit.getCookie = function(c_name) {
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
good.drive.auth.cookit.delCookie = function(name) {
  var exp = new Date();
  var cval = good.drive.auth.cookit.getCookie(name);
  exp.setTime(exp.getTime() - 1);
  if (cval != null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
  }
};
