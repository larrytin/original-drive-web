'use strict';
goog.provide('good.drive.rightmenu.detailinfo');

goog.require('good.constants');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');

/**
 * @constructor
 * @param {Function} handle
 */
good.drive.rightmenu.DetailInfo = function(handle) {
  var update_info = goog.dom.getElement('update_info');
  var previewpane_closer = goog.dom.getElement('previewpane-closer');
  var that = this;
  goog.events.listen(update_info,
      goog.events.EventType.CLICK, function(e) {
    that.update(handle);
  });

  goog.events.listen(previewpane_closer,
      goog.events.EventType.CLICK, function(e) {
    that.close();
  });
};

/**  type{string} */
good.drive.rightmenu.DetailInfo.TYPEFLAG = undefined;


/**
 * @param {Function} handle
 */
good.drive.rightmenu.DetailInfo.prototype.update = function(handle) {
  //var fieldcombo = goog.dom.getElement('fieldcombo');
  var that = this;
  var tags_text = goog.dom.getElement('tags');
  var typecombo = goog.dom.getElement('typecombo');
  var fileId_Txt = goog.dom.getElement('fileId');
  var fileId = fileId_Txt.value;
  var tags = new Array();
  var tagsdata = tags_text.value;
  if (tagsdata != null && tagsdata != '') {
    tagsdata = tagsdata.split(',');
    goog.array.forEach(tagsdata, function(item) {
      tags.push(item);
    });
  }
  if (good.drive.rightmenu.DetailInfo.TYPEFLAG == undefined) {
    this.updatefile(fileId, tags, typecombo.value, handle);
  } else {
    var pathControl = good.drive.nav.folders.Path.getINSTANCE();
    var docid = pathControl.currentDocId;
      var view = pathControl.getViewBydocId(docid);
      var model = view.getCurrentItem();
      var data = model.map;
      var query = data.get(good.constants.QUERY);
      var tags_query = query.get(good.constants.TAGS);
      tags_query.clear();
      goog.array.forEach(tags, function(item) {
        tags_query.push(item);
      });
      query.set('contentType', typecombo.value);
      that.close();
  }
};

/**
 *
 */
good.drive.rightmenu.DetailInfo.prototype.close = function() {
  var previewpane = goog.dom.getElement('previewpane');
  previewpane.style.display = 'none';
};


/**
 * @param {string} fileId
 * @param {Array.<string>} tags
 * @param {string} content_Type
 * @param {Function} handler
 */
good.drive.rightmenu.DetailInfo.prototype.updatefile = function(fileId,
    tags, content_Type, handler) {
   var that = this;
    var rpc = new good.net.CrossDomainRpc('GET',
        good.constants.NAME,
        good.constants.VERSION, 'attachment/' + fileId,
        good.constants.SERVERADRESS);
    rpc.send(function(json) {
       if (json && !json['error']) {
        /* if (tags != null && tags.length > 0) {
           if (json['tags'] != undefined &&
               !goog.array.isEmpty(json['tags'])) {
             goog.array.forEach(tags, function(e) {
              if (!goog.array.contains(json['tags'], e)) {
                goog.array.insert(json['tags'], e);
              }
            });
           }else {
             json['tags'] = tags;
           }
         }*/
         json['tags'] = tags;
         if (content_Type != null && content_Type != '' &&
             content_Type == 'application/x-print') {
           json['contentType'] = content_Type;
         }
         var rpc = new good.net.CrossDomainRpc('POST',
             good.constants.NAME,
             good.constants.VERSION, 'update',
             good.constants.SERVERADRESS);
         rpc.body = json;
         rpc.send(function(json) {
           handler();
           that.close();
        });
       }
    });
};


/**
 * @param {string} label
 * @param {Array.<string>} tags
 * @param {string} contentType
 */
good.drive.rightmenu.DetailInfo.PUBLICDETAIL = function(label,
    tags, contentType) {
  var previewpane = goog.dom.getElement('previewpane');
  var tags_text = goog.dom.getElement('tags');
  var typecombo = goog.dom.getElement('typecombo');
  var filename = goog.dom.getElement('filename');
  var thumbnail = goog.dom.getElement('thumbnail');
  var update_info = goog.dom.getElement('update_info');
  filename.innerText = label;
  typecombo.value = '';
 if (good.drive.role.Role.USERNAME != good.constants.ADMIN) {
   tags_text.disabled = 'true';
   typecombo.disabled = 'ture';
   update_info.disabled = 'true';
  }
  thumbnail.src = './good/images/folder.png';
  thumbnail.style.width = '80%';
  thumbnail.style.height = '80%';
  var tagdata = '';
  goog.array.forEach(tags.asArray(), function(item) {
    tagdata += item + ',';
  });
  tags_text.value = tagdata.substr(0, tagdata.lastIndexOf(','));
  if (contentType != undefined) {
    if (contentType.indexOf('image/') != -1) {
      typecombo.value = 'image/';
    } else {
      typecombo.value = contentType;
    }
  }
  previewpane.style.display = 'block';
};
