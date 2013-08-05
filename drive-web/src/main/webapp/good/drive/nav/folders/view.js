'use strict';
goog.provide('good.drive.nav.folders');

goog.require('good.drive.nav.folders.ViewControl');
goog.require('goog.events.KeyHandler');
goog.require('goog.fx.DragDropGroup');
goog.require('goog.fx.DragDropItem');
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.tree.BaseNode');
goog.require('goog.ui.tree.TreeControl');

/**
 * @constructor
 * @param {string} title
 * @param {string} docid
 * @param {Element} targetElm
 * @param {good.drive.nav.folders.ViewControl} control
 */
good.drive.nav.folders.Tree = function(title, docid, targetElm, control) {
  if (control == undefined) {
    control = new good.drive.nav.folders.ViewControl(docid);
  }
  this.control_ = control;
  this.control_.setView(this);
  this.control_.setTitle(title);
  var root = new goog.ui.tree.TreeControl('',
      good.drive.nav.folders.Tree.defaultConfig);
  root.render(targetElm);
  root.setShowRootLines(false);
  root.setShowRootNode(false);
  root.setShowLines(false);
  var dragDropGroup = new goog.fx.DragDropGroup();
  dragDropGroup.createDragElement =
    function(sourceEl) {
    return goog.dom.createDom('div', 'foo', 'Custom drag element');
  };
  this.dragDropGroup = dragDropGroup;
  this.dragDropGroup.init();
  this.dragDropGroup.addTarget(this.dragDropGroup);
  goog.events.listen(this.dragDropGroup, 'drop', dropList1);
  var that = this;
  goog.events.listen(this.dragDropGroup, 'dragstart', dragStart);
  function dropList1(event) {
    event.dropTargetItem;
  }

  function dragStart(event) {
    goog.style.setOpacity(event.dragSourceItem.element, 1);
    var path = good.drive.nav.folders.Path.getINSTANCE();
    var dragdrop = path.root.get(path.pathNameType().DRAGDROP);
    var dragData = event.dragSourceItem.data;
  }

  var tree_ = root.getTree().createNode(
      '<span class="treedoclistview-root-node-name">' +
      title + '&nbsp;</span>');
  root.add(tree_);
  tree_.setExpanded(false);
  this.customNode(tree_);

  this.roottree = root;
  this.tree = tree_;

  window.treebak = this;

  this.currentItem_ = undefined;
};


/**
 * @param {goog.ui.tree.TreeControl} parent
 * @param {good.realtime.CollaborativeMap} data
 * @param {string} title
 * @return {goog.ui.tree.TreeNode}
 */
good.drive.nav.folders.Tree.prototype.insertNode =
    function(parent, data, title) {
  var childNode = parent.getTree().createNode('');
  parent.addChild(childNode);
  this.setNodeTitle(childNode, data, title);
  if (parent.getExpanded()) {
    this.customNode(childNode);
  }
  return childNode;
};

/**
 * @param {Function} handle
 */
