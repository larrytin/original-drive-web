'use strict';
goog.provide('good.drive.nav.folders.Path');

goog.require('good.drive.nav.folders.AbstractControl');

/**
 * @constructor
 * @param {string} str
 * @extends {good.drive.nav.folders.AbstractControl}
 */
good.drive.nav.folders.Path = function(str) {
  good.drive.nav.folders.AbstractControl.call(this, str, 3);
  this.pathHeap = {};
  this.currentView = undefined;
  this.currentDocId = undefined;
  this.path = undefined;
  this.pathlist = undefined;
  this.root = undefined;
};
goog.inherits(good.drive.nav.folders.Path, good.drive.nav.folders.AbstractControl);

/**
 * @type {good.drive.nav.folders.Path}
 */
good.drive.nav.folders.Path.INSTANCE;

/**
 * @type {string}
 */
good.drive.nav.folders.Path.PATHDOCID = 'path24';

/**
 * @enum {string}
 */
good.drive.nav.folders.Path.NameType = {
    PATH: 'path',
    CURRENTPATH: 'currentpath',
    CURRENTDOCID: 'docid'
};
 
/**
 * @return {good.drive.nav.folders.Path}
 */
good.drive.nav.folders.Path.getINSTANCE = function() {
  if(good.drive.nav.folders.Path.INSTANCE == undefined) {
    good.drive.nav.folders.Path.INSTANCE =
      new good.drive.nav.folders.Path(good.drive.nav.folders.Path.PATHDOCID);
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
  this.pathlist = path.get(this.pathNameType().CURRENTPATH);
  var that = this;
  this.pathlist.addValuesAddedListener(function(evt) {
    if (that.pathlist.length() == 0) {
      return;
    }
    var docid = that.path.get(that.pathNameType().CURRENTDOCID);
    var view = that.getPathViewByDocId(docid);
    goog.object.forEach(that.pathHeap, function(value, key) {
      if (view == value) {
        return;
      }
      if('recovery' in value) {
        value.recovery();
      }
    });
    if('location' in view) {
      view.location(that.pathlist);
    }
  });
  
  goog.object.forEach(this.pathHeap, function(value, key) {
    if('initPath' in value) {
      var docid = path.get(that.pathNameType().CURRENTDOCID);
      value.initPath(that.pathlist, that.path, that.initCallBack);
    }
  });
  
  this.pathload();
};

good.drive.nav.folders.Path.prototype.pathload = function() {
  
};

/**
 * @param {string} docId
 * @param {Object} view
 */
good.drive.nav.folders.Path.prototype.addPath = function(docId, view) {
  if(this.containPathByDocId(docId)) {
    return;
  }
  goog.object.add(this.pathHeap, docId, view);
};

/**
 * @param {string} docId
 */
good.drive.nav.folders.Path.prototype.initCallBack = function(docId) {
  var pathcontrol = good.drive.nav.folders.Path.getINSTANCE();
  pathcontrol.path.set(
      good.drive.nav.folders.Path.NameType.CURRENTDOCID, docId);
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
  if(!this.containPathByDocId(docId)) {
    return null;
  }
  return goog.object.get(this.pathHeap, docId);
};

/**
 * @override
 */
good.drive.nav.folders.Path.prototype.initdata = function(mod) {
  var root = mod.getRoot();
  var path = mod.createMap();
  path.set(this.pathNameType().CURRENTPATH, mod.createList());
  path.set(this.pathNameType().CURRENTDOCID, '');
  
  root.set(this.pathNameType().PATH, path);
};

/**
 * @enum {string}
 */
good.drive.nav.folders.Path.prototype.pathNameType = function() {
  return good.drive.nav.folders.Path.NameType;
};
