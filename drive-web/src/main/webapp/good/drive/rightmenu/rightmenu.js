'use strict';
goog.provide('good.drive.rightmenu');

goog.require('good.constants');
goog.require('good.drive.creation.fileupload');
goog.require('good.drive.nav.menu.popupmenu');
goog.require('good.drive.rightmenu.preview');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.ui.Dialog');

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
  var id = 'oxwg0klaoetukyhhbrqim9hkx0u41tbttln5' +
  'c0v7ebrvfeaefl19eff53wvva8e2dlo25y5lxy1df895u' +
  'tk490vgu7q13ehz9lea70sjwe5480lwljn';
  popupmenu.createRight(aa, function(e) {
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
  if (goog.userAgent.IE && goog.userAgent.VERSION < 10) {
    alert('上传功能不支持IE10以下浏览器，建议选择Google Chrome浏览器。');
    return;
  }
};


/**
 * @param {string} fileId
 */
good.drive.rightmenu.Rightmenu.prototype.preview = function(fileId) {
  var uri = new goog.Uri(good.constants.SERVERADRESS);
  uri.setPath('serve');
  uri.setQuery('id');
  uri = uri.toString() + '=' + fileId;

  if (goog.userAgent.IE) {
  this.detailInfo(fileId, function(json) {
    var contentType = json['contentType'];
    if (contentType == 'audio/mp3' ||
        contentType == 'application/x-shockwave-flash') {
      var type = '';
      if (contentType == 'audio/mp3') {
          type = 'application/x-mplayer2';
      } else if (contentType == 'application/x-shockwave-flash') {
        type = contentType;
      }
      var uri2 = new goog.Uri('preview.html');
      uri2.setParameterValue('SRC', uri);
      uri2.setParameterValue('TYPE', type);
      window.open(uri2);
    } else {
      window.open(uri);
    }
  });
  } else {
    window.open(uri);
  }
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
