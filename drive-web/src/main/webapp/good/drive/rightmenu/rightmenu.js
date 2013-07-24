'use strict';
goog.provide('good.drive.rightmenu');

goog.require('good.constants');
goog.require('good.drive.creation.fileupload');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.ui.Dialog');
goog.require('good.drive.nav.menu.popupmenu');

/**
 * @constructor
 */
good.drive.rightmenu.Rightmenu = function() {
  var fileupload = new good.drive.creation.Fileupload();
  this._fileupload = fileupload;
  
  //
  var aa = goog.dom.getElement('gbqfb');
  
  var menulst = new Array('预览', '详细信息');
  var popupmenu = new good.drive.nav.menu.Popupmenu(menulst);
  var that = this;
  var id = 'fybxpqfoz0vlf3oxdswybm9epvu3abm9owq387vk9m5ab0jylleow31c4awmn7madippvtsy4hz4bjbl7obzufo6zs80vr5lcecvlcihqbzjcm60t8h';
  popupmenu.createRight(aa,function(e){
    that.preview(id);
  });  
};

/**
 * @param {string} fileId
 * @param {Function} fn
 */
good.drive.rightmenu.Rightmenu.prototype.deletefn = function(fileId, fn) {
  var rpc = new good.net.CrossDomainRpc('POST',
      good.constants.NAME,
      good.constants.VERSION, 'remove/' + fileId,
      good.constants.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      fn();
    }
  });
};

/**
 * @param {string} fileId
 * @param {Array.<string>} tags
 * @param {string} contentType
 * @param {Function} fn
 */
good.drive.rightmenu.Rightmenu.prototype.changeinfo = function(fileId,
    tags, contentType, fn) {
  this._fileupload.updatefile(fileId, tags, contentType, fn);
};

/**
 *
 */
good.drive.rightmenu.Rightmenu.prototype.uploadAgain = function() {
  if(goog.userAgent.IE && goog.userAgent.VERSION <10){
    alert('上传功能不支持IE10以下浏览器，建议选择Google Chrome浏览器。');
    return;
  }
};


/**
 * @param {string} fileId
 */
good.drive.rightmenu.Rightmenu.prototype.preview = function(fileId) {
  var dialog = new goog.ui.Dialog();
  dialog.setTitle('预览');
  this.detailInfo(fileId, function(json) {
    var uri = new goog.Uri(good.constants.SERVERADRESS);
    uri.setPath('serve');
    uri.setQuery('id');
    uri = uri.toString() + '=' + fileId;
    var contentType = json['contentType'];
    if (contentType == 'audio/mp3') {
      dialog.setContent(
          '<div id="audiodiv">' +
          '<object>' +
          '<embed id="embed" src=' + uri + ' quality="high" ' +
          'style="width: 360px; height: 253px; left: 533px; top: 40px;">' +
          '</embed>' +
          '</object>' +
          '</div>');      
      dialog.setVisible(true);
      goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        alert('You chose: ' + e.key);
      });
    }
  }); 
  
  //window.location.assign(uri.toString() + fileId);
};


/**
 * @param {string} fileId
 * @param {Function} fn
 */
good.drive.rightmenu.Rightmenu.prototype.detailInfo = function(fileId, fn) {
  var rpc = new good.net.CrossDomainRpc('GET',
      good.constants.NAME,
      good.constants.VERSION, 'attachment/' + fileId,
      good.constants.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      fn(json);
    }
  });
};
