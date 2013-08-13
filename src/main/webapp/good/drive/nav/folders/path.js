'use strict';
goog.provide('good.drive.nav.folders.Path');

goog.require('good.drive.nav.folders.AbstractControl');

/**
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
};
goog.inherits(good.drive.nav.folders.Path,
    good.drive.nav.folders.AbstractControl);

/**
 * @type {good.drive.nav.folders.Path}
 */
good.drive.nav.folders.Path.INSTANCE;

/**
 * @enum {string}
 */
good.drive.nav.folders.Path.NameType = {
    PATH: 'path',
    CURRENTPATH: 'currentpath',
    CURRENTDOCID: 'currentdocid',
    DRAGDROP: 'dragdrop',
    DRAGDATA: 'dragdata',
    DROPDATA: 'dropdata',
    DRAGTARGET: 'droptarget',
    DROPTARGET: 'droptarget',
    DRAGDOCID: 'dragdocid',
    DROPDOCID: 'dropdocid',
    ISDRAGOVER: 'isdragover'
};

/**
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
};

/**
 */
good.drive.nav.folders.Path.prototype.pathload = function() {
};

/**
 */
good.drive.nav.folders.Path.prototype.dragdropEvent = function() {
  var that = this;
  var dragdrop = this.root.get(this.pathNameType().DRAGDROP);
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
    var dragModel;
    var dropModel;
    if (dragDocid == dropDocid) {
      dragModel = dropModel = goog.object.get(
          good.drive.nav.folders.AbstractControl.docs, dragDocid);
      var _dragData = dragModel.getObject(dragData);
      var parents = dragModel.mod().getParents(dropData);
      if (goog.array.contains(parents, _dragData.get('folders').getId())) {
        return;
      }
      var _dropData = dragModel.getObject(dropData);
      var _dragTarget = dragModel.getObject(dragTarget);
      var copy = dropModel.copy(dropModel.mod(), _dragData);
      dropModel.remove(_dragData);
      _dragTarget.removeValue(_dragData);
      _dropData.push(copy);
    } else {
      dragModel = goog.object.get(
          good.drive.nav.folders.AbstractControl.docs, dragDocid);
      dropModel = goog.object.get(
          good.drive.nav.folders.AbstractControl.docs, dropDocid);
    }
  });
};

/**
 * @param {Object} path
 */
good.drive.nav.folders.Path.prototype.locationPath = function(path) {
  var docids = goog.object.getKeys(
      this.pathHeap);
  if (docids.indexOf(path[this.pathNameType().CURRENTDOCID]) == -1) {
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
};

/**
 * @return {string}
 */
good.drive.nav.folders.Path.prototype.getCurrentDocid = function() {
  return this.root.get(
      this.pathNameType().PATH)[this.pathNameType().CURRENTDOCID];
};

/**
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
 * @param {Object} newPath
 */
good.drive.nav.folders.Path.prototype.putNewPath =
  function(newPath) {
  this.root.set(this.pathNameType().PATH, newPath);
};

/**
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
  var map = mod.createMap();
  map.set(this.pathNameType().DRAGDATA, '');
  map.set(this.pathNameType().DROPDATA, '');
  map.set(this.pathNameType().DRAGTARGET, '');
  map.set(this.pathNameType().DROPTARGET, '');
  map.set(this.pathNameType().DRAGDOCID, '');
  map.set(this.pathNameType().DROPDOCID, '');
  map.set(this.pathNameType().ISDRAGOVER, 0);
  root.set(this.pathNameType().DRAGDROP, map);
};

/**
 * @return {Object}
 */
good.drive.nav.folders.Path.prototype.pathNameType = function() {
  return good.drive.nav.folders.Path.NameType;
};
