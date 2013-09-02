'use strict';
goog.provide('good.drive.nav.folders.Path');

goog.require('good.drive.nav.folders.AbstractControl');

/**
 * Path Control 单例
 * @constructor
 * @param {string} str
 * @extends {good.drive.nav.folders.AbstractControl}
 */
good.drive.nav.folders.Path = function(str) {
  good.drive.nav.folders.AbstractControl.call(this, str);
  this.pathHeap = {};
  this.currentView = undefined;
  this.currentDocId = undefined;
  this.path = undefined;
  this.root = undefined;
  this._isParent = false;
  this.mod = undefined;
};
goog.inherits(good.drive.nav.folders.Path,
    good.drive.nav.folders.AbstractControl);

/**
 * @type {good.drive.nav.folders.Path}
 */
good.drive.nav.folders.Path.INSTANCE;

/**
 * path的数据结构
 * @enum {string}
 */
good.drive.nav.folders.Path.NameType = {
    PATH: 'path',
    PLAYFILE: 'playfile',
    CURRENTPATH: 'currentpath',
    CURRENTDOCID: 'currentdocid',
    DRAGDROP: 'dragdrop',
    DRAGDATA: 'dragdata',
    DROPDATA: 'dropdata',
    DRAGTARGET: 'dragtarget',
    DROPTARGET: 'droptarget',
    DRAGDOCID: 'dragdocid',
    DROPDOCID: 'dropdocid',
    ISDRAGOVER: 'isdragover',
    SELECT: 'select'
};

/**
 * 获取一个Paht的实例
 * @return {good.drive.nav.folders.Path}
 */
good.drive.nav.folders.Path.getINSTANCE = function() {
  if (good.drive.nav.folders.Path.INSTANCE == undefined) {
    good.drive.nav.folders.Path.INSTANCE =
      new good.drive.nav.folders.Path(good.constants.PATHDOCID);
  }
  return good.drive.nav.folders.Path.INSTANCE;
};

/**
 * 初始化的回调
 * @override
 */
good.drive.nav.folders.Path.prototype.connect = function(doc) {
  var root = doc.getModel().getRoot();
  var path = root.get(this.pathNameType().PATH);
  this.root = root;
  this.path = path;
  var that = this;
  root.addValueChangedListener(function(evt) {
    var property = evt.getProperty();
    if (property != that.pathNameType().PATH) {
      return;
    }
    var newValue = evt.getNewValue();
    that.path = newValue;
    that.locationPath(newValue);
  });
  goog.object.forEach(this.pathHeap, function(value, key) {
    var docid = path[that.pathNameType().CURRENTDOCID];
    value.initPath(that.path, that.root, that.initCallBack);
  });
  this.hasPathProperty_();
  this.pathload();
  this.locationPath(path);
  this.dragdropEvent();
  root.set(this.pathNameType().SELECT, 0);
};

/**
 * 这个方法是在Path初始化结束后回调 用来保证某些依赖Path不会发生错误
 */
good.drive.nav.folders.Path.prototype.pathload = function() {
};

/**
 * 界面拖动处理
 */
