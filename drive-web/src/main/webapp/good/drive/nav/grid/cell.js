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
good.drive.nav.grid.Cell = function(data, defaultConfig, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  
  this.data = data;
  this.defaultConfig = defaultConfig;
};
goog.inherits(good.drive.nav.grid.Cell, goog.ui.Component);

/** @override */
good.drive.nav.grid.Cell.prototype.enterDocument = function() {
  good.drive.nav.grid.Cell.superClass_.enterDocument.call(this);
  this.attachEvents_();
};

good.drive.nav.grid.Cell.prototype.attachEvents_ = function() {
  var el = this.getElement();
  
  this.getHandler().
  listen(el, goog.events.EventType.MOUSEOVER, this.handleKeyEvent).
  listen(el, goog.events.EventType.MOUSEOUT, this.handleKeyEvent);
  
};

good.drive.nav.grid.Cell.prototype.handleKeyEvent = function(e) {
  var el = this.getElement();
  switch (e.type) {
    case goog.events.EventType.MOUSEOVER:
      if (!goog.dom.classes.has(el, this.defaultConfig.cssCellHover)) {
        goog.dom.classes.add(el,
            this.defaultConfig.cssCellHover);
      }
      break;
    case goog.events.EventType.MOUSEOUT:
      if (goog.dom.classes.has(el, this.defaultConfig.cssCellHover)) {
        goog.dom.classes.remove(el,
            this.defaultConfig.cssCellHover);
      }
      break;
  }
};

/** @override */
good.drive.nav.grid.Cell.prototype.createDom = function() {
  var sb = new goog.string.StringBuffer();
  this.toHtml(sb);
  var element = this.getDomHelper().htmlToDocumentFragment(sb.toString());
  this.setElementInternal(/** @type {Element} */ (element));
};

good.drive.nav.grid.Cell.prototype.toHtml = function(sb) {
  sb.append('<div class="',
      this.defaultConfig.cssCellRoot, '" id="', this.getId(), '">',
      '<div><div class="gv-dynamic-thumbnail" style="width: 249px; height: 255px">',
      this.getImageHtml(), this.getLabelHtml(), '</div></div></div>');
};

good.drive.nav.grid.Cell.prototype.getThumbnailElement = function() {
  var el = this.getElement();
  return el ? /** @type {Element} */ (el.firstChild.firstChild) : null;
}

good.drive.nav.grid.Cell.prototype.getImageBottonElement = function() {
  var el = this.getImageElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
}

good.drive.nav.grid.Cell.prototype.getImageHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="', this.getImageClassName(), '">', 
      '<div class="gv-view-bottom"><div class="gv-view-center">',
      '<div class="gv-selection">', this.getImageContainerHtml(),
      '</div></div></div></div>');
  return sb.toString();
};

good.drive.nav.grid.Cell.prototype.getImageElement = function() {
  var el = this.getThumbnailElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};

good.drive.nav.grid.Cell.prototype.getImageClassName = function() {
  return this.defaultConfig.cssCellImage;
};

good.drive.nav.grid.Cell.prototype.getImageContainerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getImageContainerClassName(),
  '"></div>');
  return sb.toString();
};

good.drive.nav.grid.Cell.prototype.getImageContainerElement = function() {
  var el = this.getImageBottonElement();
  return el ? /** @type {Element} */ (el.firstChild.firstChild.firstChild) : null;
};

good.drive.nav.grid.Cell.prototype.getImageContainerClassName = function() {
  return this.defaultConfig.cssCellImageContainer;
};

good.drive.nav.grid.Cell.prototype.getLabelHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getLabelClassName(),
  '"></div>');
  return sb.toString();
};

good.drive.nav.grid.Cell.prototype.getLabelElement = function() {
  var el = this.getThumbnailElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};

good.drive.nav.grid.Cell.prototype.getLabelClassName = function() {
  return this.defaultConfig.cssCellLabel;
};

good.drive.nav.grid.Cell.prototype.setLabel = function(dom) {
  this.getLabelHtml().innerHTML = dom;
};