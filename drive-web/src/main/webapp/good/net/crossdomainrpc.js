'use strict';
goog.provide('good.net.CrossDomainRpc');

goog.require('goog.json');

good.net.CrossDomainRpc = function(method, url) {
  if (url.indexOf('http') != 0) {
    url = good.net.CrossDomainRpc.BASE_URL + url;
  }
  var xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != 'undefined') {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS
    // requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // Otherwise, CORS is not supported by the browser.
    xhr = null;
  }
  if (!xhr) {
    throw new Error('CORS not supported');
  }
  this.xhr = xhr;
};

good.net.CrossDomainRpc.BASE_URL = 'http://localhost:8888/_ah/api/';

good.net.CrossDomainRpc.prototype.send = function(onload) {
  this.xhr.onload = function() {
    var responseText = this.responseText;
    if (responseText.length == 0) {
      onload(null);
      return;
    }
    onload(goog.json.parse(responseText));
  };
  this.xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };
  this.xhr.send();
};