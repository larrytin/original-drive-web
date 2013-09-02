'use strict';
goog.provide('good.drive.nav.folders.ViewControl');

goog.require('good.drive.nav.folders.AbstractControl');
goog.require('good.drive.view.baseview');
goog.require('goog.ui.tree.BaseNode');
goog.require('goog.ui.tree.TreeControl');

/**
 * 这个是TreeView的控制类
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
 * Tree的基本数据类型
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
 * 加载完成Document之后调用这个方法对数据进行映射
 * @override
 */
good.drive.nav.folders.ViewControl.prototype.connect = function(doc) {
  this.mappingView(this.view(), this.model().getData());
};

/**
 * 映射数据和界面的关系
 * @param {goog.ui.tree.TreeControl} view
 * @param {good.realtime.CollaborativeMap} data
 */
good.drive.nav.folders.ViewControl.prototype.mappingView =
  function(view, data) {
  var tree = view.tree;
  this.view().customNode(tree, data);
  this.addEvent(tree, data);
  data.set(this.getLabelKey(), this._title);
};

/**
 * 根据一个path定位一个节点在整棵树中的位置
 * @param {goog.ui.tree.TreeControl} root
 * @param {good.realtime.CollaborativeList} path
 */
good.drive.nav.folders.ViewControl.prototype.locationNode =
  function(root, path) {
  var pathjsonLength = goog.array.count(path, function() {
    return true;
  });
  this.locationNode_(root, path, parseInt(0), pathjsonLength);
};

/**
 * 定位的具体实现 通过递归来遍历整棵树来匹配Path
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
  var pathId = path[idx];
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
 * 每次选中一个树后会调用这个方法 来构建这个数的pathlist
 * @param {good.realtime.CollaborativeList} pathlist
 * @param {good.realtime.CollaborativeMap} pathmap
 */
good.drive.nav.folders.ViewControl.prototype.buildPath =
  function(pathlist, pathmap) {
  var parentNode = this.view().getCurrentItem();
  if (parentNode == null) {
    return;
  }
  var path = good.drive.nav.folders.Path.getINSTANCE().path;
  var docid = path[good.drive.nav.folders.Path.NameType.CURRENTDOCID];
  var pathjson = path[good.drive.nav.folders.Path.NameType.CURRENTPATH];
  if (this.isCurrentPath(pathjson,
      parentNode.mapid, pathjson.length)) {
    return;
  }
//  if (docid == this.model().docId()) {
//    return;
//  }
  var paths = [];
  this.buildPath_(parentNode, paths);
  var i = 0;
  if (paths.length == pathjson.length) {
    if (docid == this.model().docId()) {
      while (true) {
        if (i >= pathjson.length) {
          return;
        }
        if (pathjson[i] != paths[i]) {
          break;
        }
        i++;
      }
    }
  }
  var curPath = {};
  curPath[good.drive.nav.folders.Path.NameType.CURRENTDOCID] =
    this.model().docId();
  curPath[good.drive.nav.folders.Path.NameType.CURRENTPATH] = paths;
  pathmap.set(good.drive.nav.folders.Path.NameType.PATH,
      curPath);
};

/**
 * 递归 构建一个从根节点开始 到当前节点的一个paht列表
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
 * pahtlis是否是当前节点映射的paht的值 如果是 则返回true 不是则返回false
 * @param {good.realtime.CollaborativeList} pathlist
 * @param {string} mapid
 * @param {number} pathCount
 * @return {boolean}
 */
good.drive.nav.folders.ViewControl.prototype.isCurrentPath =
  function(pathlist, mapid, pathCount) {
  if (pathlist.length == 0) {
    return false;
  }
  if (mapid == undefined) {
    return true;
  }
  var mapid_ = pathlist[pathCount - 1];
  var docid = good.drive.nav.folders.Path.getINSTANCE().getCurrentDocid();
  if (mapid_ == mapid && docid == this.model().docId()) {
    return true;
  }
  return false;
};

/**
 * 根据节点和数据添加事件
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
 * 数据事件的绑定
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeList} list
 */
good.drive.nav.folders.ViewControl.prototype.dataHandle = function(node, list) {
  var that = this;
  list.addValuesAddedListener(function(evt) {
    if (node.getChildCount() == 0 && list.length() == 1) {
      node.setExpanded(true);
    }
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
    if (that.getChildList(node.map).length() == 0) {
      if (!goog.dom.classes.has(node.getExpandIconElement(),
          'treedoclistview-expand-icon-hidden')) {
        goog.dom.classes.add(node.getExpandIconElement(),
        'treedoclistview-expand-icon-hidden');
      }
    }
    if (node.getChildCount() == 0) {
      return;
    }
    for (var i in vals) {
      var val = vals[i];
      var removeNode = that.view().removeNode(node, idx);
    }
  });
};

