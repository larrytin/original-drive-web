'use strict';
goog.provide('good.drive.nav.folders.ViewControl');

goog.require('good.drive.nav.folders.AbstractControl');
goog.require('good.drive.nav.grid');
goog.require('goog.ui.tree.BaseNode');
goog.require('goog.ui.tree.TreeControl');

/**
 * @constructor
 * @param {string} docid
 * @extends {good.drive.nav.folders.AbstractControl}
 */
good.drive.nav.folders.ViewControl = function(docid) {
  good.drive.nav.folders.AbstractControl.call(this, docid);
  this._title = undefined;
  this.lazyBind = false;
};
goog.inherits(good.drive.nav.folders.ViewControl,
    good.drive.nav.folders.AbstractControl);

/**
 * @enum {string}
 */
good.drive.nav.folders.ViewControl.ViewControlType = {
  LABEL: 'label',
  FOLDERS: 'folders',
  FILES: 'files'
};

/** @type {string} */
good.drive.nav.folders.ViewControl.BASEDATA = ['我的课件', '我的音乐', '我的视频', '我的图片'];

/**
 * @override
 */
good.drive.nav.folders.ViewControl.prototype.connect = function(doc) {
  this.mappingView(this.view(), this.model().getData());
};

/**
 * @param {goog.ui.tree.TreeControl} view
 * @param {good.realtime.CollaborativeMap} data
 */
good.drive.nav.folders.ViewControl.prototype.mappingView =
  function(view, data) {
  var tree = view.tree;
  this.addEvent(tree, data);
  data.set(this.getLabelKey(), this._title);
};

/**
 * @param {goog.ui.tree.TreeControl} root
 * @param {good.realtime.CollaborativeList} path
 */
good.drive.nav.folders.ViewControl.prototype.locationNode =
  function(root, path) {
  this.locationNode_(root, path, parseInt(0), path.length());
};

/**
 * @param {goog.ui.tree.TreeControl} parentNode
 * @param {good.realtime.CollaborativeList} path
 * @param {number} idx
 * @param {number} pathleg
 * @private
 */
good.drive.nav.folders.ViewControl.prototype.locationNode_ =
  function(parentNode, path, idx, pathleg) {
  if (idx >= pathleg) {
    return;
  }
  if (!parentNode.getExpanded()) {
    parentNode.setExpanded(true);
  }
  var length = parentNode.getChildCount();
  if (length == 0) {
    return;
  }
  var pathId = path.get(idx);
  for (var i = 0; i < length; i++) {
    var child = parentNode.getChildAt(i);
    var childId = child.mapid;
    if (childId == pathId) {
      if (idx == (pathleg - 1)) {
        child.getTree().setSelectedItem(child);
//        good.drive.nav.grid.View.createGrid(child.map, this.model().docId());
      }
      this.locationNode_(child, path, idx + 1, pathleg);
      break;
    }
  }
};

/**
 * @param {good.realtime.CollaborativeList} pathlist
 * @param {good.realtime.CollaborativeMap} pathmap
 */
good.drive.nav.folders.ViewControl.prototype.buildPath =
  function(pathlist, pathmap) {
  var parentNode = this.view().getCurrentItem();
  var docid = pathmap.get(good.drive.nav.folders.Path.NameType.CURRENTDOCID);
  if (docid != this.model().docId() &&
      (parentNode == null || this.isCurrentPath(pathlist, parentNode.mapid))) {
    return;
  }
  var paths = [];
  pathlist.clear();
  this.buildPath_(parentNode, paths);
  pathlist.pushAll(paths);
};

/**
 * @param {goog.ui.tree.TreeControl} parentNode
 * @param {Array.<Object>} paths
 * @private
 */
good.drive.nav.folders.ViewControl.prototype.buildPath_ =
  function(parentNode, paths) {
  if (parentNode == null || parentNode == parentNode.getTree()) {
    return;
  }
  this.buildPath_(parentNode.getParent(), paths);
  paths.push(parentNode.mapid);
};

/**
 * @param {good.realtime.CollaborativeList} pathlist
 * @param {string} mapid
 * @return {boolean}
 */
