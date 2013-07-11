'use strict';
goog.provide('good.drive.nav.grid.Cell');

goog.require('goog.dom.classes');
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.Component');



/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.ui.Component}
 */
good.drive.nav.grid.Cell = function(opt_domHelper, defaultConfig, data) {
  goog.ui.Component.call(this, opt_domHelper);
  
  this.data = data;
  this.defaultConfig = defaultConfig;
};
goog.inherits(good.drive.nav.grid.View, goog.ui.Component);

/** @override */
good.drive.nav.grid.View.prototype.enterDocument = function() {
  good.drive.nav.grid.View.superClass_.enterDocument.call(this);
  var el = this.getElement();
  el.className = this.getConfig().cssRoot;
};

/** @override */
good.drive.nav.grid.View.prototype.createDom = function() {
  var sb = new goog.string.StringBuffer();
  this.toHtml(sb);
  var element = this.getDomHelper().htmlToDocumentFragment(sb.toString());
  this.setElementInternal(/** @type {Element} */ (element));
};