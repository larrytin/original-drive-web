'use strict';
goog.provide('good.drive.nav.folders');

goog.require('good.drive.nav.folders.Model');
goog.require('goog.events.KeyHandler');
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
      '<span class="treedoclistview-root-node-name">我的云端硬盘 &nbsp;</span>');
  root.add(tree_);
  tree_.setExpanded(true);
  root.setSelectedItem(tree_);
  this.customNode(tree_);


  this.roottree = root;
  this.tree = tree_;

  window.treebak = this;

  var model_ = new good.drive.nav.folders.Model(this);
  this.model = model_;
};


/**
 * @param {goog.ui.tree.TreeControl} parent
 * @param {number} idx
 * @param {good.realtime.CollaborativeList} value
 * @return {goog.ui.tree.TreeNode}
 */
good.drive.nav.folders.Tree.prototype.insertNode =
    function(parent, idx, value) {
//  console.log(parent.getHtml() + '-' + idx + '-' + value);
  var title = value.get(good.drive.nav.folders.Model.LABEL);
  var childNode = parent.getTree().createNode('');
  childNode.setHtml(title);
  parent.addChild(childNode);
  //  this.customNode(childNode);
  return childNode;
};


/**
 * @param {goog.ui.tree.TreeControl} tree
 */
good.drive.nav.folders.Tree.prototype.customNode =
    function(tree) {
  //  tree.setIsUserCollapsible(true);
  tree.setAfterLabelHtml('<div class="selection-highlighter"></div>');
  var rowElement = tree.getRowElement();
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
 */
good.drive.nav.folders.Tree.prototype.removeNode = function(parent, idx) {
  parent.removeChildAt(idx);
};


/**
 * @param {string} str
 */
good.drive.nav.folders.Tree.prototype.addLeaf = function(str) {
  if (str.length == 0) {
    return;
  }
  var selected = this.roottree.getSelectedItem();
  var map = this.model.getLeaf(str);
  if (selected.getChildCount() == 0) {
    var id = selected.getId();
    var parent = selected.getParent();
    var childIds = parent.getChildIds();
    var index = childIds.indexOf(id);
    var list = parent.data.get(index).get(
        good.drive.nav.folders.Model.FOLDERSCHILD);
    list.push(map);
    return;
  }
  selected.data.push(map);
};


/**  */
good.drive.nav.folders.Tree.prototype.removeLeaf = function() {
  var selected = this.roottree.getSelectedItem();
  var id = selected.getId();
  var parent = selected.getParent();
  var childIds = parent.getChildIds();
  var index = childIds.indexOf(id);
  parent.data.remove(index);
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
    goog.getCssName('doclist-folder-triangle-expanded'),
  cssExpandTreeIconMinus: goog.getCssName('goog-inline-block') + ' ' + 
      goog.getCssName('doclist-icon navpane-expand-icon') + ' ' +
      goog.getCssName('doclist-folder-triangle-collapsed'),
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
