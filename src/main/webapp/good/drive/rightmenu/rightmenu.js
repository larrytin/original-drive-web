'use strict';
goog.provide('good.drive.rightmenu');

goog.require('good.constants');
//goog.require('good.drive.creation.fileupload');
goog.require('good.drive.nav.menu.popupmenu');
goog.require('good.drive.rightmenu.preview');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.Uri');
goog.require('goog.dom');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.Dialog');

/**
 * @constructor
 */
good.drive.rightmenu.Rightmenu = function() {
  var fileupload = new good.drive.creation.Fileupload();
  this._fileupload = fileupload;
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
 * @param {string} fileId
 * @param {Function} fn
 */
good.drive.rightmenu.Rightmenu.prototype.uploadAgain = function(fileId, fn) {
  var that = this;
  if (goog.userAgent.IE && goog.userAgent.VERSION < 10) {
    alert('上传功能不支持IE10以下浏览器，建议选择Google Chrome浏览器。');
    return;
  }
  that._fileupload.fileClick('update', fileId);
};


/**
 * @param {string} fileId
 */
good.drive.rightmenu.Rightmenu.PREVIEW = function(fileId) {
  var uri = new goog.Uri(good.constants.SERVERADRESS);
  uri.setPath('serve');
  uri.setQuery('id');
  uri = uri.toString() + '=' + fileId;

  if (goog.userAgent.IE) {
    var rpc = new good.net.CrossDomainRpc('GET',
        good.constants.NAME,
        good.constants.VERSION, 'attachment/' + fileId,
        good.constants.SERVERADRESS);
    rpc.send(function(json) {
      if (json && !json['error']) {
        var contentType = json['contentType'];
        if (contentType == 'audio/mp3' ||
            contentType == 'application/x-shockwave-flash' ||
            contentType == 'video/mp4') {
          var type = '';
          if (contentType == 'audio/mp3' || contentType == 'video/mp4') {
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
  var previewpane = goog.dom.getElement('previewpane');
  var tags_text = goog.dom.getElement('tags');
  var typecombo = goog.dom.getElement('typecombo');
  var filename = goog.dom.getElement('filename');
  var thumbnail = goog.dom.getElement('thumbnail');
  var fileId_Txt = goog.dom.getElement('fileId');
  var update_info = goog.dom.getElement('update_info');
  fileId_Txt.value = fileId;
  typecombo.value = '';
 if (good.drive.role.Role.USERNAME != good.constants.ADMIN) {
   tags_text.disabled = 'true';
   typecombo.disabled = 'ture';
   update_info.disabled = 'true';
  }

  var rpc = new good.net.CrossDomainRpc('GET',
      good.constants.NAME,
      good.constants.VERSION, 'attachment/' + fileId,
      good.constants.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      filename.innerText = json['filename'];
      if (json['thumbnail'] != undefined) {
        if (good.constants.DRIVE_SERVER.indexOf('.goodow.com') != -1) {
          thumbnail.src = json['thumbnail'] + '=s300';
        } else {
          var uri_server = new goog.Uri(good.constants.DRIVE_SERVER);
          var uri = new goog.Uri(json['thumbnail']);
          uri.setDomain(uri_server.getDomain());
          uri.setScheme(uri_server.getScheme());
          uri.setScheme(uri_server.getScheme());
          uri.setPort(uri_server.getPort());
          thumbnail.src = uri.toString() + '=s300';
        }
      } else {
        var contentType = json['contentType'];
        if (contentType == 'audio/mp3' || contentType == 'video/mp4') {
          thumbnail.src = './good/images/audio.png';
        } else {
          thumbnail.src = './good/images/generic.png';
        }
      }

      var tags = json['tags'];
      var tagdata = '';
      goog.array.forEach(tags, function(item) {
        tagdata += item + ',';
      });
      tags_text.value = tagdata.substr(0, tagdata.lastIndexOf(','));
      if (json['contentType'] != undefined &&
          json['contentType'].indexOf('image/') != -1) {
        typecombo.value = 'image/';
      } else {
        typecombo.value = json['contentType'];
      }
      previewpane.style.display = 'block';
    }
  });
};


/**
 * @param {string} fileId
 * @param {string} subscribeId
 */
good.drive.rightmenu.Rightmenu.prototype.send = function(fileId, subscribeId) {
  var auth = good.auth.Auth.current;
  var message = {'userId' : auth.userId,
                 'token' : auth.access_token,
                 'attachmentId' : fileId};
  var path = 'pushToGcm?message=' +
             encodeURIComponent(goog.json.serialize(message)) +
             '&messageType=d&' + 'subscribeId=' + subscribeId;
  var rpc = new good.net.CrossDomainRpc('POST',
      good.constants.PRESENCE,
      good.config.VERSION, path,
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      alert('发送成功');
    }
  });

};


/**
 * @param {string} fileId
 */
good.drive.rightmenu.Rightmenu.prototype.preview2 = function(fileId) {
  var previewdiv = goog.dom.getElement('previewdiv');
  var imgplayer_div = goog.dom.getElement('imgplayer');
  var imgpreview = goog.dom.getElement('imgpreview');

  var flashplayer_div = goog.dom.getElement('flashplayer');
  var embedflash = goog.dom.getElement('embedflash');
  var movie = goog.dom.getElement('movie');
  var uri = new goog.Uri(good.constants.SERVERADRESS);
  uri.setPath('serve');
  uri.setQuery('id');
  uri = uri.toString() + '=' + fileId;
  var rpc = new good.net.CrossDomainRpc('GET',
      good.constants.NAME,
      good.constants.VERSION, 'attachment/' + fileId,
      good.constants.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      var contentType = json['contentType'];
      if (contentType == 'application/x-shockwave-flash') {
        imgplayer_div.style.display = 'none';
        flashplayer_div.style.display = 'block';
        movie.value = uri;
        embedflash.src = uri;
      } else if (contentType.indexOf('image/') != -1) {
        imgplayer_div.style.display = 'block';
        flashplayer_div.style.display = 'none';
        imgpreview.src = uri;
      }
      previewdiv.style.display = 'block';
    }
  });
};
