'use strict';
goog.provide('good.drive.creation.fileupload');


goog.require('good.drive.nav.folders.Model');
goog.require('goog.dom');
goog.require('goog.events');



/**
 * @constructor
 */
good.drive.creation.Fileupload = function() {
  var filepath = goog.dom.getElement('file');

  this._file = filepath;
};


/**
 *
 */
good.drive.creation.Fileupload.prototype.fileClick = function() {
  this._file.click();
};


/**
 * @param {good.drive.nav.folders.Tree} tree
 */
good.drive.creation.Fileupload.prototype.fileChange = function(tree) {
  var that = this;
  goog.events.listen(that._file,
      goog.events.EventType.CHANGE,
      function(e) {
        var files = that._file.files;
        if (!files.length) {
          alert('请选择文件。');
          return false;
        }
        var selected = tree.getCurrentItem();
        var mod = new good.drive.nav.folders.Model();
        var filelst = selected.file;
        for (var i = 0; i < files.length; i++) {
          var filename = files[i].name;
          var map = mod.getLeaf(filename);
          filelst.push(map);
        }

      });
};
