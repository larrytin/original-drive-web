'use strict';
goog.provide('good.drive.view.baseview.Cell');

goog.require('goog.dom.classes');
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.Component');

/**
 * @param {good.realtime.CollaborativeMap} data
 * @param {Object} keytype
 * @param {Object} defaultConfig
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.ui.Component}
 */
good.drive.view.baseview.Cell =
  function(data, keytype, defaultConfig, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.data = data;
  this.defaultConfig = defaultConfig;
  this.keytype = keytype;
  this.isFolder_ = undefined;
  this.selected_ = false;
};
goog.inherits(good.drive.view.baseview.Cell, goog.ui.Component);


/** */
good.drive.view.baseview.Cell.prototype.renderCell = function() {
};


/** @override */
good.drive.view.baseview.Cell.prototype.enterDocument = function() {
  good.drive.view.baseview.Cell.superClass_.enterDocument.call(this);
  this.attachEvents_();
};


/** @override */
good.drive.view.baseview.Cell.prototype.exitDocument = function() {
  good.drive.view.baseview.Cell.superClass_.exitDocument.call(this);
  this.detachEvents_();
};

/**
 * @return {boolean}
 */
good.drive.view.baseview.Cell.prototype.isFolder = function() {
  return this.isFolder_;
};

/**
 * @param {boolean} isFolder
 */
good.drive.view.baseview.Cell.prototype.setIsFolder = function(isFolder) {
  this.isFolder_ = isFolder;
};

/**
 * @private
 */
good.drive.view.baseview.Cell.prototype.attachEvents_ = function() {
  var el = this.getElement();

  this.getHandler().
      listen(el, goog.events.EventType.MOUSEOVER, this.handleKeyEvent).
      listen(el, goog.events.EventType.MOUSEOUT, this.handleKeyEvent).
      listen(el, goog.events.EventType.MOUSEDOWN, this.handleKeyEvent).
      listen(el, goog.events.EventType.CLICK, this.clickHandle);
};

/**
 */
good.drive.view.baseview.Cell.prototype.select = function() {
  var view = this.getParent();
  view.setSelectedItem(this);
};

/**
 * @param {boolean} selected
 */
good.drive.view.baseview.Cell.prototype.setSelectedInternal =
  function(selected) {
  if (this.selected_ == selected) {
    return;
  }
  this.selected_ = selected;
  var cellElm = this.getContentElement();
  cellElm.className = this.defaultConfig.cssCellRoot;
};

/**
 * @private
 */
good.drive.view.baseview.Cell.prototype.detachEvents_ = function() {

};

/**
 * @param {goog.events.BrowserEvent} e
 */
good.drive.view.baseview.Cell.prototype.handleKeyEvent = function(e) {
};

/**
 * @param {goog.events.BrowserEvent} e
 */
good.drive.view.baseview.Cell.prototype.clickHandle = function(e) {
};

/** @override */
good.drive.view.baseview.Cell.prototype.createDom = function() {
  var sb = new goog.string.StringBuffer();
  this.toHtml(sb);
  var element = this.getDomHelper().htmlToDocumentFragment(sb.toString());
  this.setElementInternal(/** @type {Element} */ (element));
};


/**
 * @param {goog.string.StringBuffer} sb
 */
good.drive.view.baseview.Cell.prototype.toHtml = function(sb) {
};