/**
 * 节点事件的绑定
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
            that.view().customNode(child, child.map);
          }
        }
      });
};

/**
 * 节点中的数据结构的时间绑定 主要是用来修改节点名称的时候实现同步
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
 * 绑定数据和节点的映射
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
 * 添加节点 由View调用
 * @param {goog.ui.tree.TreeControl} node
 * @param {Object} param
 */
good.drive.nav.folders.ViewControl.prototype.addLeaf = function(node, param) {
  var map = this.model().getLeaf(this.getKeyType());
  map = this.addLeafValue(map, param);
  this.model().push(this.getChildList(node.map), map);
};

/**
 * 添加节点 根绝param提供的数据自动匹配并添加到List中
 * @param {good.realtime.CollaborativeMap} map
 * @param {Object} param
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.ViewControl.prototype.addLeafValue =
  function(map, param) {
  var that = this;
  goog.object.forEach(param, function(value, key) {
    if (map.get(key) == undefined) {
      return;
    }
    switch (typeof(map.get(key))) {
    case 'string':
        map.set(key, value);
      break;
    case 'boolean':
      map.set(key, value);
    break;
    default:
      if (map.get(key) instanceof good.realtime.CollaborativeMap) {
        that.addLeafValue(map.get(key), value);
      } else if (map.get(key) instanceof good.realtime.CollaborativeList) {
        var list = map.get(key);
        goog.array.forEach(value, function(item) {
          list.push(item);
        });
        map.set(key, list);
      }
      break;
    }
  });
  return map;
};

/**
 * 根据idx修改一个节点的名字
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
 * 从一个节点移动到另一个节点
 * @param {good.realtime.CollaborativeMap} targetData
 * @param {Object} sourceData
 */
good.drive.nav.folders.ViewControl.prototype.moveToNode =
  function(targetData, sourceData) {
  var target;
  var source;
  var model = goog.object.get(good.drive.nav.folders.AbstractControl.docs,
      this.model().docId());
  if (sourceData instanceof good.realtime.CollaborativeMap) {
    var map = model.mod().createMap();
    var keys = sourceData.keys();
    for (var i in keys) {
      var key = keys[i];
      var value = sourceData.get(key);
      map.set(key, value);
    }
    if (sourceData.get('isfile')) {
      target = targetData.get(this.getKeyType().FILES[0]);
    } else {
      target = targetData.get(this.getKeyType().FOLDERS[0]);
    }
    source = map;
  } else {
    var map = model.mod().createMap();
    goog.object.forEach(sourceData, function(value, key) {
      if (key == 'filename') {
        map.set('label', value);
        return;
      }
      if (key == 'contentType') {
        map.set('type', value);
        return;
      }
      map.set(key, value);
    });
    map.set('isfile', true);
    source = map;
    target = targetData.get(this.getKeyType().FILES[0]);
  }
  for (var i = 0; i < target.length(); i++) {
    var data = target.get(i);
    if (data instanceof good.realtime.CollaborativeMap) {
      if (data.get('id') == source.get('id')) {
        return;
      }
    } else {
      if (data.get('id') == sourceData.id) {
        return;
      }
    }
  }
  target.push(source);
};

/**
 * 根据idx删除一个节点
 * @param {goog.ui.tree.TreeControl} node
 * @param {number} idx
 */
good.drive.nav.folders.ViewControl.prototype.removeLeaf = function(node, idx) {
  this.model().removeChildByIdx(this.getChildList(node.map), idx);
};

/**
 * 设置书顶层节点的title
 * @param {string} title
 */
good.drive.nav.folders.ViewControl.prototype.setTitle = function(title) {
  this._title = title;
};

/**
 * 获取View
 * @return {Object}
 */
good.drive.nav.folders.ViewControl.prototype.view = function() {
  return this._view;
};

/**
 * 动态设置一个View
 * @param {Object} view
 */
good.drive.nav.folders.ViewControl.prototype.setView = function(view) {
  this._view = view;
};

/**
 * 获取一个节点绑定数据他的子节点数据
 * @param {good.realtime.CollaborativeMap} map
 * @return {Object}
 */
good.drive.nav.folders.ViewControl.prototype.getChildList =
  function(map) {
  return map.get(this.getChildKey());
};

/**
 * 获取一个节点绑定数据他的子节点的标题信息
 * @param {good.realtime.CollaborativeMap} map
 * @return {string}
 */
good.drive.nav.folders.ViewControl.prototype.getLabel =
  function(map) {
  return map.get(this.getLabelKey());
};

/**
 * 默认获取了一个节点数据中用于申明子节点的字段名称
 * @return {string}
 */
good.drive.nav.folders.ViewControl.prototype.getChildKey =
  function() {
  return this.getKeyType().FOLDERS[0];
};

/**
 * 默认获取一个节点数据中用于声明节点标题的名称
 * @return {string}
 */
good.drive.nav.folders.ViewControl.prototype.getLabelKey =
  function() {
  return this.getKeyType().LABEL[0];
};

/**
 * 节点的数据结构
 * @return {Object}
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
