'use strict';
goog.provide('good.drive.nav.folders.Model');

/**
 * @constructor
 * @param {string} str
 */
good.drive.nav.folders.Model = function(str) {
//  this.view = view;

  window.modelbak = this;
  var that = this;
  var onInit = function(mod) {
    that.initmap(mod);
  };

  var onLoad = function(doc) {
    that.doc = doc;
    that.mod = that.doc.getModel();
    that.root = that.mod.getRoot();
    that.path = that.root.get(good.drive.nav.folders.Model.strType.PATH);

    // connectUi();
    that.connect(doc);
  };
  good.realtime.load('@tmp/' + good.auth.Auth.current.userId +
      '/' + str, onLoad, onInit, null);
};

/**
 * @enum {string}
 */
good.drive.nav.folders.Model.strType = {
  LABEL: 'label',
  FOLDERS: 'folders',
  FOLDERSCHILD: 'folderschild',
  FILECHILD: 'filechild',
  PATH: 'path'
};

/** @type {string} */
good.drive.nav.folders.Model.BASEDATA = ['我的课件', '我的音乐', '我的视频', '我的图片'];

/**
 * @param {good.realtime.Document} doc
 */
good.drive.nav.folders.Model.prototype.connect = function(doc) {
};

/**
 * @param {good.realtime.CollaborativeList} list
 * @param {Array.<Object>} children
 */
good.drive.nav.folders.Model.prototype.pushAll = function(list, children) {
  list.pushAll(children);
};

/**
 * @param {good.realtime.CollaborativeList} list
 * @param {good.realtime.CollaborativeMap} map
 */
good.drive.nav.folders.Model.prototype.push = function(list, map) {
  list.push(map);
};

/**
 * @param {good.realtime.CollaborativeList} list
 * @param {number} idx
 */
good.drive.nav.folders.Model.prototype.removeChildByIdx = function(list, idx) {
  list.remove(idx);
};


/**
 * @param {good.realtime.CollaborativeList} list
 * @param {number} idx
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Model.prototype.getChildByIdx = function(list, idx) {
  return list.get(idx);
};

/**
 * @param {good.realtime.CollaborativeMap} map
 * @param {string} str
 */
good.drive.nav.folders.Model.prototype.renameLabel = function(map, str) {
  map.set(good.drive.nav.folders.Model.strType.LABEL, str);
};

/**
 * @param {good.realtime.CollaborativeList} list
 */
good.drive.nav.folders.Model.prototype.clear = function(list) {
  list.clear();
};

/**
 * @param {string} str
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Model.prototype.getLeaf =
    function(str) {
  var map = this.mod.createMap();
  map.set(good.drive.nav.folders.Model.strType.LABEL,
      str);
  var list = this.mod.createList();
  map.set(good.drive.nav.folders.Model.strType.FOLDERSCHILD,
      list);
  list = this.mod.createList();
  map.set(good.drive.nav.folders.Model.strType.FILECHILD,
      list);

  return map;
};

/**
 * @param {string} name
 * @param {string} url
 * @param {string} type
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Model.prototype.getfileMap =
    function(name, url, type) {
  var map = this.mod.createMap();
  map.set(good.drive.nav.folders.Model.strType.LABEL,
      name);
  map.set('url', url);
  map.set('type', type);
  map.set('process', '');
  map.set('isoffline', '');
  return map;
};

/**
 * @param {good.realtime.Model} mod
 */
good.drive.nav.folders.Model.prototype.initmap = function(mod) {
  var name = good.drive.nav.folders.Model.BASEDATA;
  var root_ = mod.getRoot();

  var rootFolders = mod.createList();
  var rootFiles = mod.createList();
  root_.set(good.drive.nav.folders.Model.strType.FOLDERSCHILD,
      rootFolders);
  root_.set(good.drive.nav.folders.Model.strType.FILECHILD,
      rootFiles);
//  var pathList = mod.createList();
//  pathList.push(root_);
  root_.set(good.drive.nav.folders.Model.strType.PATH, mod.createList());
  root_.set(good.drive.nav.folders.Model.strType.LABEL, '我的资料库');

  var folder;
  var subFolders;
  var subFolder;

  var folders = [];
  for (var i in name) {
    folder = mod.createMap();
    folder.set(good.drive.nav.folders.Model.strType.LABEL, name[i]);
    folder.set(good.drive.nav.folders.Model.strType.FOLDERSCHILD,
        mod.createList());
    folder.set(good.drive.nav.folders.Model.strType.FILECHILD,
        mod.createList());
    folders.push(folder);
  }
  rootFolders.pushAll(folders);

  for (var i in name) {
    subFolders = folders[i].get(
        good.drive.nav.folders.Model.strType.FOLDERSCHILD);
    for (var j in name) {
      subFolder = mod.createMap();
      subFolder.set(good.drive.nav.folders.Model.strType.FOLDERSCHILD,
          mod.createList());
      subFolder.set(good.drive.nav.folders.Model.strType.FILECHILD,
          mod.createList());
      subFolder.set(good.drive.nav.folders.Model.strType.LABEL,
          name[i] + j);
      subFolders.push(subFolder);
    }
  }
};

/**
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Model.prototype.getData = function() {
  return this.root;
};
