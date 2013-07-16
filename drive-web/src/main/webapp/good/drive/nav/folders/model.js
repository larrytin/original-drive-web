'use strict';
goog.provide('good.drive.nav.folders.Model');

goog.require('good.drive.nav.grid');

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
    that.path = that.root.get(good.drive.nav.folders.Model.strType.PATH);

    // connectUi();
    that.connect(doc);
  };
  good.realtime.load('@tmp/' + good.auth.Auth.current.userId +
      '/androidTest002', onLoad, onInit, null);
};


/**
 * @enum {string}
 */
good.drive.nav.folders.Model.strType = {
  LABEL: 'label',
  FOLDERS: 'folders',
  FOLDERSCHILD: 'folderschild',
  FILECHILD: 'filechild',
  PATH: 'path'
};


/** @type {string} */
good.drive.nav.folders.Model.BASEDATA = ['我的课件', '我的音乐', '我的视频', '我的图片'];


/**
 * @param {good.realtime.Document} doc
 */
good.drive.nav.folders.Model.prototype.connect = function(doc) {
  this.addEvent(this.view.tree, this.root);
  this.pathHandle(this.view.tree);
  this.view.roottree.path = this.path;
  if (this.path.length() == 0) {
    this.view.buildPath();
  }
};

/**
 * @param {goog.ui.tree.TreeControl} root
 */
good.drive.nav.folders.Model.prototype.pathHandle = function(root) {
  var that = this;
  this.path.addValuesAddedListener(function(evt) {
    that.view.locationNode(that.path);
  });
};

/**
 * @param {good.realtime.CollaborativeMap} map
 * @return {boolean}
 */
good.drive.nav.folders.Model.prototype.isCurrentPath = function(map) {
  if (this.path.length() == 0) {
    return false;
  }
  var map_ = this.path.get(this.path.length() - 1);
  if ((map_.getId()) == (map.getId())) {
    return true;
  }
  return false;
};

/**
 */
good.drive.nav.folders.Model.prototype.clearPath = function() {
  this.path.clear();
//  var length = this.path.length();
//  if(length == 1) {
//    return;
//  }
//  this.path.removeRange(1, length);
};

/**
 * @param {Array.<Object>} paths
 */
good.drive.nav.folders.Model.prototype.pushPath = function(paths) {
  this.path.pushAll(paths);
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
    if (oldValue == null) {
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
    if (!that.view.hasExtended(node) || node.getChildCount() == list.length()) {
      return;
    }
    node.setExpanded(true);
    var idx = evt.getIndex();
    var vals = evt.getValues();
    var id = node.getId();
    var grid = that.getGridById(id);
    for (var i in vals) {
      var val = vals[i];
      var childNode = that.view.insertNode(node, idx, val);
      that.mapHander(node, childNode, val);
      that.addEvent(childNode, val);
      if (grid == null) {
        continue;
      }
      grid.insertCell(val, true);
    }
  });
  list.addValuesRemovedListener(function(evt) {
    var idx = evt.getIndex();
    var vals = evt.getValues();
    for (var i in vals) {
      var val = vals[i];
      var removeNode = that.view.removeNode(node, idx);
      var parentGrid = that.getGridById(node.getId());
      if (parentGrid == null) {
        continue;
      }
      var id = removeNode.getId();
      var grid = that.getGridById(id);
      if (that.removeGridById(id)) {
        grid.removeFromParent();
        parentGrid.removeCell(val);
      }
    }
  });
};

/**
 * @param {goog.ui.tree.TreeControl} node
 */
good.drive.nav.folders.Model.prototype.goToGrid = function(node) {
  good.drive.nav.grid.View.createGrid(node);
};

/**
 * @param {string} id
 * @return {good.drive.nav.grid.View}
 */
good.drive.nav.folders.Model.prototype.getGridById = function(id) {
  if (!goog.object.containsKey(good.drive.nav.grid.View.grids, id)) {
    return null;
  }
  return goog.object.get(good.drive.nav.grid.View.grids, id);
};

/**
 * @param {string} id
 * @return {good.drive.nav.grid.View}
 */
good.drive.nav.folders.Model.prototype.removeGridById = function(id) {
  return goog.object.remove(good.drive.nav.grid.View.grids, id);
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeMap} map
 */
good.drive.nav.folders.Model.prototype.addEvent = function(node, map) {
  if (this.bindData(node, map)) {
    return;
  }
  this.dataHandle(node, node.folder);
  this.view.nodeHandle(node, node.folder);
};


/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeMap} map
 * @return {boolean}
 */
good.drive.nav.folders.Model.prototype.bindData = function(node, map) {
  if (node.map != undefined) {
    return true;
  }
  node.map = map;
  node.folder = map.get(
      good.drive.nav.folders.Model.strType.FOLDERSCHILD);
  node.file = map.get(
      good.drive.nav.folders.Model.strType.FILECHILD);
  return false;
};

/**
 * @param {good.realtime.Model} mod
 */
good.drive.nav.folders.Model.prototype.initmap = function(mod) {
  var name = good.drive.nav.folders.Model.BASEDATA;
  var root_ = mod.getRoot();

  var rootFolders = mod.createList();
  var rootFiles = mod.createList();
  root_.set(good.drive.nav.folders.Model.strType.FOLDERSCHILD,
      rootFolders);
  root_.set(good.drive.nav.folders.Model.strType.FILECHILD,
      rootFiles);
//  var pathList = mod.createList();
//  pathList.push(root_);
  root_.set(good.drive.nav.folders.Model.strType.PATH, mod.createList());
  root_.set(good.drive.nav.folders.Model.strType.LABEL, '我的资料库');

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
