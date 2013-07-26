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
goog.inherits(good.drive.nav.folders.PublicViewControl, good.drive.nav.folders.ViewControl);

/**
 * @override
 */
good.drive.nav.folders.PublicViewControl.prototype.initdata = function(mod) {
};
