'use strict';
goog.provide('good.drive.nav.folders');

goog.require('good.drive.nav.folders.Model');
goog.require('goog.events.KeyHandler');
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.tree.BaseNode');
goog.require('goog.ui.tree.TreeControl');

/**
 * @constructor
 */
good.drive.nav.folders.Tree = function() {
  var root = new goog.ui.tree.TreeControl('我的资料库',
      good.drive.nav.folders.Tree.defaultConfig);
  root.render(goog.dom.getElement('navfolderslist'));
  root.setShowRootLines(false);
  root.setShowRootNode(false);
  root.setShowLines(false);

  var tree_ = root.getTree().createNode(
      '<span class="treedoclistview-root-node-name">我的资料库 &nbsp;</span>');
  root.add(tree_);
  tree_.setExpanded(false);
  root.setSelectedItem(tree_);
  this.customNode(tree_);

  this.roottree = root;
  this.tree = tree_;

  window.treebak = this;

  var model_ = new good.drive.nav.folders.Model(this);
  this.model = model_;

  var sb = new goog.string.StringBuffer();
  for (var i in good.drive.nav.folders.labelElm) {
    sb.append(good.drive.nav.folders.labelElm[i].outerHTML);
  }
  this.sb_ = sb;

  this.currentItem_ = undefined;
};


/** {struct} */
good.drive.nav.folders.labelElm = [
  goog.dom.createDom('span',
      {'class': 'goog-inline-block treedoclistview-init-spacing'}, ' '),
  goog.dom.createDom('span',
      {'class': 'goog-inline-block treedoclistview-node-icon' +
            ' drive-sprite-folder-list-icon icon-color-1'}, ' '),
  goog.dom.createDom('span',
      {'class': 'goog-inline-block treedoclistview-spacing'}, ' ')
];


/**
 * @param {goog.ui.tree.TreeControl} parent
 * @param {number} idx
 * @param {good.realtime.CollaborativeList} value
 * @return {goog.ui.tree.TreeNode}
 */
good.drive.nav.folders.Tree.prototype.insertNode =
    function(parent, idx, value) {
  var title = value.get(good.drive.nav.folders.Model.strType.LABEL);
  var childNode = parent.getTree().createNode('');
  parent.addChild(childNode);
  this.setNodeTitle(childNode, title);
  if (parent.getExpanded()) {
    this.customNode(childNode);
  }
  return childNode;
};

/**
 * @param {good.realtime.CollaborativeList} path
 */
good.drive.nav.folders.Tree.prototype.locationNode = function(path) {
  this.locationNode_(this.roottree, path, parseInt(0), path.length());
};

/**
 * @param {goog.ui.tree.TreeControl} parentNode
 * @param {good.realtime.CollaborativeList} path
 * @param {number} idx
 * @param {number} pathleg
 * @private
 */
good.drive.nav.folders.Tree.prototype.locationNode_ =
  function(parentNode, path, idx, pathleg) {
  if (idx >= pathleg) {
    return;
  }
  if (!this.hasExtended(parentNode)) {
    parentNode.setExpanded(true);
  }
  var length = parentNode.getChildCount();
  if (length == 0) {
    return;
  }
  var pathId = path.get(idx).getId();
  for (var i = 0; i < length; i++) {
    var child = parentNode.getChildAt(i);
    var childId = child.map.getId();
    if (childId == pathId) {
      if (idx == (pathleg - 1)) {
        this.roottree.setSelectedItem(child);
        this.model.goToGrid(child);
      }
      this.locationNode_(child, path, idx + 1, pathleg);
      break;
    }
  }
};

/**
 */
good.drive.nav.folders.Tree.prototype.buildPath = function() {
  var parentNode = this.getCurrentItem();
  if (this.model.isCurrentPath(parentNode.map)) {
    return;
  }
  var paths = [];
  this.model.clearPath();
  this.buildPath_(parentNode, paths);
  this.model.pushPath(paths);
};

/**
 * @param {goog.ui.tree.TreeControl} parentNode
 * @param {Array.<Object>} paths
 * @private
 */
good.drive.nav.folders.Tree.prototype.buildPath_ = function(parentNode, paths) {
  if (parentNode == this.roottree) {
    return;
  }
  this.buildPath_(parentNode.getParent(), paths);
  paths.push(parentNode.map);
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeList} list
 */
good.drive.nav.folders.Tree.prototype.nodeHandle = function(node, list) {
  var that = this;
  var init = true;
  node.getHandler().listen(
      node, goog.ui.tree.BaseNode.EventType.BEFORE_EXPAND,
      function(e) {
        if (list.length() == 0 && node.hasChildren()) {
          return;
        }

        if (node.getChildCount() > 0) {
          return;
        }
        var str = '';
        for (var i = 0; i < list.length(); i++) {
          var val = list.get(i);
          var childNode = that.insertNode(node, 0, val);
          that.model.mapHander(node, childNode, val);
          that.model.addEvent(childNode, val);
        }
      });
  node.getHandler().listen(node,
      goog.ui.tree.BaseNode.EventType.EXPAND,
      function(e) {
        if (node.getChildCount() == 0) {
          return;
        }
        if (init) {
          init = false;
          var children = node.getChildren();
          for (var i in children) {
            var child = children[i];
            that.customNode(child);
          }
        }
      });
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
 * @return {goog.ui.tree.TreeControl}
 */
good.drive.nav.folders.Tree.prototype.getCurrentItem = function() {
  return this.roottree.getSelectedItem();
};


/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {string} title
 */
good.drive.nav.folders.Tree.prototype.setNodeTitle =
    function(node, title) {
  var titleElm = goog.dom.createDom('span',
      {'class': 'treedoclistview-node-name'},
      goog.dom.createDom('span', {'dir': 'ltr'}, title));
  node.setHtml(this.sb_.toString() + titleElm.outerHTML);
  node.title = title;
};


/**
 * @param {goog.ui.tree.TreeControl} tree
 */
good.drive.nav.folders.Tree.prototype.customNode =
    function(tree) {
  tree.setAfterLabelHtml('<div class="selection-highlighter"></div>');
  var rowElement = tree.getRowElement();
  var that = this;
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
 * @param {string} str
 */
good.drive.nav.folders.Tree.prototype.addLeaf = function(str) {
  if (str.length == 0) {
    return;
  }
  var selected = this.getCurrentItem();
  selected.setExpanded(true);
  var map = this.model.getLeaf(str);
  selected.folder.push(map);
};


/**
 * @param {string} str
 */
good.drive.nav.folders.Tree.prototype.renameLeaf = function(str) {
  var selected = this.getCurrentItem();
  selected.getParent().folder.get(this.getIndexByChild(selected)).
      set(good.drive.nav.folders.Model.strType.LABEL, str);
};


/**  */
good.drive.nav.folders.Tree.prototype.removeLeaf = function() {
  var selected = this.getCurrentItem();
  selected.getParent().folder.remove(this.getIndexByChild(selected));
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
