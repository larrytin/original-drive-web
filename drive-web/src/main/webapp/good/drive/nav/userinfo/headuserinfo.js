'use strict';
goog.provide('good.drive.nav.userinfo');

goog.require('good.config');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');


/**
 * @constructor
 */

good.drive.nav.userinfo.Headuserinfo = function() {
};


/**
 *
 */
good.drive.nav.userinfo.Headuserinfo.prototype.init = function() {
  var query = new goog.Uri.QueryData(window.location.hash.substring(1));
  var userId = query.get('userId');

  var rpc = new good.net.CrossDomainRpc('GET', good.config.ACCOUNT,
      good.config.VERSION, 'accountinfo/' + userId);
  rpc.send(function(json) {
    if (json && json['token']) {
      var name = goog.dom.getElement('gbgs4dn');
      var popname = goog.dom.getElement('gbmpn');
      var displayname = goog.dom.getElement('displayname');
      name.innerText = json['name'];
      popname.innerText = json['name'];
      displayname.innerText = json['displayName'];
    }
  });
};


/**
 *
 */
good.drive.nav.userinfo.Headuserinfo.prototype.nameClick = function() {
  var name = goog.dom.getElement('gbg4');

  goog.events.listen(name, goog.events.EventType.CLICK, function(e) {
    var info_div = goog.dom.getElement('gbd4');
    var visibility = info_div.style.visibility;
    if (visibility == 'hidden') {
      info_div.style.visibility = 'visible';
      info_div.style.right = '5px';
      info_div.style.left = 'auto';
    }else {
      info_div.style.visibility = 'hidden';
      info_div.style.right = '';
      info_div.style.left = '';
    }
  });
};
