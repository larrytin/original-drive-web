'use strict';
goog.provide('good.drive.view.grid');

goog.require('good.drive.view.baseview');
goog.require('good.drive.view.grid.GridCell');

/**
 * @param {Object} data
 * @param {string} docid
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {good.drive.view.baseview.View}
 */
good.drive.view.grid.View = function(data, docid, opt_domHelper) {
  good.drive.view.baseview.View.call(this, data, docid, opt_domHelper);
};
goog.inherits(good.drive.view.grid.View,
    good.drive.view.baseview.View);

/** @override */
good.drive.view.grid.View.prototype.addChildAt = function(child, index,
    opt_render) {
  goog.asserts.assert(!child.getParent());

  good.drive.view.baseview.View.superClass_.addChildAt.call(this, child, index);

  if (this.getElement()) {
    var contentElm = this.getGridContainerElement();
    var sb = new goog.string.StringBuffer();
    child.createDom();
    goog.dom.appendChild(contentElm, child.getElement());
    child.enterDocument();
  }
};

/** @override */
good.drive.view.baseview.View.prototype.getGridContainerClassName = function() {
  return this.getConfig().cssGridContainer;
};

/** @override */
good.drive.view.grid.View.prototype.createCell = function(data) {
  return new good.drive.view.grid.GridCell(data,
      this.getKeyType(), this.getConfig());
};
