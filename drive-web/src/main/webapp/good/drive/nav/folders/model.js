'use strict';
goog.provide('good.drive.nav.folders.Model');



/**
 * @constructor
 * @param {good.drive.nav.folders.Tree} view
 */
good.drive.nav.folders.Model = function(view) {
  this.view = view;

  window.modelbak = this;
  var that = this;
  // good.realtime.setChannel('http://192.168.1.15:8888');
  // good.net.CrossDomainRpc.BASE_URL = 'http://192.168.1.15:8888/_ah/api/';
  var onInit = function(mod) {
    that.initmap(mod);
  };

  var onLoad = function(doc) {
    that.doc = doc;
    that.mod = that.doc.getModel();
    that.root = that.mod.getRoot();

    // connectUi();
    that.connect(doc);
  };
  good.realtime.load('@tmp/b20', onLoad, onInit, null);
};


/**
 * @enum {string}
 */
good.drive.nav.folders.Model.strType = {
  LABEL: 'label',
  FOLDERS: 'folders',
  FOLDERSCHILD: 'folderschild',
  FILECHILD: 'filechild'
};


/** @type {string} */
good.drive.nav.folders.Model.BASEDATA = ['我的课件', '我的音乐', '我的视频', '我的图片'];


/**
 * @param {good.realtime.Document} doc
 */
good.drive.nav.folders.Model.prototype.connect = function(doc) {
  var folders = this.root.get(good.drive.nav.folders.Model.strType.FOLDERSCHILD);
  var files = this.root.get(good.drive.nav.folders.Model.strType.FILECHILD);
  var that = this;
  this.addEvent(that.view.tree, folders, files);
};


/**
 * @param {goog.ui.tree.TreeControl} parentNode
 * @param {goog.ui.tree.TreeControl} selfNode
 * @param {good.realtime.CollaborativeMap} map
 */
good.drive.nav.folders.Model.prototype.mapHander =
    function(parentNode, selfNode, map) {
  var that = this;
  map.addValueChangedListener(function(evt) {
    var property = evt.getProperty();
    if (property != good.drive.nav.folders.Model.strType.LABEL) {
      return;
    }
    var newValue = evt.getNewValue();
    var oldValue = evt.getOldValue();
    if (oldValue.length == 0) {
      return;
    }
    that.view.setNodeTitle(selfNode, newValue);
  });
};


/**
 * @param {string} str
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Model.prototype.getLeaf =
    function(str) {
  var map = this.mod.createMap();
  map.set(good.drive.nav.folders.Model.strType.LABEL,
      str);
  var list = this.mod.createList();
  map.set(good.drive.nav.folders.Model.strType.FOLDERSCHILD,
      list);
  list = this.mod.createList();
  map.set(good.drive.nav.folders.Model.strType.FILECHILD,
      list);

  return map;
};


/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeList} list
 */
good.drive.nav.folders.Model.prototype.dataHandle = function(node, list) {
  var that = this;
  list.addValuesAddedListener(function(evt) {
    if (!that.view.hasExtended(node)) {
      return;
    }
    node.setExpanded(true);
    var idx = evt.getIndex();
    var vals = evt.getValues();
    for (var i in vals) {
      var val = vals[i];
      var childNode = that.view.insertNode(node, idx, val);
      that.mapHander(node, childNode, val);
      that.addEvent(childNode, val.get(
          good.drive.nav.folders.Model.strType.FOLDERSCHILD),
          val.get(good.drive.nav.folders.Model.strType.FILECHILD));
    }
  });
  list.addValuesRemovedListener(function(evt) {
    var idx = evt.getIndex();
    that.view.removeNode(node, idx);
  });
};


/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeList} list
 */
good.drive.nav.folders.Model.prototype.addEvent = function(node, folder, file) {
  if (this.bindFolderData(node, folder) || this.bindFileData(node, file)) {
    return;
  }
  this.dataHandle(node, folder);
  this.view.nodeHandle(node, folder);
};


/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeList} list
 * @return {boolean}
 */
good.drive.nav.folders.Model.prototype.bindFolderData = function(node, list) {
  if (node.folder != undefined) {
    return true;
  }
  node.folder = list;
  return false;
};

good.drive.nav.folders.Model.prototype.bindFileData = function(node, list) {
  if (node.file != undefined) {
    return true;
  }
  node.file = list;
  return false;
};


/**
 * @param {good.realtime.Model} mod
 */
good.drive.nav.folders.Model.prototype.initList = function(mod) {
  var name = good.drive.nav.folders.Model.BASEDATA;
  var testdata = mod.getRoot();
  var rootlist;
  var leaflist;

  var folders = mod.createList();
  testdata.set(good.drive.nav.folders.Model.strType.FOLDERS, folders);

  for (var i in name) {
    rootlist = mod.createList();
    rootlist.push(name[i]);
    leaflist = mod.createList();
    leaflist.push(name[i] + 'a');
    leaflist.push(name[i] + 'b');
    leaflist.push(name[i] + 'c');
    leaflist.push(name[i] + 'd');
    rootlist.push(leaflist);

    folders.push(rootlist);

    //    rootlist = mod.createList();
    //    rootlist.push(name[i] + "一年级");
    //    leaflist = mod.createList();
    //    leaflist.push(name[i] + "a");
    //    leaflist.push(name[i] + "b");
    //    leaflist.push(name[i] + "c");
    //    leaflist.push(name[i] + "d");
    //
    //    folders.get(i).get(1).push(rootlist);
  }
};


/**
 * @param {good.realtime.Model} mod
 */
good.drive.nav.folders.Model.prototype.initmap = function(mod) {
  var name = good.drive.nav.folders.Model.BASEDATA;
  var root_ = mod.getRoot();

  var rootFolders = mod.createList();
  var rootFiles = mod.createList();
  root_.set(good.drive.nav.folders.Model.strType.FOLDERSCHILD, rootFolders);
  root_.set(good.drive.nav.folders.Model.strType.FILECHILD, rootFiles);

  var folder;
  var subFolders;
  var subFolder;

  var folders = [];
  for (var i in name) {
    folder = mod.createMap();
    folder.set(good.drive.nav.folders.Model.strType.LABEL, name[i]);
    folder.set(good.drive.nav.folders.Model.strType.FOLDERSCHILD,
        mod.createList());
    folder.set(good.drive.nav.folders.Model.strType.FILECHILD,
        mod.createList());
    folders.push(folder);
  }
  rootFolders.pushAll(folders);

  for (var i in name) {
    subFolders = folders[i].get(
        good.drive.nav.folders.Model.strType.FOLDERSCHILD);
    for (var j in name) {
      subFolder = mod.createMap();
      subFolder.set(good.drive.nav.folders.Model.strType.FOLDERSCHILD,
          mod.createList());
      subFolder.set(good.drive.nav.folders.Model.strType.FILECHILD,
          mod.createList());
      subFolder.set(good.drive.nav.folders.Model.strType.LABEL,
          name[i] + j);
      subFolders.push(subFolder);
    }
  }
};
