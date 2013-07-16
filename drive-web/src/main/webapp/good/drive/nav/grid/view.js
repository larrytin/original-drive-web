'use strict';
goog.provide('good.drive.nav.grid');

goog.require('good.drive.nav.grid.Cell');
goog.require('goog.asserts');
goog.require('goog.dom.classes');
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.Component');

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.ui.Component}
 */
good.drive.nav.grid.View = function(node, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.node = node;
  this.head_ = {};
};
goog.inherits(good.drive.nav.grid.View, goog.ui.Component);

/**
 * @type {struct}
 */
good.drive.nav.grid.View.grids = {};

/**
 * @param {goog.ui.tree.TreeControl} node
 */
good.drive.nav.grid.View.createGrid = function(node) {
  var id = node.getId();
  if (goog.object.containsKey(good.drive.nav.grid.View.grids, id)) {
    good.drive.nav.grid.View.visiable(
        goog.object.get(good.drive.nav.grid.View.grids, id));
    return;
  }
  var grid = new good.drive.nav.grid.View(node);
  grid.render(goog.dom.getElement('viewmanager'));
  grid.renderCell(node);
  grid.renderFolderPath(good.drive.nav.folders.Model.strType.LABEL);
  goog.object.add(good.drive.nav.grid.View.grids, id, grid);
  good.drive.nav.grid.View.visiable(grid);
};


/**
 * @param {good.drive.nav.grid.View} grid
 */
good.drive.nav.grid.View.visiable = function(grid) {
  goog.object.forEach(good.drive.nav.grid.View.grids, function(value, key) {
    goog.style.showElement(value.getElement());
  });
  goog.style.showElement(grid.getElement(), 'none');
};

/**
 * @param {goog.ui.tree.TreeControl} node
 */
good.drive.nav.grid.View.prototype.renderCell = function(node) {
  var file = node.file;
  var folder = node.folder;
  for (var i = 0; i < file.length(); i++) {
    var data = file.get(i);
    this.insertCell(data, false);
  }

  for (var i = 0; i < folder.length(); i++) {
    var data = folder.get(i);
    this.insertCell(data, true);
  }
};

/**
 */
good.drive.nav.grid.View.prototype.renderFolderPath = function() {
  var pathElm = this.getFolderPathElement();
  var child = goog.dom.getChildren(pathElm);
  if (!goog.array.isEmpty(child)) {
    return;
  }
  this.insertFolderPath();
};

/**
 */
good.drive.nav.grid.View.prototype.insertFolderPath = function() {
  var pathElm = this.getFolderPathElement();
  goog.dom.removeChildren(pathElm);
  var path = this.node.getTree().path;
  for (var i = 0; i < path.length(); i++) {
    var value = path.get(i);
    var label = value.get('label');
    if (i == (path.length() - 1)) {
      var cruuentElm = goog.dom.createDom('div',
          {'class': 'goog-inline-block folder-path-' +
        'folder folder-current-element'});
      goog.dom.setTextContent(cruuentElm, label);
      goog.dom.appendChild(pathElm, cruuentElm);
      return;
    }
    var contentElm = goog.dom.createDom('div',
        {'class': 'goog-inline-block folder-path-folder folder-path-element'});
    var separatorElm = goog.dom.createDom('div',
        {'class': 'goog-inline-block folder-path-separator-icon'});
    goog.dom.setTextContent(contentElm, label);
    goog.dom.appendChild(pathElm, contentElm);
    goog.dom.appendChild(pathElm, separatorElm);
    this.pathHandle(contentElm, value);
  }
};

/**
 * @param {Element} elm
 * @param {good.realtime.CollaborativeMap} map
 */
good.drive.nav.grid.View.prototype.pathHandle = function(elm, map) {
  var id = map.getId();
  var that = this;
  var parent = this.node.getParent();
  var tree = parent.getTree();
  goog.events.listen(elm, goog.events.EventType.CLICK, function(e) {
    while (parent) {
      if (parent.map.getId() == id) {
        tree.setSelectedItem(parent);
        break;
      }
      parent = parent.getParent();
    }
    parent = that.node.getParent();
  });
};

/**
 */
good.drive.nav.grid.View.prototype.removeFromParent = function() {
  goog.dom.removeNode(this.getElement());
};

/**
 * @param {good.realtime.CollaborativeMap} data
 * @param {boolean} isFolder
 */
good.drive.nav.grid.View.prototype.insertCell = function(data, isFolder) {
  var cell = this.createCell(data);
  this.add(cell);
  cell.renderCell();
  cell.setIsFolder(isFolder);
};


/**
 * @param {good.realtime.CollaborativeMap} data
 */
good.drive.nav.grid.View.prototype.removeCell = function(data) {
  for (var i = 0; i < this.getChildCount(); i++) {
    var cell = this.getChildAt(i);
    if (cell.data.getId() == data.getId()) {
      this.removeChildAt(i);
      break;
    }
  }
};

/**
 * @override
 */
good.drive.nav.grid.View.prototype.removeChild =
    function(childNode, opt_unrender) {
  var child = /** @type {good.drive.nav.grid.Cell} */ (childNode);

  good.drive.nav.grid.View.superClass_.removeChild.call(this, child);

  var contentElm = this.getGridContainerElement();
  contentElm.removeChild(childNode.getElement());

};


