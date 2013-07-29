'use strict';
goog.provide('good.drive.nav.grid.Cell');

goog.require('goog.dom.classes');
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.Component');

/**
 * @param {good.realtime.CollaborativeMap} data
 * @param {Object} defaultConfig
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.ui.Component}
 */
good.drive.nav.grid.Cell = function(data, defaultConfig, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);

  this.data = data;
  this.defaultConfig = defaultConfig;
  this.isFolder_ = undefined;
  this.selected_ = false;
};
goog.inherits(good.drive.nav.grid.Cell, goog.ui.Component);


/** */
good.drive.nav.grid.Cell.prototype.renderCell = function() {
  var label = this.data.get(
      good.drive.nav.folders.ViewControl.ViewControlType.LABEL);
  var labelElm = goog.dom.createDom('div',
      {'class': 'gv-view-name  dir=ltr'},
      goog.dom.createDom('div', {'dir': 'ltr'}, label));
  this.setLabel(labelElm);
};


/** @override */
good.drive.nav.grid.Cell.prototype.enterDocument = function() {
  good.drive.nav.grid.Cell.superClass_.enterDocument.call(this);
  this.attachEvents_();
};


/** @override */
good.drive.nav.grid.Cell.prototype.exitDocument = function() {
  good.drive.nav.grid.Cell.superClass_.exitDocument.call(this);
  this.detachEvents_();
};


/**
 * @return {boolean}
 */
good.drive.nav.grid.Cell.prototype.isFolder = function() {
  return this.isFolder_;
};

/**
 * @param {boolean} isFolder
 */
good.drive.nav.grid.Cell.prototype.setIsFolder = function(isFolder) {
  this.isFolder_ = isFolder;
};


/**
 * @private
 */
good.drive.nav.grid.Cell.prototype.attachEvents_ = function() {
  var el = this.getElement();

  this.getHandler().
      listen(el, goog.events.EventType.MOUSEOVER, this.handleKeyEvent).
      listen(el, goog.events.EventType.MOUSEOUT, this.handleKeyEvent).
      listen(el, goog.events.EventType.MOUSEDOWN, this.handleKeyEvent).
      listen(el, goog.events.EventType.CLICK, this.clickHandle);
};

good.drive.nav.grid.Cell.prototype.select = function() {
  var view = this.getParent();
  view.setSelectedItem(this);
}

good.drive.nav.grid.Cell.prototype.setSelectedInternal = function(selected) {
  if(this.selected_ == selected) {
    return;
  }
  this.selected_ == selected;
  
  var cellElm = this.getContentElement();
  cellElm.className = this.defaultConfig.cssCellRoot;
}

/**
 * @private
 */
good.drive.nav.grid.Cell.prototype.detachEvents_ = function() {

};


/**
 * @param {goog.events.BrowserEvent} e
 */
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
    case goog.events.EventType.MOUSEDOWN:
      this.select();
      break;
  }
};

/**
 * @param {goog.events.BrowserEvent} e
 */
good.drive.nav.grid.Cell.prototype.clickHandle = function(e) {
  if (!this.isFolder()) {
    return;
  }
  var path = good.drive.nav.folders.Path.getINSTANCE().pathlist;
  path.push(this.data.getId());
};

/** @override */
good.drive.nav.grid.Cell.prototype.createDom = function() {
  var sb = new goog.string.StringBuffer();
  this.toHtml(sb);
  var element = this.getDomHelper().htmlToDocumentFragment(sb.toString());
  this.setElementInternal(/** @type {Element} */ (element));
};


/**
 * @param {goog.string.StringBuffer} sb
 */
good.drive.nav.grid.Cell.prototype.toHtml = function(sb) {
  sb.append('<div class="',
      this.defaultConfig.cssCellRoot, '" id="', this.getId(), '">',
      '<div><div class="gv-dynamic-thumbnail"',
      ' style="width: 249px; height: 255px">',
      this.getImageHtml(), this.getLabelHtml(), '</div></div></div>');
};


/**
 * @return {Element}
 */
good.drive.nav.grid.Cell.prototype.getThumbnailElement = function() {
  var el = this.getElement();
  return el ? /** @type {Element} */ (el.firstChild.firstChild) : null;
};


/**
 * @return {Element}
 */
good.drive.nav.grid.Cell.prototype.getImageBottonElement = function() {
  var el = this.getImageElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.nav.grid.Cell.prototype.getImageHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="', this.getImageClassName(), '">',
      '<div class="gv-view-bottom"><div class="gv-view-center">',
      '<div class="gv-selection">', this.getImageContainerHtml(),
      '</div></div></div></div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.nav.grid.Cell.prototype.getImageElement = function() {
  var el = this.getThumbnailElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};


/**
 * @return {string}
 */
good.drive.nav.grid.Cell.prototype.getImageClassName = function() {
  return this.defaultConfig.cssCellImage;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.nav.grid.Cell.prototype.getImageContainerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getImageContainerClassName(),
      '"></div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.nav.grid.Cell.prototype.getImageContainerElement = function() {
  var el = this.getImageBottonElement();
  return el ?
      /** @type {Element} */ (el.firstChild.firstChild.firstChild) :
      null;
};


/**
 * @return {string}
 */
good.drive.nav.grid.Cell.prototype.getImageContainerClassName = function() {
  return this.defaultConfig.cssCellImageContainer;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.nav.grid.Cell.prototype.getLabelHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getLabelClassName(),
      '"></div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.nav.grid.Cell.prototype.getLabelElement = function() {
  var el = this.getThumbnailElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};


/**
 * @return {string}
 */
good.drive.nav.grid.Cell.prototype.getLabelClassName = function() {
  return this.defaultConfig.cssCellLabel;
};


/**
 * @param {Element} dom
 */
good.drive.nav.grid.Cell.prototype.setLabel = function(dom) {
  goog.dom.appendChild(this.getLabelElement(), dom);
};
