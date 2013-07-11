'use strict';
goog.provide('good.drive.nav.grid');

goog.require('goog.dom.classes');
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.Component');
goog.require('goog.asserts');
goog.require('good.drive.nav.grid.Cell');
goog.require('good.drive.nav.folders');


/**
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @param {Object} model
 * @constructor
 * @extends {goog.ui.Component}
 */
good.drive.nav.grid.View = function(node, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.node = node;
  this.head_ = {};
};
goog.inherits(good.drive.nav.grid.View, goog.ui.Component);

good.drive.nav.grid.View.grids = {};

good.drive.nav.grid.View.createGrid = function(node) {
  var id = node.getId();
  if(goog.object.containsKey(good.drive.nav.grid.View.grids, id)) {
    good.drive.nav.grid.View.visiable(goog.object.get(good.drive.nav.grid.View.grids, id));
    return;
  }
  var grid = new good.drive.nav.grid.View(node);
  grid.render(goog.dom.getElement('viewmanager'));
  var cell = grid.createCell(null);
  grid.add(cell);
  var cell = grid.createCell(null);
  grid.add(cell);
  window.grid = grid;
  goog.object.add(good.drive.nav.grid.View.grids, id, grid);
  good.drive.nav.grid.View.visiable(grid);
}

good.drive.nav.grid.View.visiable = function(grid) {
  goog.object.forEach(good.drive.nav.grid.View.grids, function(value, key) {
    goog.style.showElement(value.getElement());
  });
  goog.style.showElement(grid.getElement(), "none");
}

/** @override */
good.drive.nav.grid.View.prototype.createDom = function() {
  var sb = new goog.string.StringBuffer();
  this.toHtml(sb);
  var element = this.getDomHelper().htmlToDocumentFragment(sb.toString());
  this.setElementInternal(/** @type {Element} */ (element));
};

good.drive.nav.grid.View.prototype.toHtml = function(sb) {
  sb.append('<div>',
      this.getInnerHtml(),
      '</div>');
};

/** @override */
good.drive.nav.grid.View.prototype.enterDocument = function() {
  good.drive.nav.grid.View.superClass_.enterDocument.call(this);
  var el = this.getElement();
  el.className = this.getConfig().cssRoot;
};

good.drive.nav.grid.View.prototype.createCell = function(data) {
  return new good.drive.nav.grid.Cell(data, this.getConfig());
};

/**
 * @param {good.drive.nav.grid.Cell} child
 * @param {good.drive.nav.grid.Cell=} opt_before
 * @return {good.drive.nav.grid.Cell} The added child.
 */
good.drive.nav.grid.View.prototype.add = function(child, opt_before) {
  goog.asserts.assert(!opt_before || opt_before.getParent() == this,
  'Can only add nodes before siblings');
  if (child.getParent()) {
    child.getParent().removeChild(child);
  }
  this.addChildAt(child,
      opt_before ? this.indexOfChild(opt_before) : this.getChildCount());
  return child;
};

good.drive.nav.grid.View.prototype.addChildAt = function(child, index,
    opt_render) {
  goog.asserts.assert(!child.getParent());
  
  good.drive.nav.grid.View.superClass_.addChildAt.call(this, child, index);
  
  if (this.getElement()) {
    var contentElm = this.getGridContainerElement();
    var sb = new goog.string.StringBuffer();
    child.createDom();
    contentElm.appendChild(child.getElement());
    child.enterDocument();
  }
};

/**
 * @return {Element}
 * @override
 */
good.drive.nav.grid.View.prototype.getElement = function() {
  var el = good.drive.nav.grid.View.superClass_.getElement.call(this);
  if (!el) {
    el = this.getDomHelper().getElement(this.getId());
    this.setElementInternal(el);
  }
  return el;
};

good.drive.nav.grid.View.prototype.getInnerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="', this.getInnerClassName(), '">',
      this.getHeadContainerHtml(),
      this.getScrollContainerHtml(),
      '</div>');
  return sb.toString();
};

good.drive.nav.grid.View.prototype.getInnerElement = function() {
  var el = this.getElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};

