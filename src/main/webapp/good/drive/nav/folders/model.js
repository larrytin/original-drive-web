'use strict';
goog.provide('good.drive.nav.folders.Model');

/**
 * 对Model进行封装的一个类
 * @constructor
 * @param {string} str
 */
good.drive.nav.folders.Model = function(str) {
//  this.view = view;

  window.modelbak = this;
  this._docId = str;
  this._isloaded = false;
  this._doc = undefined;
  this._mod = undefined;
  this._root = undefined;

//  var that = this;
//  var onInit = function(mod) {
//    that.initdata(mod);
//  };
//  var onLoad = function(doc) {
//    that.isloaded = true;
//    that.doc = doc;
//    that.mod = that.doc.getModel();
//    that.root = that.mod.getRoot();
//
//    // connectUi();
//    that.connect(doc);
//  };
//  good.realtime.load('@tmp/' + good.auth.Auth.current.userId +
//      '/' + this._docId, onLoad, onInit, null);
};

/**
 * Document加载时回调
 * @param {good.realtime.Document} doc
 */
good.drive.nav.folders.Model.prototype.connect = function(doc) {
};

/**
 * 是否加载完成
 * @return {boolean}
 */
good.drive.nav.folders.Model.prototype.isloaded = function() {
  return this._isloaded;
};

/**
 * 首次加载Document时回调
 * @param {good.realtime.Model} mod
 */
good.drive.nav.folders.Model.prototype.initdata = function(mod) {
};

/**
 * 将一个Map数组放置到List中
 * @param {good.realtime.CollaborativeList} list
 * @param {Array.<good.realtime.CollaborativeMap>} children
 */
good.drive.nav.folders.Model.prototype.pushAll = function(list, children) {
  list.pushAll(children);
};

/**
 * 将一个Map放置到List中
 * @param {good.realtime.CollaborativeList} list
 * @param {good.realtime.CollaborativeMap} map
 */
good.drive.nav.folders.Model.prototype.push = function(list, map) {
  list.push(map);
};

/**
 * 通过Id获取他的数据结构
 * @param {string} id
 * @return {Object}
 */
good.drive.nav.folders.Model.prototype.getObject = function(id) {
  return this._mod.getObject(id);
};

/**
 * 根据Idx删除List中的对象
 * @param {good.realtime.CollaborativeList} list
 * @param {number} idx
 */
good.drive.nav.folders.Model.prototype.removeChildByIdx = function(list, idx) {
  list.remove(idx);
};

/**
 * 创建一个List并返回
 * @return {good.realtime.CollaborativeList}
 */
good.drive.nav.folders.Model.prototype.createList = function() {
  return this._mod.createList();
};

/**
 * 获取一个List中idx的值
 * @param {good.realtime.CollaborativeList} list
 * @param {number} idx
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Model.prototype.getChildByIdx = function(list, idx) {
  return list.get(idx);
};

/**
 * 修改一个Map中Label字段的值
 * @param {good.realtime.CollaborativeMap} map
 * @param {string} str
 */
good.drive.nav.folders.Model.prototype.renameLabel = function(map, str) {
  map.set(
      good.drive.nav.folders.ViewControl.ViewControlType.LABEL, str);
};

/**
 * 清除List中的值
 * @param {good.realtime.CollaborativeList} list
 */
good.drive.nav.folders.Model.prototype.clear = function(list) {
  list.clear();
};

/**
 * 读取Document
 */
good.drive.nav.folders.Model.prototype.load = function() {
  var that = this;
  var onInit = function(mod) {
    that.initdata(mod);
  };
  var onLoad = function(doc) {
    that.isloaded = true;
    that._doc = doc;
    that._mod = that._doc.getModel();
    that._root = that._mod.getRoot();
    that.loadOther();
    // connectUi();
    that.connect(doc);
  };
  good.realtime.load(this._docId, onLoad, onInit, null);
};

/**
 * 读取其他的
 */
good.drive.nav.folders.Model.prototype.loadOther = function() {
};

/**
 * 根据Type获取一个构建好的有结构的Map
 * @param {Object} keyType
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Model.prototype.getLeaf =
    function(keyType) {
  var map = this._mod.createMap();
  var that = this;
  goog.object.forEach(keyType, function(value, key) {
    switch (value[1]) {
    case 'string':
      map.set(value[0], '');
      break;
    case 'list':
      map.set(value[0], that._mod.createList());
      break;
    case 'map':
      map.set(value[0], that._mod.createMap());
      break;
    case 'boolean':
      map.set(value[0], value[2]);
      break;
    default:
      map.set(value[0], that.getLeaf(value[1]));
      break;
    }
  });
  return map;
};

/**
 * 构建一个文件结构的Map
 * @param {string} name
 * @param {string} url
 * @param {string} type
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Model.prototype.getfileMap =
    function(name, url, type) {
  var map = this._mod.createMap();
  map.set(good.drive.nav.folders.ViewControl.ViewControlType.LABEL,
      name);
  map.set('url', url);
  map.set('type', type);
  map.set('process', '');
  map.set('isoffline', '');
  return map;
};

/**
 * 拷贝一个Object
 * @param {string} model
 * @param {Object} data
 * @return {Object}
 */
good.drive.nav.folders.Model.prototype.copy = function(model, data) {
  var bakdata;
  if (data instanceof good.realtime.CollaborativeMap) {
    bakdata = model.createMap();
    var keys = data.keys();
    for (var i in keys) {
      var key = keys[i];
      var value = data.get(key);
      bakdata.set(key, this.copy(model, value));
    }
    return bakdata;
  } else if (data instanceof good.realtime.CollaborativeList) {
    bakdata = model.createList();
    for (var i = 0; i < data.length(); i++) {
      var value = data.get(i);
      bakdata.push(this.copy(model, value));
    }
    return bakdata;
  } else {
    bakdata = data;
    return bakdata;
  }
};

/**
 * 根据数据删除
 * @param {Object} data
 * @return {Object}
 */
good.drive.nav.folders.Model.prototype.remove = function(data) {
  if (data instanceof good.realtime.CollaborativeMap) {
    var keys = data.keys();
    for (var i in keys) {
      var key = keys[i];
      var value = data.get(key);
      this.remove(value);
      data.remove(key);
    }
  } else if (data instanceof good.realtime.CollaborativeList) {
    for (var i = 0; i < data.length(); i++) {
      var value = data.get(i);
      var _data = this.remove(value);
      data.removeValue(_data);
    }
  } else {
    return data;
  }
};

/**
 * 获取Document id
 * @return {string}
 */
good.drive.nav.folders.Model.prototype.docId = function() {
  return this._docId;
};

/**
 * 获取Model
 * @return {good.realtime.Model}
 */
good.drive.nav.folders.Model.prototype.mod = function() {
  return this._mod;
};

/**
 * 获取初始化的Data数据
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Model.prototype.getData = function() {
  return this._root;
};