/** @override */
good.drive.nav.grid.View.prototype.createDom = function() {
  var sb = new goog.string.StringBuffer();
  this.toHtml(sb);
  var element = this.getDomHelper().htmlToDocumentFragment(sb.toString());
  this.setElementInternal(/** @type {Element} */ (element));
};


/**
 * @param {goog.string.StringBuffer} sb
 */
good.drive.nav.grid.View.prototype.toHtml = function(sb) {
  sb.append('<div>',
      this.getInnerHtml(),
      '</div>');
};


/**
 * @return {Element}
 */
good.drive.nav.grid.View.prototype.getChildrenElement = function() {
  var el = this.getElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};


/** @override */
good.drive.nav.grid.View.prototype.enterDocument = function() {
  good.drive.nav.grid.View.superClass_.enterDocument.call(this);
  var el = this.getElement();
  el.className = this.getConfig().cssRoot;
};


/**
 * @param {good.realtime.CollaborativeMap} data
 * @return {good.drive.nav.grid.Cell}
 */
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


/** @override */
good.drive.nav.grid.View.prototype.addChildAt = function(child, index,
    opt_render) {
  goog.asserts.assert(!child.getParent());

  good.drive.nav.grid.View.superClass_.addChildAt.call(this, child, index);

  if (this.getElement()) {
    var contentElm = this.getGridContainerElement();
    var sb = new goog.string.StringBuffer();
    child.createDom();
    goog.dom.appendChild(contentElm, child.getElement());
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


/**
 * @return {Element}
 */
good.drive.nav.grid.View.prototype.getInnerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="', this.getInnerClassName(), '">',
      this.getHeadContainerHtml(),
      this.getScrollContainerHtml(),
      '</div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.nav.grid.View.prototype.getInnerElement = function() {
  var el = this.getElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};


/**
 * @return {string}
 */
good.drive.nav.grid.View.prototype.getInnerClassName = function() {
  return this.getConfig().cssRoot + '-' + this.getConfig().cssInnerClass;
};


/**
 * @return {goog.string.StringBuffer}
 */
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


/**
 * @return {Element}
 */
good.drive.nav.grid.View.prototype.getHeadContainerElement = function() {
  var el = this.getInnerElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};


/**
 * @return {string}
 */
good.drive.nav.grid.View.prototype.getHeadContainerClassName = function() {
  return this.getConfig().cssRoot + '-' +
      this.getConfig().cssHeadContainerHtml;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.nav.grid.View.prototype.getFolderPathHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getFolderPathClassName(),
      '" style="-webkit-user-select: none;"></div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.nav.grid.View.prototype.getFolderPathElement = function() {
  var el = this.getHeadContainerElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};


/**
 * @return {string}
 */
good.drive.nav.grid.View.prototype.getFolderPathClassName = function() {
  return this.getConfig().cssPathContainer;
};


/**
 * @return {goog.string.StringBuffer}
 */
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


/**
 * @return {Element}
 */
good.drive.nav.grid.View.prototype.getScrollContainerElement = function() {
  var el = this.getInnerElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};


/**
 * @return {string}
 */
good.drive.nav.grid.View.prototype.getScrollContainerClassName = function() {
  return this.getConfig().cssRoot + '-' + this.
  getConfig().cssScrollContainerHtml;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.nav.grid.View.prototype.getGridViewHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getGridViewClassName(),
      '" tabindex="0">',
      this.getGridContainerHtml(),
      '</div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.nav.grid.View.prototype.getGridViewElement = function() {
  var el = this.getScrollContainerElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};


/**
 * @return {string}
 */
good.drive.nav.grid.View.prototype.getGridViewClassName = function() {
  return this.getConfig().cssGridView;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.nav.grid.View.prototype.getGridContainerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getGridContainerClassName(),
      '"></div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.nav.grid.View.prototype.getGridContainerElement = function() {
  var el = this.getGridViewElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};


/**
 * @return {string}
 */
good.drive.nav.grid.View.prototype.getGridContainerClassName = function() {
  return this.getConfig().cssGridContainer;
};


/**
 * @return {Object.<string, string>}
 */
good.drive.nav.grid.View.prototype.getConfig = function() {
  return good.drive.nav.grid.View.defaultConfig;
};

/**
 */
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
      goog.getCssName('doclistview-transitions') + ' ' +
      goog.getCssName('density-tiny'),
  cssGridContainer: goog.getCssName('gv-grid-inner') + ' ' +
      goog.getCssName('doclist-container'),
  cssCellRoot: goog.getCssName('goog-inline-block') + ' ' +
      goog.getCssName('gv-activegv-doc'),
  cssCellImage: goog.getCssName('gv-image') + ' ' +
      goog.getCssName('gv-no-border'),
  cssCellLabel: goog.getCssName('doclist-gv-name-container'),
  cssCellImageContainer: goog.getCssName('gv-image-container'),
  cssCellHover: goog.getCssName('gv-doc-hovered')
};
