'use strict';
goog.provide('good.drive.nav.folders.PublicViewControl');

goog.require('good.drive.nav.folders.ViewControl');

/**
 * @constructor
 * @param {string} title
 * @param {string} docid
 * @extends {good.drive.nav.folders.ViewControl}
 */
good.drive.nav.folders.PublicViewControl = function(title, docid) {
  good.drive.nav.folders.ViewControl.call(this, title, docid);
  this._title = title;
};
goog.inherits(good.drive.nav.folders.PublicViewControl,
    good.drive.nav.folders.ViewControl);

/**
 * @override
 */
good.drive.nav.folders.PublicViewControl.prototype.initdata = function(mod) {
  var root_ = mod.getRoot();

  var rootFolders = mod.createList();
  root_.set('folders', rootFolders);
  var query = mod.createMap();
  var tags = mod.createList();
  query.set('tags', tags);
  query.set('contentType', '');
  root_.set('query', query);

  var folder;
  var subFolders;
  var subFolder;

  var fieldArray = new Array('语言', '数学', '科学', '社会', '健康', '艺术');
  var gradeArray = new Array('大班', '中班', '小班');
  var folders = [];
  goog.array.forEach(fieldArray, function(e) {
    folder = mod.createMap();
    folder.set('label', e);
    folder.set('folders', mod.createList());
    var query = mod.createMap();
    var tags = mod.createList();
    tags.push(e);
    query.set('tags', tags);
    query.set('contentType', '');
    root_.set('query', query);
    folders.push(folder);
  });
  rootFolders.pushAll(folders);

  for (var i = 0; i < fieldArray.length; i++) {
    subFolders = folders[i].get(this.getKeyType().FOLDERS);
  goog.array.forEach(gradeArray, function(e) {
    subFolder = mod.createMap();
    subFolder.set('label', e);
    subFolder.set('folders', mod.createList());
    var query = mod.createMap();
    var tags = mod.createList();
    tags.push(fieldArray[i]);
    tags.push(e);
    query.set('tags', tags);
    query.set('contentType', '');
    subFolder.set('query', query);
    subFolders.push(subFolder);
  });
  }
};
