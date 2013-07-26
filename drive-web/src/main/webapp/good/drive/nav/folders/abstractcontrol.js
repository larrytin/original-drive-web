'use strict';
goog.provide('good.drive.nav.folders.AbstractControl');

goog.require('good.drive.nav.folders.Model');

/**
 * @constructor
 * @param {string} str
 */
good.drive.nav.folders.AbstractControl = function(str) {
  var that = this;
    var model = new good.drive.nav.folders.Model(str);
    goog.object.add(good.drive.nav.folders.AbstractControl.docs, str, model);
    model.connect = function(doc) {
      that.connect(doc);
    };
    model.initdata = function(mod) {
      that.initdata(mod);
    };
    that._model = model;
};

good.drive.nav.folders.AbstractControl.linkload = function() {
  var models = goog.object.getValues(good.drive.nav.folders.AbstractControl.docs);
  var count = goog.array.count(models, function() {
    return true;
  });
  var fristModel = undefined;
  goog.array.forEach(models, function(model, index, arr) {
    if (index == 0) {
      model.load();
    }
    model.loadOther = function() {
      var otherModel = good.drive.nav.folders.AbstractControl.hasModel(models, index + 1, count);
      if(otherModel == null) {
        return;
      }
      otherModel.load();
    };
  });
};

good.drive.nav.folders.AbstractControl.hasModel = function(models, idx, count) {
  if(count <= idx) {
    return null;
  }
  return models[idx];
};

good.drive.nav.folders.AbstractControl.docs = {};

/**
 * @param {good.realtime.Document} doc
 */
good.drive.nav.folders.AbstractControl.prototype.connect = function(doc) {
};

/**
 * @param {good.realtime.Model} mod
 */
good.drive.nav.folders.AbstractControl.prototype.initdata = function(mod) {
};

/**
 * @return {good.drive.nav.folders.Model}
 */
good.drive.nav.folders.AbstractControl.prototype.model = function() {
  return this._model;
};
