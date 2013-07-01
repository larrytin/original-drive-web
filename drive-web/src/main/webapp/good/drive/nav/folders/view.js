'use strict';
goog.provide('good.drive.nav.folders');

goog.require('goog.ui.tree.TreeControl');
goog.require('good.drive.nav.folders.Model');

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

	var model_ = new good.drive.nav.folders.Model(this);
	this.model = model_;
};

/**
 * @param {goog.ui.tree.TreeControl} parent
 * @param {number} idx
 * @param {good.realtime.CollaborativeList} value
 * @return {goog.ui.tree.TreeNode}
 */
good.drive.nav.folders.Tree.prototype.insertNode = function(parent, idx, value) {
	console.log(parent.getHtml() + "-" + idx + "-" + value);
	// this.render(parent, children, idx);
	var title = goog.isString(value) ? value : value.get(0);
	var childNode = parent.getTree().createNode('');
	// if (idx < parent.getChildCount() - 1) {
	// parent.removeChildAt(idx);
	// parent.addChildAt(childNode, idx);
	// } else {
	parent.add(childNode);
	// }
	childNode.setHtml(title);
	return childNode;
};

good.drive.nav.folders.Tree.prototype.insertFolder = function(parent, idx,
		data, parentHolder, childrenHolder) {
	data = goog.isArray(data) ? data : data.asArray();
	for ( var i = 0; i < data.length; i++) {
		var childNode = parent.getTree().createNode('');
		if(parentHolder != undefined) {
			parentHolder.dom = childNode;
		} else {
			childrenHolder[i].dom = childNode;
		}
		if (idx == undefined) {
			parent.add(childNode);
		} else {
			parent.removeChildAt(idx + i);
			parent.addChildAt(childNode, idx + i);
		}
		var value = data[i];
		if (goog.isString(value)) {
			childNode.setHtml(value);
			continue;
		}
		childNode.setHtml(value.get(0));
		if (value.get(1)) {
			this.insertFolder(childNode, undefined, value.get(1), undefined, childrenHolder);
		}
	}
};
