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
  good.realtime.load('@tmp/b10', onLoad, onInit, null);
};


/** @type {string} */
good.drive.nav.folders.Model.BASEDATA =
    ['我的课件', '我的音乐', '我的视频', '我的科学'];


/** @type {string} */
good.drive.nav.folders.Model.LABEL = 'label';


/** @type {string} */
good.drive.nav.folders.Model.FOLDERS = 'folders';


/** @type {string} */
good.drive.nav.folders.Model.FOLDERSCHILD = 'folderschild';


/** @type {string} */
good.drive.nav.folders.Model.FILECHILD = 'filechild';


/**
 * @param {good.realtime.Document} doc
 */
good.drive.nav.folders.Model.prototype.connect = function(doc) {
  var folders = this.root.get(good.drive.nav.folders.Model.FOLDERS);
  var that = this;
  this.addEventListener({
    dom: that.view.tree
  }, folders);
};


/**
 * @param {Object} parentHolder
 * @param {good.realtime.CollaborativeList} list
 * @return {Array.<Object>}
 */
good.drive.nav.folders.Model.prototype.addEventListener = function(
    parentHolder, list) {
  var childrenDoms = [];
  this.listHander(list, parentHolder, childrenDoms);
  for (var i = 0, len = list.length(); i < len; i++) {
    var value = list.get(i);
    childrenDoms[i] = {};
    if (value instanceof good.realtime.CollaborativeMap) {
      this.mapHander(value, parentHolder, childrenDoms);
    }
    var children = value.get(good.drive.nav.folders.Model.FOLDERSCHILD);
    this.addEventListener(childrenDoms[i], children);
  }
  return childrenDoms;
};


/**
 * @param {good.realtime.CollaborativeMap} map
 * @param {Object} parentHolder
 * @param {Array.<Object>} childrenDoms
 */
good.drive.nav.folders.Model.prototype.mapHander = function(map,
    parentHolder, childrenDoms) {
  map.addValueChangedListener(function(evt) {
    var str = 'abc';
  });
};


/**
 * @param {string} str
 * @return {good.realtime.CollaborativeMap}
 */
good.drive.nav.folders.Model.prototype.getLeaf = function(str) {
  var map = this.mod.createMap();
  map.set(good.drive.nav.folders.Model.LABEL, str);
  var list = this.mod.createList();
  map.set(good.drive.nav.folders.Model.FOLDERSCHILD, list);
  list = this.mod.createList();
  map.set(good.drive.nav.folders.Model.FILECHILD, list);

  return map;
};


/**
 * @param {good.realtime.CollaborativeList} list
 * @param {Object} parentHolder
 * @param {Array.<Object>} childrenDoms
 */
good.drive.nav.folders.Model.prototype.listHander = function(list,
    parentHolder, childrenDoms) {
  var that = this;
  list.addValuesAddedListener(function(/** @type {good.realtime.ValueChangedEvent} */ evt) {
    var idx = evt.getIndex();
    var vals = evt.getValues();
    var parentDom = parentHolder.dom;
    var isAdd = false;
    if (parentDom.getChildCount() != 0) {
      isAdd = true;
    }
    if (parentDom.data == undefined) {
      parentDom.data = list;
    }
    for (var i in vals) {
      var val = vals[i];
      var arrayIdx = i;
      var intI = parseInt(i);
      if (isAdd) {
        var arrayIdx = idx + intI;
        childrenDoms[arrayIdx] = {};
        if (val instanceof good.realtime.CollaborativeMap) {
          that.mapHander(val, parentHolder, childrenDoms[arrayIdx]);
          that.addEventListener(
              childrenDoms[arrayIdx],
              val.get(good.drive.nav.folders.Model.FOLDERS));
        } else if (val instanceof good.realtime.CollaborativeList) {
          var childrenDomsbak = that.addEventListener(
              childrenDoms[arrayIdx], val);
          that.view.insertFolder(parentDom, arrayIdx, [val],
              childrenDoms[arrayIdx], childrenDomsbak);
          continue;
        }
      }
      childrenDoms[arrayIdx].dom = that.view.insertNode(
          parentDom, idx + intI, val);
    }
    isAdd = false;
  });
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
  testdata.set(good.drive.nav.folders.Model.FOLDERS, folders);

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

  var folders = mod.createList();
  root_.set(good.drive.nav.folders.Model.FOLDERS, folders);

  var map;
  var list;
  var mapchild;
  var listchild;

  for (var i in name) {
    map = mod.createMap();
    map.set(good.drive.nav.folders.Model.LABEL, name[i]);
    list = mod.createList();
    for (var i in name) {
      mapchild = mod.createMap();
      mapchild.set(good.drive.nav.folders.Model.LABEL, name[i] + i);
      listchild = mod.createList();
      mapchild.set(good.drive.nav.folders.Model.FOLDERSCHILD, listchild);
      listchild = mod.createList();
      mapchild.set(good.drive.nav.folders.Model.FILECHILD, listchild);
      list.push(mapchild);
    }
    map.set(good.drive.nav.folders.Model.FOLDERSCHILD, list);
    list = mod.createList();
    map.set(good.drive.nav.folders.Model.FILECHILD, list);

    folders.push(map);
  }
};


/**
 * @param {good.realtime.CollaborativeList} list
 * @param {number} idx
 * @param {string} data
 */
good.drive.nav.folders.Model.prototype.addFolder = function(list, idx, data) {
  var str = list.get(idx);
  var root = this.mod.createList();
  var leaf = this.mod.createList();
  root.push(str);
  root.push(leaf);
  leaf.push(data);
  list.replaceRange(idx, root);
};