good.drive.nav.folders.ViewControl.prototype.isCurrentPath =
  function(pathlist, mapid) {
  if (pathlist.length() == 0) {
    return false;
  }
  if (mapid == undefined) {
    return true;
  }
  var mapid_ = pathlist.get(pathlist.length() - 1);
  if (mapid_ == mapid) {
    return true;
  }
  return false;
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeMap} map
 */
good.drive.nav.folders.ViewControl.prototype.addEvent = function(node, map) {
  if (this.bindData(node, map)) {
    return;
  }
  this.dataHandle(node, this.getChildList(map));
  this.nodeHandle(node, this.getChildList(map));
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeList} list
 */
good.drive.nav.folders.ViewControl.prototype.dataHandle = function(node, list) {
  var that = this;
  list.addValuesAddedListener(function(evt) {
    if (!node.getExpanded() || node.getChildCount() == list.length()) {
      return;
    }
    node.setExpanded(true);
    var idx = evt.getIndex();
    var vals = evt.getValues();
    var id = node.getId();
//    var grid = that.getGridById(id);
    for (var i in vals) {
      var val = vals[i];
      var title = val.get(that.getLabelKey());
      var childNode = that.view().insertNode(node, val, title);
      that.mapHander(node, childNode, val);
      that.addEvent(childNode, val);
//      if (grid == null) {
//        continue;
//      }
//      grid.insertCell(val, true);
    }
  });
  list.addValuesRemovedListener(function(evt) {
    var idx = evt.getIndex();
    var vals = evt.getValues();
    for (var i in vals) {
      var val = vals[i];
      var removeNode = that.view().removeNode(node, idx);
//      var parentGrid = that.getGridById(node.getId());
//      if (parentGrid == null) {
//        continue;
//      }
//      var id = removeNode.getId();
//      var grid = that.getGridById(id);
//      if (that.removeGridById(id)) {
//        grid.removeFromParent();
//        parentGrid.removeCell(val);
//      }
    }
  });
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeList} list
 */
good.drive.nav.folders.ViewControl.prototype.nodeHandle = function(node, list) {
  var that = this;
  var init = true;
  node.getHandler().listen(
      node, goog.ui.tree.BaseNode.EventType.BEFORE_EXPAND,
      function(e) {
        if (list.length() == 0 && node.hasChildren()) {
          return;
        }

        if (node.getChildCount() > 0) {
          return;
        }
        for (var i = 0; i < list.length(); i++) {
          var val = list.get(i);
          var title = val.get(that.getLabelKey());
          var childNode = that.view().insertNode(node, val, title);
          that.mapHander(node, childNode, val);
          that.addEvent(childNode, val);
        }
      });
  node.getHandler().listen(node,
      goog.ui.tree.BaseNode.EventType.EXPAND,
      function(e) {
        if (node.getChildCount() == 0) {
          return;
        }
        if (init) {
          init = false;
          var children = node.getChildren();
          for (var i in children) {
            var child = children[i];
            that.view().customNode(child);
          }
        }
      });
};

/**
 * @param {goog.ui.tree.TreeControl} parentNode
 * @param {goog.ui.tree.TreeControl} selfNode
 * @param {good.realtime.CollaborativeMap} map
 */
good.drive.nav.folders.ViewControl.prototype.mapHander =
    function(parentNode, selfNode, map) {
  var that = this;
  map.addValueChangedListener(function(evt) {
    var property = evt.getProperty();
    if (property != that.getLabelKey()) {
      return;
    }
    var newValue = evt.getNewValue();
    var oldValue = evt.getOldValue();
    if (oldValue == null) {
      return;
    }
    that.view().setNodeTitle(selfNode, map, newValue);
  });
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeMap} map
 * @return {boolean}
 */
good.drive.nav.folders.ViewControl.prototype.bindData = function(node, map) {
  if (node.map != undefined) {
    return true;
  }
  node.mapid = map.getId();
  node.map = map;
  return false;
};

/**
 * @param {string} id
 * @return {good.drive.nav.grid.View}
 */
