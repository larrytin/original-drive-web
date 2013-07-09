'use strict';
goog.provide('good.drive.nav.userinfo');

goog.require('good.config');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.Uri');
goog.require('goog.Uri.QueryData');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Popup');



/**
 * @constructor
 */
good.drive.nav.userinfo.Headuserinfo = function() {
  var popupElt = document.getElementById('gbd4');
  var popup = new goog.ui.Popup(popupElt);
  popup.setHideOnEscape(true);
  popup.setAutoHide(true);
  this.popup = popup;
  this.init();
  this.nameClick();
  this.accountClick();
  this.cancelClick();
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
  var that = this;
  goog.events.listen(name, goog.events.EventType.CLICK, function(e) {
    that.popup.setVisible(false);
    that.popup.setVisible(true);
  });
};


/**
 *
*/
good.drive.nav.userinfo.Headuserinfo.prototype.accountClick = function() {
  var account = goog.dom.getElement('account');
  goog.events.listen(account, goog.events.EventType.CLICK, function(e) {
    var query = new goog.Uri.QueryData(window.location.hash.substring(1));
    var userId = query.get('userId');

    var uri = new goog.Uri('EditPasswd.html' + '#userId=' + userId);
    window.location.assign(uri.toString());
  });
};


/**
*
*/
good.drive.nav.userinfo.Headuserinfo.prototype.cancelClick = function() {
  var cancel = goog.dom.getElement('cancel');
  goog.events.listen(cancel, goog.events.EventType.CLICK, function(e) {
    var uri = new goog.Uri('index.html');
    window.location.assign(uri.toString());
  });
};


