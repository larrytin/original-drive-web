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
    that.initdata(mod);
  };
  
  this._docId = str;
  
  this.isloaded = false;

  var onLoad = function(doc) {
    that.isloaded = true;
    that.doc = doc;
    that.mod = that.doc.getModel();
    that.root = that.mod.getRoot();
    that.path = that.root.get(good.drive.nav.folders.Model.strType.PATH);

    // connectUi();
    that.connect(doc);
  };
  good.realtime.load('@tmp/' + good.auth.Auth.current.userId +
      '/' + this._docId, onLoad, onInit, null);
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
 * @return {boolean}
 */
good.drive.nav.folders.Model.prototype.isloaded = function() {
  return this.isloaded;
};

/**
 * @param {boolean} isloaded
 */
good.drive.nav.folders.Model.prototype.setIsloaded = function(isloaded) {
  this.isloaded = isloaded;
};

/**
 * @param {good.realtime.Model} mod
 */
good.drive.nav.folders.Model.prototype.initdata = function(mod) {
};

/**
 * @param {good.realtime.CollaborativeList} list
 * @param {Array.<good.realtime.CollaborativeMap>} children
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
 * @return {string}
 */
good.drive.nav.folders.Model.prototype.docId = function() {
  return this._docId;
};

/**
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Model.prototype.getData = function() {
  return this.root;
};
