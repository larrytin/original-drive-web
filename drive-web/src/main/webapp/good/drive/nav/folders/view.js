'use strict';
goog.provide('good.drive.nav.folders');

goog.require('good.drive.nav.folders.Model');
goog.require('goog.ui.tree.TreeControl');



/**
 * @constructor
 */
good.drive.nav.folders.Tree = function() {
  var treeConfig = goog.ui.tree.TreeControl.defaultConfig;
  treeConfig['cleardotPath'] = '../../images/tree/cleardot.gif';
  var tree_ = new goog.ui.tree.TreeControl('我的资料库', treeConfig);
  tree_.render(goog.dom.getElement('navfolderslist'));
  tree_.setIsUserCollapsible(true);
  tree_.setShowExpandIcons(true);
  tree_.setExpanded(true);

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
  console.log(parent.getHtml() + '-' + idx + '-' + value);
  var title = value.get(good.drive.nav.folders.Model.LABEL);
  var childNode = parent.getTree().createNode('');
  parent.add(childNode);
  childNode.setHtml(title);
  return childNode;
};

good.drive.nav.folders.Tree.prototype.removeNode =
    function(parent, idx) {
	parent.removeChildAt(idx);
};


/**
 * @param {string} str
 */
good.drive.nav.folders.Tree.prototype.addLeaf = function(str) {
  var selected = this.tree.getSelectedItem();
  var map = this.model.getLeaf(str);
  if(selected.getChildCount() == 0) {
	  var id = selected.getId();
	  var parent = selected.getParent();
	  var childIds = parent.getChildIds();
	  var index = childIds.indexOf(id);
	  var list = parent.data.get(index).get(good.drive.nav.folders.Model.FOLDERSCHILD);
	  list.push(map);
	  return;
  }
  selected.data.push(map);
};

good.drive.nav.folders.Tree.prototype.removeLeaf = function() {
};