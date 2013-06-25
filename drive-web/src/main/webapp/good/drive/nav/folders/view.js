'use strict';
goog.provide('good.drive.nav.folders');

goog.require('goog.dom');
goog.require('goog.ui.tree.TreeControl');
goog.require('good.drive.nav.folders.Model');

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
	this.model = model_
};

/*
 * good.drive.nav.folders.Tree.prototype.renderTree = function(doc) {
 * this.render(this.tree, this.root.get('folders')); };
 */

/*good.drive.nav.folders.Tree.prototype.render = function(parent, data, idx) {
 data = goog.isArray(data) ? data : data.asArray();
 for ( var i = 0; i < data.length; i++) {
 var childNode = parent.getTree().createNode('');
 if (idx == undefined) {
 parent.add(childNode);
 } else {
 if (idx < parent.getChildCount() - 1) {
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
 };*/

/*
 * good.drive.nav.folders.Tree.prototype.connectRealtime = function(doc) { var
 * list = this.root.get('folders'); this.listenerBind(this.tree, list); };
 */

/*
 * good.drive.nav.folders.Tree.prototype.listenerBind = function(parent, list,
 * idx) { this.bind(parent, list); if (list.length() > 1) { for ( var i = 0; i <
 * list.length(); i++) { var children; if(idx == undefined) { children =
 * parent.getChildAt(i); } else { children = parent.getChildAt(idx);
 * if(goog.isObject(list.get(i))) { this.listenerBind(children, list.get(i)); }
 * continue; } var value = list.get(i); if(goog.isString(value)) { continue; }
 * if(goog.isObject(value) && value.length() == 2) { this.bind(parent, value); }
 * this.listenerBind(children, value.get(1)); } } }
 */

/*
 * good.drive.nav.folders.Tree.prototype.bind = function(parent, list) { var
 * that = this; var init = true; var event = function(evt) { if(init) { init =
 * false; return; } var parent_ = parent; var children = evt.getValues(); var
 * idx = evt.getIndex(); that.insertNodes(parent, idx, children) for(var c in
 * children) { if(goog.isObject(children[c])) { that.listenerBind(parent,
 * children[c], idx); } } } list.addValuesAddedListener(event); }
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
		value) {
	value = goog.isArray(value) ? value : value.asArray();
	for ( var i = 0; i < value.length; i++) {
		var childNode = parent.getTree().createNode('');
		if (idx == undefined) {
			parent.add(childNode);
		} else {
			if (idx < parent.getChildCount() - 1) {
				parent.removeChildAt(idx + i);
			}
			parent.addChildAt(childNode, idx + i);
		}
		var value = value[i];
		if (goog.isString(value)) {
			childNode.setHtml(value);
			continue;
		}
		childNode.setHtml(value.get(0));
		if (value.get(1)) {
			this.insertFolder(childNode, value.get(1));
		}
	}
}

good.drive.nav.folders.start = function() {
	var tree_ = new good.drive.nav.folders.Tree();
}

goog.exportSymbol('good.drive.nav.folders.start', good.drive.nav.folders.start);