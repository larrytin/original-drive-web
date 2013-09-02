'use strict';
goog.provide('good.drive.nav.folders.MyClassViewControl');

goog.require('good.drive.nav.folders.ViewControl');

/**
 * myclass的Document Control 继承自ViewControl
 * @constructor
 * @param {string} title
 * @param {string} docid
 * @extends {good.drive.nav.folders.ViewControl}
 */
good.drive.nav.folders.MyClassViewControl = function(title, docid) {
  good.drive.nav.folders.ViewControl.call(this, title, docid);
  this._title = title;
};
goog.inherits(good.drive.nav.folders.MyClassViewControl,
    good.drive.nav.folders.ViewControl);

/**
 * 获取数据结构
 * @override
 */
good.drive.nav.folders.MyClassViewControl.prototype.getKeyType = function() {
  return {LABEL: ['label', 'string'], FOLDERS: ['folders', 'list'],
    FILES: ['files', 'list'], ISCLASS: ['isclass', 'boolean', false]};
};

/**
 * @override
 */
good.drive.nav.folders.MyClassViewControl.prototype.initdata = function(mod) {
  var root_ = mod.getRoot();

  var rootFolders = mod.createList();
  var rootFiles = mod.createList();
  root_.set(this.getKeyType().FOLDERS[0],
      rootFolders);
  root_.set(this.getKeyType().FILES[0],
      rootFiles);
};
