'use strict';
goog.provide('good.drive.nav.folders.AbstractControl');

goog.require('good.drive.nav.folders.Model');

/**
 * 一个包装了Model的基类 用来和界面进行交互
 * @constructor
 * @param {string} str
 */
good.drive.nav.folders.AbstractControl = function(str) {
  var that = this;
  if (str != undefined) {
    var model = new good.drive.nav.folders.Model(str);
    if (goog.object.get(good.drive.nav.folders.AbstractControl.docs,
        str) == undefined) {
      goog.object.add(good.drive.nav.folders.AbstractControl.docs, str, model);
    }
    model.connect = function(doc) {
      that.connect(doc);
    };
    model.initdata = function(mod) {
      that.initdata(mod);
    };
    that._model = model;
  }
};

/**
 * 获取一个Model的队列 然后有序得按照队列的顺序加载docment
 */
good.drive.nav.folders.AbstractControl.linkload = function() {
  var models = goog.object.getValues(
      good.drive.nav.folders.AbstractControl.docs);
  var count = goog.array.count(models, function() {
    return true;
  });
  var fristModel = undefined;
  goog.array.forEach(models, function(model, index, arr) {
    if (index == 0) {
      model.load();
    }
    model.loadOther = function() {
      var otherModel = good.drive.nav.folders.AbstractControl.hasModel(
          models, index + 1, count);
      if (otherModel == null) {
        return;
      }
      otherModel.load();
    };
  });
};

/**
 * 判断是否队列总还有下一个Model
 * @param {Array.<Object>} models
 * @param {number} idx
 * @param {number} count
 * @return {good.drive.nav.folders.Model}
 */
good.drive.nav.folders.AbstractControl.hasModel = function(models, idx, count) {
  if (count <= idx) {
    return null;
  }
  return models[idx];
};

/** @type {Object} */
good.drive.nav.folders.AbstractControl.docs = {};

/**
 * 加载Document完毕后回调
 * @param {good.realtime.Document} doc
 */
good.drive.nav.folders.AbstractControl.prototype.connect = function(doc) {
};

/**
 * 在首次加载Document的时候回调
 * @param {good.realtime.Model} mod
 */
good.drive.nav.folders.AbstractControl.prototype.initdata = function(mod) {
};

/**
 * 获取Model
 * @return {good.drive.nav.folders.Model}
 */
good.drive.nav.folders.AbstractControl.prototype.model = function() {
  return this._model;
};
