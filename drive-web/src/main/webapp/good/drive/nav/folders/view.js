'use strict';
goog.provide('good.drive.nav.folders.view');

goog.require('goog.dom');
goog.require('goog.ui.tree.TreeControl');

var $ = goog.dom.getElement;

function makeTree() {
	var treeConfig = goog.ui.tree.TreeControl.defaultConfig;
	treeConfig['cleardotPath'] = '../../images/tree/cleardot.gif';
	var tree = new goog.ui.tree.TreeControl('我的云端硬盘', treeConfig);

	createTreeFromTestData(tree, testData);

	tree.render($('navfoldersview'));
	tree.setIsUserCollapsible(true);
	tree.setShowExpandIcons(false);
	tree.setExpanded(true);
}

function createTreeFromTestData(node, data) {
	for (var i = 0; i < data.length; i++) {
		var nodeData = data[i];
		var childNode = node.getTree().createNode('');
		node.add(childNode);
		childNode.setHtml(nodeData[0]);
		if (nodeData[1]) {
			createTreeFromTestData(childNode, nodeData[1]);
		}
	}
}

makeTree();
