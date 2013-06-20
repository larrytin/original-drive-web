'use strict';
goog.provide('good.drive.nav.folders.view');

goog.require('goog.dom');
goog.require('goog.ui.tree.TreeControl');

good.drive.nav.folders.view.Tree = function() {
	var treeConfig = goog.ui.tree.TreeControl.defaultConfig;
	treeConfig['cleardotPath'] = '../../images/tree/cleardot.gif';
	var tree_ = new goog.ui.tree.TreeControl('我的云端硬盘', treeConfig);
	tree_.render(goog.dom.getElement('navfolderslist'));
	tree_.setIsUserCollapsible(true);
	tree_.setShowExpandIcons(true);
	tree_.setExpanded(true);

	this.tree = tree_;

	var that = this;
	good.realtime.authorize('fakeUserId', 'fakeToken');
	var onInit = function(mod) {
		importData(mod);
	};

	var onLoad = function(doc) {
		that.doc = doc;
		that.mod = that.doc.getModel();
		that.root = that.mod.getRoot();
		// connectUi();
		that.connectRealtime(doc);
	};
	good.realtime.load('@tmp/myFolders1', onLoad, onInit, null);
};

good.drive.nav.folders.view.Tree.prototype.connectRealtime = function(doc) {
	var list = this.root.get('folders');
	var that = this;
	list.addValuesAddedListener(function(evt) {
		var childer = evt.getValues();
		that.parseTree(that.tree, childer);
	});
};

good.drive.nav.folders.view.Tree.prototype.listenerBind = function(parent, list) {
	var that = this;
	list.addValuesAddedListener(function(evt) {
		that.insertNodes(parent, evt.getIndex(), evt.getValues());
	});
}

good.drive.nav.folders.view.Tree.prototype.insertNodes = function(parent, idx,
		children) {
	alert(idx);
	/*this.parseTree(parent, children);*/
};

good.drive.nav.folders.view.Tree.prototype.parseTree = function(node, data) {
	var length = goog.isArray(data) ? data.length : data.length();
	for(var i = 0; i < length; i++) {
		var childNode = node.getTree().createNode('');
		node.add(childNode);
		var value = goog.isArray(data) ? data[i] : data.get(i);
		if (goog.isString(value)) {
			childNode.setHtml(value);
			continue;
		}
		this.listenerBind(childNode, value);
		childNode.setHtml(value.get(0));
		if(value.get(1)) {
			var list = value.get(1);
			this.listenerBind(childNode, list);
			this.parseTree(childNode, list);
		}
	}
}

good.drive.nav.folders.view.Tree.prototype.createTreeFromTestData = function(
		node, jsonData) {
	var that = this;
	for ( var i = 0; i < jsonData.length(); i++) {
		var childNode = node.getTree().createNode('');
		node.add(childNode);
		var value;
		if (goog.isArray(jsonData)) {
			value = jsonData[0];
		} else {
			value = jsonData.get(i);
		}
		if (goog.isString(value)) {
			childNode.setHtml(value);
			continue;
		}
		childNode.setHtml(value.get(0));
		if (value.get(1)) {
			var childData = value.get(1);
			childData.addEventListener(good.realtime.EventType.VALUES_ADDED,
					function(evt) {
						that.insertNodes(childNode, evt.getIndex(), evt
								.getValues());
					});
			// this.createTreeFromTestData(childNode, childData, childData
			// .length());
		}
	}
};

good.drive.nav.folders.view.start = function() {
	var tree = new good.drive.nav.folders.view.Tree();
}

goog.exportSymbol('good.drive.nav.folders.view.start',
		good.drive.nav.folders.view.start);