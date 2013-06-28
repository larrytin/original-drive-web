'use strict';
goog.provide('good.drive.nav.folders.Model');

/**
 * @constructor
 */
good.drive.nav.folders.Model = function(view) {
	this.view = view;

	window.modelbak = this;
	var that = this;
// good.realtime.setChannel('http://192.168.1.15:8888');
// good.net.CrossDomainRpc.BASE_URL = 'http://192.168.1.15:8888/_ah/api/';
	var onInit = function(mod) {
		that.init(mod);
	};

	var onLoad = function(doc) {
		that.doc = doc;
		that.mod = that.doc.getModel();
		that.root = that.mod.getRoot();

		// connectUi();
		that.connect(doc);
	};
	good.realtime.load('@tmp/a14', onLoad, onInit, null);
};

good.drive.nav.folders.Model.prototype.connect = function(doc) {
	var folders = this.root.get('folders');
	var that = this;
	this.addEventListener({
		dom : that.view.tree
	}, folders);
};

good.drive.nav.folders.Model.prototype.addEventListener = function(
		parentHolder, list) {
	var that = this;
	var childrenDoms = [];
	list.addValuesAddedListener(function(evt) {
		var idx = evt.getIndex();
		var vals = evt.getValues();
		var parentDom = parentHolder.dom;
		var isAdd = false;
		if(parentDom.getChildCount() != 0) {
			isAdd = true;
		}
		for ( var i in vals) {
			var val = vals[i];
			var arrayIdx = i;
			if(isAdd) {
				var arrayIdx = idx + parseInt(i);
				childrenDoms[arrayIdx] = {};
				if(goog.isObject(val)) {
					childrenDoms[arrayIdx].dom = that.view.insertFolder(parentDom, idx
							+ i, [val]);
// that.addEventListener(childrenDoms[arrayIdx], val.get(1));
					continue;
				}
			}
			childrenDoms[arrayIdx].dom = that.view.insertNode(parentDom, idx
					+ i, val);
		}
		isAdd = false;
	});
	for ( var i = 0, len = list.length(); i < len; i++) {
		var value = list.get(i);
		childrenDoms[i] = {};
		if (goog.isString(value)) {
			continue;
		}
		var children = value.get(1);
		this.addEventListener(childrenDoms[i], children);
	}
};

good.drive.nav.folders.Model.prototype.init = function(mod) {
// var name = [ "我的课件", "我的音乐", "我的视频", "我的科学" ];
// var testdata = mod.getRoot();
// var rootlist;
// var leaflist;
//
// var folders = mod.createList();
// testdata.set("folders", folders);
//	
// for ( var i in name) {
// rootlist = mod.createList();
// folders.push(rootlist);
// leaflist = mod.createList();
// rootlist.push(name[i]);
// rootlist.push(leaflist);
// leaflist.push(name[i] + "a");
// leaflist.push(name[i] + "b");
// leaflist.push(name[i] + "c");
// leaflist.push(name[i] + "d");

// rootlist = mod.createList();
// rootlist.push(name[i] + "一年级");
// leaflist = mod.createList();
// leaflist.push(name[i] + "a");
// leaflist.push(name[i] + "b");
// leaflist.push(name[i] + "c");
// leaflist.push(name[i] + "d");
// folders.get(i).get(1).push(rootlist);
	var testmod = mod;
	var testdata = mod.getRoot();
	var rootlist = testmod.createList();
	var leaflist;

	testdata.set('folders', rootlist);

	rootlist = testmod.createList();
	rootlist.push('课件');
	leaflist = testmod.createList();
	leaflist.push('a');
	leaflist.push('b');
	leaflist.push('c');
	leaflist.push('d');
	rootlist.push(leaflist);
	testdata.get('folders').push(rootlist);

	rootlist = testmod.createList();
	rootlist.push('音乐');
	leaflist = testmod.createList();
	leaflist.push('a');
	leaflist.push('b');
	leaflist.push('c');
	leaflist.push('d');
	rootlist.push(leaflist);
	testdata.get('folders').push(rootlist);

	rootlist = testmod.createList();
	rootlist.push('科学');
	leaflist = testmod.createList();
	leaflist.push('a');
	leaflist.push('b');
	leaflist.push('c');
	leaflist.push('d');
	rootlist.push(leaflist);
	testdata.get('folders').push(rootlist);

	rootlist = testmod.createList();
	rootlist.push('社会');
	leaflist = testmod.createList();
	leaflist.push('a');
	leaflist.push('b');
	leaflist.push('c');
	leaflist.push('d');
	rootlist.push(leaflist);
	testdata.get('folders').push(rootlist);

	rootlist = testmod.createList();
	rootlist.push('一年级');
	leaflist = testmod.createList();
	leaflist.push('a');
	leaflist.push('b');
	leaflist.push('c');
	leaflist.push('d');
	rootlist.push(leaflist);

	testdata.get('folders').get(0).get(1).push(rootlist);
};

good.drive.nav.folders.Model.prototype.addFolder = function(list, idx, data) {
	var str = list.get(idx);
	var root = this.mod.createList();
	var leaf = this.mod.createList();
	root.push(str);
	root.push(leaf);
	leaf.push(data);
	list.replaceRange(idx, root);
}
