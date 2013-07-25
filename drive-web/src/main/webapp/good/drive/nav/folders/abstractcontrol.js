'use strict';
goog.provide('good.drive.nav.folders.AbstractControl');

goog.require('good.drive.nav.folders.Model');

/**
 * @constructor
 * @param {string} str
 * @param {number} level
 */
good.drive.nav.folders.AbstractControl = function(str, level) {
  var that = this;
  if (level == undefined) {
    level = 0;
  }
  setTimeout(function() {
    var model = new good.drive.nav.folders.Model(str);
    goog.object.add(good.drive.nav.folders.AbstractControl.docs, str, model);
    model.connect = function(doc) {
      that.connect(doc);
    };
    model.initdata = function(mod) {
      that.initdata(mod);
    };
    that._model = model;
  }, good.drive.nav.folders.AbstractControl.syncTime * level);
};

good.drive.nav.folders.AbstractControl.syncTime = 200;

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