good.drive.nav.folders.Path.prototype.dragdropEvent = function() {
  var that = this;
  var dragdrop = this.root.get(this.pathNameType().DRAGDROP);
  if (dragdrop == undefined) {
    dragdrop = this.initDragDrop();
    this.root.set(this.pathNameType().DRAGDROP, dragdrop);
  }
  dragdrop.addValueChangedListener(function(evt) {
    var property = evt.getProperty();
    if (property != that.pathNameType().ISDRAGOVER) {
      return;
    }
    var isDragover = evt.getNewValue();
    if (isDragover != 1) {
      return;
    }
    dragdrop.set(that.pathNameType().ISDRAGOVER, 0);
    var dragData = dragdrop.get(that.pathNameType().DRAGDATA);
    var dropData = dragdrop.get(that.pathNameType().DROPDATA);
    if (dragData == 'root' || dragData == dropData) {
      return;
    }
    var dragDocid = dragdrop.get(that.pathNameType().DRAGDOCID);
    var dropDocid = dragdrop.get(that.pathNameType().DROPDOCID);
    var dragTarget = dragdrop.get(that.pathNameType().DRAGTARGET);
    var dropTarget = dragdrop.get(that.pathNameType().DROPTARGET);
    var dragModel;
    var dropModel;
    if (dragDocid == dropDocid) {
      dragModel = dropModel = goog.object.get(
          good.drive.nav.folders.AbstractControl.docs, dragDocid);
      var _dragData = dragModel.getObject(dragData);
      that.isParent(dragModel.mod(), dropTarget, dragData);
      if (that._isParent) {
        that._isParent = false;
        return;
      }
      var _dropdata = dragModel.getObject(dropData);
      var _dropTarget = dragModel.getObject(dropTarget);
      var _dragTarget = dragModel.getObject(dragTarget);
      var copy = dropModel.copy(dropModel.mod(), _dragData);
      dropModel.remove(_dragData);
      _dragTarget.removeValue(_dragData);
      _dropTarget.push(copy);
    } else {
      dragModel = goog.object.get(
          good.drive.nav.folders.AbstractControl.docs, dragDocid);
      dropModel = goog.object.get(
          good.drive.nav.folders.AbstractControl.docs, dropDocid);
    }
  });
};

/**
 * 判断一个对象是否是包含在这个对象的中
 * @param {good.realtime.Model} mod
 * @param {string} id
 * @param {string} targetId
 */
good.drive.nav.folders.Path.prototype.isParent = function(mod, id, targetId) {
  if (id == targetId) {
    this._isParent = true;
    return;
  }
  if (id == 'root') {
    return;
  }
  var ids = mod.getParents(id);
  var that = this;
  goog.array.forEach(ids, function(_id) {
    that.isParent(mod, _id, targetId);
  });
};

/**
 * 用来定位一个Path
 * @param {Object} path
 */
good.drive.nav.folders.Path.prototype.locationPath = function(path) {
  var docids = goog.object.getKeys(
      this.pathHeap);
  if (!goog.array.contains(docids, path[this.pathNameType().CURRENTDOCID])) {
    return;
  }
  if (goog.array.isEmpty(
      path[this.pathNameType().CURRENTPATH])) {
    return;
  }
  var docid = path[this.pathNameType().CURRENTDOCID];
  var view = this.getPathViewByDocId(docid);
  goog.object.forEach(this.pathHeap, function(value, key) {
//    if (view == value) {
//      return;
//    }
    value.recovery();
  });
  view.location(path[this.pathNameType().CURRENTPATH]);
};

/**
 * 验证当前Path结构的有效性
 * @private
 */
good.drive.nav.folders.Path.prototype.hasPathProperty_ = function() {
  var pathlist = this.path[this.pathNameType().CURRENTPATH];
  var docid = this.path[this.pathNameType().CURRENTDOCID];
  if (pathlist == undefined) {
    this.path[this.pathNameType().CURRENTPATH] = [];
  }
  if (docid == undefined) {
    this.path[this.pathNameType().CURRENTDOCID] = '';
  }
  if (this.root.get(this.pathNameType().PLAYFILE) == undefined) {
    this.root.set(this.pathNameType().PLAYFILE,
        this.model().mod().createList());
  }
};

/**
 * 获取当前的docid
 * @return {string}
 */
good.drive.nav.folders.Path.prototype.getCurrentDocid = function() {
  return this.root.get(
      this.pathNameType().PATH)[this.pathNameType().CURRENTDOCID];
};

/**
 * 获取当前的path路劲
 * @return {Object}
 */
good.drive.nav.folders.Path.prototype.getCurrentData = function() {
  var path = this.root.get(this.pathNameType().PATH);
  var pathlist = path[this.pathNameType().CURRENTPATH];
  if (pathlist.length == 0) {
    return null;
  }
  var dataid = pathlist[pathlist.length - 1];
  var docid = path[this.pathNameType().CURRENTDOCID];
  var model = goog.object.get(
      good.drive.nav.folders.AbstractControl.docs, docid);
  return model.getObject(dataid);
};

