'use strict';
goog.provide('good.drive.nav.folders.Control');

goog.require('good.drive.nav.folders.Model');
goog.require('good.drive.nav.grid');
goog.require('goog.ui.tree.BaseNode');
goog.require('goog.ui.tree.TreeControl');

/**
 * @constructor
 * @param {string} str
 * @param {Object} view
 */
good.drive.nav.folders.Control = function(str, view) {
  var that = this;
  var model = new good.drive.nav.folders.Model(str);
  model.connect = function(doc) {
    that.mappingView(view, model.getData());
  };
  this._model = model;
  this._view = view;
};

/**
 * @constructor
 * @param {goog.ui.tree.TreeControl} view
 * @param {good.realtime.CollaborativeMap} data
 */
good.drive.nav.folders.Control.prototype.mappingView = function(view, data) {
  var tree = view.tree;
  var root = tree.getTree();
  var path = data.get(good.drive.nav.folders.Model.strType.PATH);
  this.addEvent(view.tree, data);
  this.pathHandle(root, path);
  root.path = path;
  if (path.length() == 0) {
    this.buildPath();
  }
};

/**
 * @param {goog.ui.tree.TreeControl} root
 * @param {good.realtime.CollaborativeList} path
 */
good.drive.nav.folders.Control.prototype.locationNode = function(root, path) {
  this.locationNode_(root, path, parseInt(0), path.length());
};

/**
 * @param {goog.ui.tree.TreeControl} parentNode
 * @param {good.realtime.CollaborativeList} path
 * @param {number} idx
 * @param {number} pathleg
 * @private
 */
good.drive.nav.folders.Control.prototype.locationNode_ =
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
  var pathId = path.get(idx).getId();
  for (var i = 0; i < length; i++) {
    var child = parentNode.getChildAt(i);
    var childId = child.map.getId();
    if (childId == pathId) {
      if (idx == (pathleg - 1)) {
        child.getTree().setSelectedItem(child);
        good.drive.nav.grid.View.createGrid(child);
      }
      this.locationNode_(child, path, idx + 1, pathleg);
      break;
    }
  }
};

/**
 */
good.drive.nav.folders.Control.prototype.buildPath = function() {
  var parentNode = this.view().getCurrentItem();
  if (this.isCurrentPath(parentNode.map)) {
    return;
  }
  var paths = [];
  var pathList = this.model().getData().get(
      good.drive.nav.folders.Model.strType.PATH);
  this.model().clear(pathList);
  this.buildPath_(parentNode, paths);
  this.model().pushAll(pathList, paths);
};

/**
 * @param {goog.ui.tree.TreeControl} parentNode
 * @param {Array.<Object>} paths
 * @private
 */
good.drive.nav.folders.Control.prototype.buildPath_ =
  function(parentNode, paths) {
  if (parentNode == parentNode.getTree()) {
    return;
  }
  this.buildPath_(parentNode.getParent(), paths);
  paths.push(parentNode.map);
};

/**
 * @param {good.realtime.CollaborativeMap} map
 * @return {boolean}
 */
good.drive.nav.folders.Control.prototype.isCurrentPath = function(map) {
  var path = this.model().getData().get(
      good.drive.nav.folders.Model.strType.PATH);
  if (path.length() == 0) {
    return false;
  }
  var map_ = path.get(path.length() - 1);
  if ((map_.getId()) == (map.getId())) {
    return true;
  }
  return false;
};

/**
 * @param {goog.ui.tree.TreeControl} root
 * @param {good.realtime.CollaborativeList} path
 */
good.drive.nav.folders.Control.prototype.pathHandle = function(root, path) {
  var that = this;
  path.addValuesAddedListener(function(evt) {
    that.locationNode(root, path);
  });
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeMap} map
 */
good.drive.nav.folders.Control.prototype.addEvent = function(node, map) {
  if (this.bindData(node, map)) {
    return;
  }
  this.dataHandle(node, node.folder);
  this.nodeHandle(node, node.folder);
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeList} list
 */
good.drive.nav.folders.Control.prototype.dataHandle = function(node, list) {
  var that = this;
  list.addValuesAddedListener(function(evt) {
    if (!node.getExpanded() || node.getChildCount() == list.length()) {
      return;
    }
    node.setExpanded(true);
    var idx = evt.getIndex();
    var vals = evt.getValues();
    var id = node.getId();
    var grid = that.getGridById(id);
    for (var i in vals) {
      var val = vals[i];
      var title = val.get(good.drive.nav.folders.Model.strType.LABEL);
      var childNode = that.view().insertNode(node, idx, title);
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
      var removeNode = that.view().removeNode(node, idx);
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
 * @param {good.realtime.CollaborativeList} list
 */
good.drive.nav.folders.Control.prototype.nodeHandle = function(node, list) {
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
          var title = val.get(good.drive.nav.folders.Model.strType.LABEL);
          var childNode = that.view().insertNode(node, 0, title);
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
good.drive.nav.folders.Control.prototype.mapHander =
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
    that.view().setNodeTitle(selfNode, newValue);
  });
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeMap} map
 * @return {boolean}
 */
good.drive.nav.folders.Control.prototype.bindData = function(node, map) {
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
 * @param {string} id
 * @return {good.drive.nav.grid.View}
 */
good.drive.nav.folders.Control.prototype.getGridById = function(id) {
  if (!goog.object.containsKey(good.drive.nav.grid.View.grids, id)) {
    return null;
  }
  return goog.object.get(good.drive.nav.grid.View.grids, id);
};

/**
 * @param {string} id
 * @return {good.drive.nav.grid.View}
 */
good.drive.nav.folders.Control.prototype.removeGridById = function(id) {
  return goog.object.remove(good.drive.nav.grid.View.grids, id);
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {string} str
 */
good.drive.nav.folders.Control.prototype.addLeaf = function(node, str) {
  var map = this.model().getLeaf(str);
  this.model().push(node.folder, map);
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {number} idx
 * @param {string} str
 */
good.drive.nav.folders.Control.prototype.renameLeaf = function(node, idx, str) {
  this.model().renameLabel(this.model().getChildByIdx(node.folder, idx), str);
};

/**
 * @param {goog.ui.tree.TreeControl} node
 * @param {number} idx
 */
good.drive.nav.folders.Control.prototype.removeLeaf = function(node, idx) {
  this.model().removeChildByIdx(node.folder, idx);
};


/**
 * @return {good.drive.nav.folders.Model}
 */
good.drive.nav.folders.Control.prototype.model = function() {
  return this._model;
};

/**
 * @return {Object}
 */
good.drive.nav.folders.Control.prototype.view = function() {
  return this._view;
};
