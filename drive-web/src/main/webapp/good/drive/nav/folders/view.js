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
	good.realtime.setChannel('http://192.168.1.15:8888');
	var onInit = function(mod) {
		importData(mod);
	};

	var onLoad = function(doc) {
		that.doc = doc;
		that.mod = that.doc.getModel();
		that.root = that.mod.getRoot();

		that.renderTree(doc);
		// connectUi();
		that.connectRealtime(doc);
	};
	good.realtime.load('@tmp/myFolders1', onLoad, onInit, null);
};

good.drive.nav.folders.view.Tree.prototype.renderTree = function(doc) {
	this.render(this.tree, this.root.get('folders'));
};

good.drive.nav.folders.view.Tree.prototype.render = function(parent, data, idx) {
	data = goog.isArray(data) ? data : data.asArray();
	for ( var i = 0; i < data.length; i++) {
		var childNode = parent.getTree().createNode('');
		if(idx == undefined) {
			parent.add(childNode);
		} else {
			if(idx < parent.getChildCount() - 1) {
				parent.removeChildAt(idx + i);
			}
			parent.addChildAt(childNode, idx + i);
		}
		var value = data[i];
		if (goog.isString(value)) {
			childNode.setHtml(value);
			continue;
		}
		childNode.setHtml(value.get(0));
		if (value.get(1)) {
			this.render(childNode, value.get(1));
		}
	}
};

good.drive.nav.folders.view.Tree.prototype.connectRealtime = function(doc) {
	var list = this.root.get('folders');
	this.listenerBind(this.tree, list);
};

good.drive.nav.folders.view.Tree.prototype.listenerBind = function(parent, list, idx) {
	this.bind(parent, list);
	if (list.length() > 1) {
		for ( var i = 0; i < list.length(); i++) {
			var children;
			if(idx == undefined) {
				children = parent.getChildAt(i);
			} else {
				children = parent.getChildAt(idx);
				if(goog.isObject(list.get(i))) {
					this.listenerBind(children, list.get(i));
				}
				continue;
			}
			var value = list.get(i);
			if(goog.isString(value)) {
				continue;
			}
			if(goog.isObject(value) && value.length() == 2) {
				this.bind(parent, value);
			}
			this.listenerBind(children, value.get(1));
		}
	}
}

good.drive.nav.folders.view.Tree.prototype.listenerUnBind = function(parent, list, idx) {
	this.bind(parent, list);
	if (list.length() > 1) {
		for ( var i = 0; i < list.length(); i++) {
			var children;
			if(idx == undefined) {
				children = parent.getChildAt(i);
			} else {
				children = parent.getChildAt(idx);
				if(goog.isObject(list.get(i))) {
					this.listenerBind(children, list.get(i));
				}
				continue;
			}
			var value = list.get(i);
			if(goog.isString(value)) {
				continue;
			}
			if(goog.isObject(value) && value.length() == 2) {
				this.bind(parent, value);
			}
			this.listenerBind(children, value.get(1));
		}
	}
}

good.drive.nav.folders.view.Tree.prototype.bind = function(parent, list) {
	var that = this;
	var init = true;
	var event = function(evt) {
		if(init) {
			init = false;
			return;
		}
		var parent_ = parent;
		var children = evt.getValues();
		var idx = evt.getIndex();
		that.insertNodes(parent, idx, children)
		for(var c in children) {
			if(goog.isObject(children[c])) {
				that.listenerBind(parent, children[c], idx);
			}
		}
	}
	list.addValuesAddedListener(event);
}

good.drive.nav.folders.view.Tree.prototype.insertNodes = function(parent, idx,
		children) {
	console.log(parent.getHtml() + "-" + idx + "-" + children);
	this.render(parent, children, idx);
};

good.drive.nav.folders.view.Tree.prototype.addFolder = function(list, idx, data) {
	var str = list.get(idx);
	var leaf = this.mod.createList();
	leaf.push(data);
	var root = this.mod.createList();
	root.push(str);
	root.push(leaf);
	list.replaceRange(idx, root);
}

good.drive.nav.folders.view.start = function() {
	var tree = new good.drive.nav.folders.view.Tree();
	window.tree = tree;
}

goog.exportSymbol('good.drive.nav.folders.view.start',
		good.drive.nav.folders.view.start);