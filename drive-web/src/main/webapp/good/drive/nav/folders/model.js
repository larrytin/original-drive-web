'use strict';
goog.provide('good.drive.nav.folders.model');

goog.require('good.drive.nav.folders.view');

good.drive.nav.folders.Model = function(view) {
  this.view = view;
};

good.drive.nav.folders.Model.prototype.connect = function(doc) {
  this.doc = doc;
  this.mod = doc.getModel();
  this.root = mod.getRoot();
  var folders = this.root.get('folders');
  this.addEventListener({
    dom : this.view.tree.rootDom}, folders);
};

good.drive.nav.folders.Model.prototype.addEventListener = function(parentDom, list) {
  var that = this;
  var childrenDoms = [];
  list.addValuesAddedListener(function(evt) {
    var idx = evt.getIndex();
    var vals = evt.getValues();
    for ( var i in vals) {
      childrenDoms[i].dom = that.view.insertNode(parentDom.dom, idx + i, vals[i]);
    }
  });
  for ( var i = 0, len = list.length(); i < len; i++) {
    var children = list.get(i).get(1);
    childrenDoms[i] = {};
    this.addEventListener(childrenDoms[i], children);
  }
};