good.drive.nav.folders.Tree.prototype.changeHandle = function(handle) {
  this.roottree.getHandler().
      listen(this.roottree, goog.events.EventType.CHANGE, handle);
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @return {boolean}
 */
good.drive.nav.folders.Tree.prototype.hasExtended = function(node) {
  return node.getExpanded();
};

/** */
good.drive.nav.folders.Tree.prototype.extended =
    function() {
  var selected = this.getCurrentItem();
  if (this.hasExtended(selected)) {
    return;
  }
  selected.setExpanded(true);
};

/**
 * @param {good.realtime.CollaborativeList} pathlist
 * @param {good.realtime.CollaborativeMap} pathroot
 * @param {Function} callback
 */
good.drive.nav.folders.Tree.prototype.initPath =
  function(pathlist, pathroot, callback) {
  var that = this;
  this.changeHandle(function(e) {
    if (that.getCurrentItem() != null) {
      callback(that.control().model().docId());
    }
    that.control().buildPath(pathlist, pathroot);
  });
};

/**
 */
good.drive.nav.folders.Tree.prototype.recovery = function() {
  this.roottree.setSelectedItem(null);
};

/**
 * @param {good.realtime.CollaborativeList} pathlist
 */
good.drive.nav.folders.Tree.prototype.location = function(pathlist) {
  this.control().locationNode(this.roottree, pathlist);
};

/**
 * @return {goog.ui.tree.TreeControl}
 */
good.drive.nav.folders.Tree.prototype.getCurrentItem = function() {
  return this.roottree.getSelectedItem();
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeMap} data
 * @param {string} title
 */
good.drive.nav.folders.Tree.prototype.setNodeTitle =
    function(node, data, title) {
  var sb = new goog.string.StringBuffer();
  var folderclass = this.getFolderIcon(data);
  sb.append(goog.dom.createDom('span',
      {'class': 'goog-inline-block treedoclistview-init-spacing'},
      ' ').outerHTML);
  sb.append(goog.dom.createDom('span',
      {'class': 'goog-inline-block treedoclistview-node-icon' +
      ' drive-sprite-folder-list-icon ' +
      folderclass}, ' ').outerHTML);
  sb.append(goog.dom.createDom('span',
      {'class': 'goog-inline-block treedoclistview-spacing'},
      ' ').outerHTML);
  var titleElm = goog.dom.createDom('span',
      {'class': 'treedoclistview-node-name'},
      goog.dom.createDom('span', {'dir': 'ltr'}, title));
  node.setHtml(sb.toString() + titleElm.outerHTML);
  node.title = title;
};

/**
 * @param {good.realtime.CollaborativeMap} data
 * @return {string}
 */
good.drive.nav.folders.Tree.prototype.getFolderIcon =
  function(data) {
  var isclass = data.get('isclass');
  if (isclass == undefined) {
    return 'icon-color-1';
  }
  return isclass ? 'icon-color-6' : 'icon-color-1';
};

/**
 * @param {good.realtime.CollaborativeMap} data
 */
good.drive.nav.folders.Tree.prototype.setData = function(data) {
  this.control().mappingView(this, data);
};

/**
 * @param {goog.ui.tree.TreeControl} tree
 */
good.drive.nav.folders.Tree.prototype.customNode =
    function(tree) {
  tree.setAfterLabelHtml('<div class="selection-highlighter"></div>');
  var rowElement = tree.getRowElement();
  var that = this;
  var item = new goog.fx.DragDropItem(rowElement, tree.map);
  this.dragDropGroup.addDragDropItem(item);
  goog.events.
      listen(rowElement, goog.events.EventType.MOUSEOVER, function(e) {
    if (!goog.dom.classes.has(rowElement,
        good.drive.nav.folders.Tree.defaultConfig.cssHoverRow)) {
      goog.dom.classes.add(rowElement,
          good.drive.nav.folders.Tree.defaultConfig.cssHoverRow,
          good.drive.nav.folders.Tree.defaultConfig.cssAccessible);
    }
  });
  goog.events.
      listen(rowElement, goog.events.EventType.MOUSEOUT, function(e) {
    if (goog.dom.classes.has(rowElement,
        good.drive.nav.folders.Tree.defaultConfig.cssHoverRow)) {
      goog.dom.classes.remove(rowElement,
          good.drive.nav.folders.Tree.defaultConfig.cssHoverRow,
          good.drive.nav.folders.Tree.defaultConfig.cssAccessible);
    }
  });
  tree.getRowClassName = function() {
    var selectedClass;
    if (this.isSelected()) {
      selectedClass = ' ' + this.config_.cssSelectedRow + ' ' +
          good.drive.nav.folders.Tree.defaultConfig.cssHoverRow + ' ' +
          good.drive.nav.folders.Tree.defaultConfig.cssAccessible;
    } else {
      selectedClass = '';
    }
    return this.config_.cssTreeRow + selectedClass;
  };
};

/**
 * @param {goog.ui.tree.TreeControl} parent
 * @param {number} idx
 * @return {goog.ui.tree.TreeControl}
 */
good.drive.nav.folders.Tree.prototype.removeNode = function(parent, idx) {
  return parent.removeChildAt(idx);
};

/**
 * @param {Object} data
 */
good.drive.nav.folders.Tree.prototype.moveToNode = function(data) {
  var item = this.getCurrentItem();
  this.control().moveToNode(item.map, data);
};

/**
 * @param {Object} param
 */
good.drive.nav.folders.Tree.prototype.addLeaf = function(param) {
  var selected = this.getCurrentItem();
  selected.setExpanded(true);
  this.control().addLeaf(selected, param);
};

/**
 * @param {Object} str
 */
good.drive.nav.folders.Tree.prototype.renameLeaf = function(str) {
  var selected = this.getCurrentItem();
  this.control().renameLeaf(selected.getParent(),
      this.getIndexByChild(selected), str);
};

/**  */
good.drive.nav.folders.Tree.prototype.removeLeaf = function() {
  var selected = this.getCurrentItem();
  this.control().removeLeaf(selected.getParent(),
      this.getIndexByChild(selected));
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @return {integer}
 */
good.drive.nav.folders.Tree.prototype.getIndexByChild = function(node) {
  var id = node.getId();
  var parent = node.getParent();
  var childIds = parent.getChildIds();
  var index = goog.array.indexOf(childIds, id);
  return index;
};

/**
 * @return {good.drive.nav.folders.ViewControl}
 */
good.drive.nav.folders.Tree.prototype.control = function() {
  return this.control_;
};

/** */
good.drive.nav.folders.Tree.defaultConfig = {
  indentWidth: 19,
  cssRoot: goog.getCssName('goog-tree-root') + ' ' +
      goog.getCssName('goog-tree-item'),
  cssHideRoot: goog.getCssName('goog-tree-hide-root'),
  cssItem: goog.getCssName('goog-tree-item'),
  cssChildren: goog.getCssName('goog-tree-children'),
  cssChildrenNoLines: goog.getCssName('goog-tree-children-nolines'),
  cssTreeRow: goog.getCssName('goog-tree-row'),
  cssItemLabel: goog.getCssName('goog-tree-item-label'),
  cssTreeIcon: goog.getCssName(''),
  cssExpandTreeIcon: goog.getCssName(''),
  cssExpandTreeIconPlus: goog.getCssName('goog-inline-block') + ' ' +
      goog.getCssName('doclist-icon navpane-expand-icon') + ' ' +
      goog.getCssName('doclist-folder-triangle-collapsed'),
  cssExpandTreeIconMinus: goog.getCssName('goog-inline-block') + ' ' +
      goog.getCssName('doclist-icon navpane-expand-icon') + ' ' +
      goog.getCssName('doclist-folder-triangle-expanded'),
  cssExpandTreeIconTPlus: goog.getCssName(
      'goog-tree-expand-icon-tplus'),
  cssExpandTreeIconTMinus: goog.getCssName(
      'goog-tree-expand-icon-tminus'),
  cssExpandTreeIconLPlus: goog.getCssName('goog-tree-expand-icon-lplus'),
  cssExpandTreeIconLMinus: goog.getCssName('goog-tree-expand-icon-lminus'),
  cssExpandTreeIconT: goog.getCssName(
      'goog-tree-expand-icon-t'),
  cssExpandTreeIconL: goog.getCssName('goog-tree-expand-icon-l'),
  cssExpandTreeIconBlank: goog.getCssName(
      'goog-inline-block doclist-icon navpane-expand-icon') + ' ' +
      goog.getCssName('doclist-folder-triangle-collapsed') + ' ' +
      goog.getCssName('treedoclistview-expand-icon-hidden'),
  cssExpandedFolderIcon: goog.getCssName(
      'goog-tree-icon goog-tree-expanded-folder-icon'),
  cssCollapsedFolderIcon: goog.getCssName('goog-tree-icon') + ' ' +
      goog.getCssName('goog-tree-collapsed-folder-icon'),
  cssFileIcon: goog.getCssName(
      'goog-tree-icon goog-tree-collapsed-folder-icon'),
  cssExpandedRootIcon: goog.getCssName(
      'goog-tree-expanded-folder-icon'),
  cssCollapsedRootIcon: goog.getCssName(
      'goog-tree-collapsed-folder-icon'),
  cssSelectedRow: goog.getCssName('goog-tree-row-activated'),
  cssHoverRow: goog.getCssName('goog-tree-row-hover'),
  cssAccessible: goog.getCssName('goog-tree-row-accessible-selected')
};

