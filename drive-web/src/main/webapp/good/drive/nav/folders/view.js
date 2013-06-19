'use strict';
goog.provide('good.drive.nav.folders.view');

goog.require('goog.dom');
goog.require('goog.ui.tree.TreeControl');

good.drive.nav.folders.view.Tree = function() {
	var this_ = this;
	window.gdrOnLoad = function() {
		good.realtime.authorize('fakeUserId', 'fakeToken');
		var onInit = function(mod) {
			importData(mod);
		};

		var onLoad = function(doc) {
			window.doc = doc;
			window.mod = doc.getModel();
			window.root = mod.getRoot();
			if(window.root.size() == 0) {
				importData(mod);
			}
			// connectUi();
			this_.connectRealtime(doc);
		};
		good.realtime.load('@tmp/myFolders1', onLoad, onInit, null);
	};
};

good.drive.nav.folders.view.Tree.prototype.connectRealtime = function(doc) {
	this.makeTree();
};

good.drive.nav.folders.view.Tree.prototype.makeTree = function() {
	var treeConfig = goog.ui.tree.TreeControl.defaultConfig;
	treeConfig['cleardotPath'] = '../../images/tree/cleardot.gif';
	var tree = new goog.ui.tree.TreeControl('我的云端硬盘', treeConfig);

	this.createTreeFromTestData(tree, window.root.get('folders'));

	tree.render(goog.dom.getElement('navfolderslist'));
	tree.setIsUserCollapsible(true);
	tree.setShowExpandIcons(true);
	tree.setExpanded(true);
};

good.drive.nav.folders.view.Tree.prototype.createTreeFromTestData = function(
		node, data) {
	for ( var i = 0; i < data.length(); i++) {
		var value = data.get(i);
		var childNode = node.getTree().createNode('');
		childNode.data = node.add(childNode);
		if(goog.isString(value)) {
			childNode.setHtml(value);
			 continue;
		}
		childNode.setHtml(value.get(0));
		if (value.get(1)) {
			createTreeFromTestData(childNode, value);
		}
	}
};

var tree = new good.drive.nav.folders.view.Tree();