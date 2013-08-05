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
  root_.set(good.constants.FOLDERS, rootFolders);
  var query = mod.createMap();
  var tags = mod.createList();
  tags.push('默认');
  query.set(good.constants.TAGS, tags);
  query.set(good.constants.CONTENTTYPE, '');
  root_.set('query', query);

  var folder;
  var subFolders;
  var subFolder;

  var fieldArray = good.constants.FIELDARRAY;
  var gradeArray = good.constants.GRADEARRAY;
  var folders = [];
  goog.array.forEach(fieldArray, function(e) {
    folder = mod.createMap();
    folder.set(good.constants.LABEL, e);
    folder.set(good.constants.FOLDERS, mod.createList());
    var query = mod.createMap();
    var tags = mod.createList();
    tags.push(e);
    query.set(good.constants.TAGS, tags);
    query.set(good.constants.CONTENTTYPE, '');
    folder.set(good.constants.QUERY, query);
    folders.push(folder);
  });
  rootFolders.pushAll(folders);

  for (var i = 0; i < fieldArray.length; i++) {
    subFolders = folders[i].get(this.getKeyType().FOLDERS[0]);
  goog.array.forEach(gradeArray, function(e) {
    subFolder = mod.createMap();
    subFolder.set(good.constants.LABEL, e);
    subFolder.set(good.constants.FOLDERS, mod.createList());
    var query = mod.createMap();
    var tags = mod.createList();
    tags.push(fieldArray[i]);
    tags.push(e);
    query.set(good.constants.TAGS, tags);
    query.set(good.constants.CONTENTTYPE, '');
    subFolder.set(good.constants.QUERY, query);
    subFolders.push(subFolder);
  });
  }
};