good.drive.nav.grid.View.prototype.getInnerClassName = function() {
  return goog.getCssName(this.getConfig().cssRoot, this.getConfig().cssInnerClass);
};

good.drive.nav.grid.View.prototype.getHeadContainerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="', this.getHeadContainerClassName(),
      '">',
      this.getFolderPathHtml(),
      '<div class="',
      this.getConfig().cssEdge,
      '"></div></div>');
  return sb.toString();
};

good.drive.nav.grid.View.prototype.getHeadContainerElement = function() {
  var el = this.getInnerElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};

good.drive.nav.grid.View.prototype.getHeadContainerClassName = function() {
  return goog.getCssName(this.getConfig().cssRoot, this.getConfig().cssHeadContainerHtml);
};

good.drive.nav.grid.View.prototype.getFolderPathHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getFolderPathClassName(),
      '" style="-webkit-user-select: none;"></div>');
  return sb.toString();
};

good.drive.nav.grid.View.prototype.getFolderPathElement = function() {
  var el = this.getHeadContainerElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};

good.drive.nav.grid.View.prototype.getFolderPathClassName = function() {
  return this.getConfig().cssPathContainer;
};

good.drive.nav.grid.View.prototype.getScrollContainerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getScrollContainerClassName(),
      '">',
      '<div class="',
      this.getConfig().cssSidePanel,
      '"></div>',
      '<div class="',
      this.getConfig().cssEmptyView,
      '"></div>',
      this.getGridViewHtml(),
      '</div>');
  return sb.toString();
};

good.drive.nav.grid.View.prototype.getScrollContainerElement = function() {
  var el = this.getInnerElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};

good.drive.nav.grid.View.prototype.getScrollContainerClassName = function() {
  return goog.getCssName(this.getConfig().cssRoot, this.getConfig().cssScrollContainerHtml);
};

good.drive.nav.grid.View.prototype.getGridViewHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getGridViewClassName(),
      '" tabindex="0">',
      this.getGridContainerHtml(),
      '</div>');
  return sb.toString();
};

good.drive.nav.grid.View.prototype.getGridViewElement = function() {
  var el = this.getScrollContainerElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};

good.drive.nav.grid.View.prototype.getGridViewClassName = function() {
  return this.getConfig().cssGridView;
};

good.drive.nav.grid.View.prototype.getGridContainerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getGridContainerClassName(),
  '"></div>');
  return sb.toString();
};

good.drive.nav.grid.View.prototype.getGridContainerElement = function() {
  var el = this.getGridViewElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};

good.drive.nav.grid.View.prototype.getGridContainerClassName = function() {
  return this.getConfig().cssGridContainer;
};

/**
 * @return {Object}
 */
good.drive.nav.grid.View.prototype.getConfig = function() {
  return good.drive.nav.grid.View.defaultConfig;
};

good.drive.nav.grid.View.defaultConfig = {
  cssRoot: goog.getCssName('doclistview'),
  cssInnerClass: goog.getCssName('inner'),
  cssEdge: goog.getCssName('doclist-scroll-edge'),
  cssPathContainer: goog.getCssName('folder-path-container') + ' ' +
      goog.getCssName('goog-container'),
  cssHeadContainerHtml: goog.getCssName('fixed-container'),
  cssScrollContainerHtml: goog.getCssName('scroll-container'),
  cssSidePanel: goog.getCssName('doclistview-side-panel'),
  cssEmptyView: goog.getCssName('doclistview-empty-view'),
  cssGridView: goog.getCssName('gridview-grid') + ' ' + 
  goog.getCssName('doclistview-transitions') + ' ' + goog.getCssName('density-tiny'),
  cssGridContainer: goog.getCssName('gv-grid-inner') + ' ' + 
  goog.getCssName('doclist-container'),
  cssCellRoot: goog.getCssName('goog-inline-block') + ' ' +
  goog.getCssName('gv-activegv-doc'),
  cssCellImage: goog.getCssName('gv-image') + ' ' +
  goog.getCssName('gv-no-border'),
  cssCellLabel: goog.getCssName('doclist-gv-name-container'),
  cssCellImageContainer: goog.getCssName('gv-image-container'),
  cssCellHover: goog.getCssName('gv-doc-hovered'),
};
