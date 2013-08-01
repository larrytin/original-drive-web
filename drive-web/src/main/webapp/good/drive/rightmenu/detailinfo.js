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

/**
 * @param {Function} handle
 */
good.drive.rightmenu.DetailInfo.prototype.update = function(handle) {
  var fieldcombo = goog.dom.getElement('fieldcombo');
  var gradecombo = goog.dom.getElement('gradecombo');
  var typecombo = goog.dom.getElement('typecombo'); 
  var fileId_Txt = goog.dom.getElement('fileId');
  var fileId = fileId_Txt.value;
  var tags = new Array();
  if (fieldcombo.value != '') {
    tags.push(fieldcombo.value);
  }
  if (gradecombo.value != '') {
    tags.push(gradecombo.value);
  }
  this.updatefile(fileId, tags, typecombo.value, handle);
};

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
         if (content_Type != null && content_Type != '') {
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