good.drive.nav.folders.ViewControl.prototype.getGridById =
  function(id) {
  var cells = goog.object.get(
      good.drive.nav.grid.View.grids, this.model().docId());
  if (!goog.object.containsKey(cells, id)) {
    return null;
  }
  return goog.object.get(cells, id);
};

/**
 * @param {string} id
 * @return {good.drive.nav.grid.View}
 */
good.drive.nav.folders.ViewControl.prototype.removeGridById =
  function(id) {
  var cells = goog.object.get(good.drive.nav.grid.View.grids,
      this.model().docId());
  return goog.object.remove(cells, id);
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {Object} param {type, value};
 */
good.drive.nav.folders.ViewControl.prototype.addLeaf = function(node, param) {
  var map = this.model().getLeaf(this.getKeyType());
  goog.object.forEach(param, function(value, key) {
    if (map.get(key) == undefined) {
      return;
    }
    map.set(key, value);
  });
  this.model().push(this.getChildList(node.map), map);
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {number} idx
 * @param {string} str
 */
good.drive.nav.folders.ViewControl.prototype.renameLeaf =
  function(node, idx, str) {
  this.model().renameLabel(
      this.model().getChildByIdx(this.getChildList(node.map), idx), str);
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {number} idx
 */
good.drive.nav.folders.ViewControl.prototype.removeLeaf = function(node, idx) {
  this.model().removeChildByIdx(this.getChildList(node.map), idx);
};

/**
 * @param {string} title
 */
good.drive.nav.folders.ViewControl.prototype.setTitle = function(title) {
  this._title = title;
};

/**
 * @return {Object}
 */
good.drive.nav.folders.ViewControl.prototype.view = function() {
  return this._view;
};

/**
 * @param {Object} view
 */
good.drive.nav.folders.ViewControl.prototype.setView = function(view) {
  this._view = view;
};

/**
 * @param {good.realtime.CollaborativeMap} map
 * @return {Object}
 */
good.drive.nav.folders.ViewControl.prototype.getChildList =
  function(map) {
  return map.get(this.getChildKey());
};

/**
 * @param {good.realtime.CollaborativeMap} map
 * @return {string}
 */
good.drive.nav.folders.ViewControl.prototype.getLabel =
  function(map) {
  return map.get(this.getLabelKey());
};

good.drive.nav.folders.ViewControl.prototype.getChildKey =
  function() {
  return this.getKeyType().FOLDERS[0];
}

good.drive.nav.folders.ViewControl.prototype.getLabelKey =
  function() {
  return this.getKeyType().LABEL[0];
}

/**
 * @return {Object} {key : [name, type, default]}
 */
good.drive.nav.folders.ViewControl.prototype.getKeyType = function() {
  return {LABEL: ['label', 'string'], FOLDERS: ['folders', 'list'],
    FILES: ['files', 'list']};
};

/**
 * @override
 */
good.drive.nav.folders.ViewControl.prototype.initdata = function(mod) {
  var name = good.drive.nav.folders.ViewControl.BASEDATA;
  var root_ = mod.getRoot();

  var rootFolders = mod.createList();
  var rootFiles = mod.createList();
  root_.set(this.getKeyType().FOLDERS[0],
      rootFolders);
  root_.set(this.getKeyType().FILES[0],
      rootFiles);

  var folder;
  var subFolders;
  var subFolder;

  var folders = [];
  for (var i in name) {
    folder = mod.createMap();
    folder.set(this.getLabelKey(), name[i]);
    folder.set(this.getChildKey(),
        mod.createList());
    folder.set(this.getKeyType().FILES[0],
        mod.createList());
    folders.push(folder);
  }
  rootFolders.pushAll(folders);

  for (var i in name) {
    subFolders = folders[i].get(this.getChildKey());
    for (var j in name) {
      subFolder = mod.createMap();
      subFolder.set(this.getChildKey(),
          mod.createList());
      subFolder.set(this.getKeyType().FILES[0],
          mod.createList());
      subFolder.set(this.getLabelKey(),
          name[i] + j);
      subFolders.push(subFolder);
    }
  }
};