/**
 * 将一个docid和一个View绑定起来
 * @param {string} docId
 * @param {Object} view
 */
good.drive.nav.folders.Path.prototype.addPath = function(docId, view) {
  if (this.containPathByDocId(docId)) {
    return;
  }
  goog.object.add(this.pathHeap, docId, view);
};

/**
 * 通过docid获取一个View
 * @param {string} docId
 * @return {Object}
 */
good.drive.nav.folders.Path.prototype.getViewBydocId = function(docId) {
  if (!goog.object.containsKey(this.pathHeap, docId)) {
    return null;
  }
  return goog.object.get(this.pathHeap, docId);
};

/**
 * 用于初始化后的回调
 * @param {string} docId
 */
good.drive.nav.folders.Path.prototype.initCallBack = function(docId) {
  var pathcontrol = good.drive.nav.folders.Path.getINSTANCE();
//  pathcontrol.path.set(
//      good.drive.nav.folders.Path.NameType.CURRENTDOCID, docId);
  pathcontrol.currentDocId = docId;
//  pathcontrol.
//  path[good.drive.nav.folders.Path.NameType.CURRENTDOCID] = docId;
};

/**
 * 通过一个docid返回这个docid是否有绑定的View
 * @param {string} docId
 * @return {boolean}
 */
good.drive.nav.folders.Path.prototype.containPathByDocId = function(docId) {
  if (goog.object.containsKey(this.pathHeap, docId)) {
    return true;
  }
  return false;
};

/**
 * 通过一个docid获取View
 * @param {string} docId
 * @return {Object}
 */
good.drive.nav.folders.Path.prototype.getPathViewByDocId = function(docId) {
  if (!this.containPathByDocId(docId)) {
    return null;
  }
  return goog.object.get(this.pathHeap, docId);
};

/**
 * 将一个新的path替换原来旧的path
 * @param {Object} newPath
 */
good.drive.nav.folders.Path.prototype.putNewPath =
  function(newPath) {
  this.root.set(this.pathNameType().PATH, newPath);
};

/**
 * 通过docid和pathlist的方式来替换旧的path
 * @param {string} docid
 * @param {Object} pathlist
 */
good.drive.nav.folders.Path.prototype.putDocidAndPathList =
  function(docid, pathlist) {
  var newPath = {};
  newPath[this.pathNameType().CURRENTDOCID] = docid;
  newPath[this.pathNameType().CURRENTPATH] = pathlist;
  this.root.set(this.pathNameType().PATH, newPath);
};

/**
 * 初始化Path的数据
 * @override
 */
good.drive.nav.folders.Path.prototype.initdata = function(mod) {
  var root = mod.getRoot();
//  var path = mod.createMap();
//  path.set(this.pathNameType().CURRENTPATH, mod.createList());
//  path.set(this.pathNameType().CURRENTDOCID, '');
  var path = {'currentpath': [],
      'currentdocid': ''};
  root.set(this.pathNameType().PATH, path);
  root.set(this.pathNameType().PLAYFILE, mod.createList());
  root.set(this.pathNameType().PATH, path);
  root.set(this.pathNameType().SELECT, 0);
};

/**
 * 初始化拖拽的数据
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Path.prototype.initDragDrop = function() {
  var mod = this.model().mod();
  var map = mod.createMap();
  map.set(this.pathNameType().DRAGDATA, '');
  map.set(this.pathNameType().DROPDATA, '');
  map.set(this.pathNameType().DRAGTARGET, '');
  map.set(this.pathNameType().DROPTARGET, '');
  map.set(this.pathNameType().DRAGDOCID, '');
  map.set(this.pathNameType().DROPDOCID, '');
  map.set(this.pathNameType().ISDRAGOVER, 0);
  return map;
};

/**
 * @return {Object}
 */
good.drive.nav.folders.Path.prototype.pathNameType = function() {
  return good.drive.nav.folders.Path.NameType;
};
