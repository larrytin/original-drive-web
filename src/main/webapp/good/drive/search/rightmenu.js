'use strict';
goog.provide('good.drive.search.rigthmenu');

goog.require('good.drive.preview.previewcontrol');
goog.require('good.drive.rightmenu');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.ui.SubMenu');


/**
 * @constructor
 * @param {Element} dom
 */
good.drive.search.Rightmenu = function(dom) {
  var that = this;
  this._rightMenu = undefined;
  var submenu = new goog.ui.SubMenu('发送');
  var menu = new good.drive.nav.menu.View();
  var type = [['i', '预览'], ['i', '打开'], ['s', ''],
              ['m', submenu], ['i', '资源安排至'], ['i', '收藏'],
              ['i', '详细信息'], ['i', '重命名'], ['s', ''],
              ['i', '重新上传'], ['i', '删除']];

  var corner = {targetCorner: undefined,
      menuCorner: undefined, contextMenu: true};
  var rightmenuChildIds = undefined;
  var rightMenu = menu.genPopupMenu(dom, type, undefined, corner);
  this._rightMenu = rightMenu;
  this._subMenu = submenu;
  this._menu = menu;
  this._names = undefined;
  this._rightmenusource = undefined;

  rightMenu.getHandler().listen(rightMenu,
      goog.ui.Menu.EventType.BEFORE_SHOW, this.hideMenuItem());

  var rpc = new good.net.CrossDomainRpc('GET', good.constants.DEVICE,
      good.config.VERSION, 'deviceinfo',
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      if (json['items'] != undefined) {
        var items = json['items'];
        good.drive.search.Rightmenu.SUBMENUDATA = items;
        var names = new Array();
        that._names = names;
        goog.array.forEach(items, function(item) {
          submenu.addItem(new goog.ui.MenuItem(item.name));
          names.push(item.name);
        });
        goog.events.listen(rightMenu, 'action', that.onSelectedHandle(items));
      } else {
        goog.events.listen(rightMenu, 'action', that.onSelectedHandle());
      }
    }
  });
};

/**
 * @return {Function}
 */
good.drive.search.Rightmenu.prototype.hideMenuItem = function() {
  var that = this;
  return function(e) {
    var grid = good.drive.view.baseview.View.currentGrid;
    var selectedElemnet = grid.getSelectedItem();
    if (selectedElemnet == undefined) {
      return;
    }
    var data = selectedElemnet.data;
    var path = good.drive.nav.folders.Path.getINSTANCE();
    var docId = path.currentDocId;
    var grid = good.drive.view.baseview.View.currentGrid;
    switch (docId) {
    case good.constants.MYCLASSRESDOCID:
      var cell = grid.getSelectedItem();
      if (cell.data.get('isfile') == undefined) {
        var array = new Array(0, 3, 4, 5, 6, 9);
        that._menu.hideItem(that._rightMenu, array);
      } else {
        var array = new Array(4, 7, 9);
        if (data.get('type') ==
          'application/x-print') {
          array.push(3);
         }
        if (data.get('type') !=
        'application/x-shockwave-flash' &&
        data.get('type').indexOf('image/') == -1) {
        array.push(1);
       }
        that._menu.hideItem(that._rightMenu, array);
      }
      break;
    case good.constants.MYRESDOCID:
      var cell = grid.getSelectedItem();
      if (cell.data.get('isfile') == undefined) {
        var array = new Array(0, 3, 4, 5, 6, 9);
        that._menu.hideItem(that._rightMenu, array);
      } else {
        var array = new Array(5, 7, 9);
        if (data.get('type') ==
        'application/x-print') {
         array.push(3);
       }
       if (data.get('type') !=
          'application/x-shockwave-flash' &&
          data.get('type').indexOf('image/') == -1) {
          array.push(1);
         }
        that._menu.hideItem(that._rightMenu, array);
      }
      break;
    case good.constants.PUBLICRESDOCID:
      if (good.drive.role.Role.USERNAME != good.constants.ADMIN) {
        var array = new Array(7, 8, 9, 10);
        if (data.contentType ==
        'application/x-print') {
          array.push(3);
        }
        if (data['contentType'] !=
          'application/x-shockwave-flash' &&
          data['contentType'].indexOf('image/') == -1 &&
          data['contentType'] !=
            'application/x-print') {
          array.push(1);
         }
        that._menu.hideItem(that._rightMenu, array);
      } else {
        var array = new Array(7, 10);
        if (data['contentType'] ==
        'application/x-print') {
        array.push(3);
       }
       if (data['contentType'] !=
          'application/x-shockwave-flash' &&
          data['contentType'].indexOf('image/') == -1 &&
          data['contentType'] !=
            'application/x-print') {
          array.push(1);
        }
        that._menu.hideItem(that._rightMenu, array);
      }
      break;
    default :
      break;
    }
  };
};

/**
 * @param {JSON} items
 * @return {Function}
 */
good.drive.search.Rightmenu.prototype.onSelectedHandle = function(items) {
  var that = this;
  return function(e) {
    var grid = good.drive.view.baseview.View.currentGrid;
    var selectedElemnet = grid.getSelectedItem();
    if (selectedElemnet == undefined) {
      return;
    }
    var data = selectedElemnet.data;
    var rightmenusource = new good.drive.rightmenu.Rightmenu();
    that._rightmenusource = rightmenusource;
    var preview = new good.drive.preview.Control();
    var action = e.target.getCaption();
    switch (action) {
      case '预览':
        /*if (data instanceof good.realtime.CollaborativeMap) {
          rightmenusource.preview2(data.get('id'));
        } else {
          rightmenusource.preview2(data.id);
        }*/
        preview.getselcetItem();
        break;
      case '详细信息':
        if (data instanceof good.realtime.CollaborativeMap) {
          rightmenusource.detailInfo(data.get('id'), function() {
          });
        } else {
          rightmenusource.detailInfo(data.id, function() {
          });
        }
        good.drive.rightmenu.DetailInfo.TYPEFLAG = undefined;
        break;
      case '重新上传':
        if (data instanceof good.realtime.CollaborativeMap) {
          rightmenusource.uploadAgain(data.get('id'), function() {
          });
        } else {
          rightmenusource.uploadAgain(data.id, function() {
          });
        }
        break;
      default:
        break;
     }
     if (items != undefined) {
       if (goog.array.contains(that._names, action)) {
         var deviceId = undefined;
          goog.array.forEach(items, function(item) {
            if (item.name == action) {
              deviceId = item.id;
            }
         });
          var selectedCells = grid.getClickList();
          goog.array.forEach(selectedCells, function(cell) {
            var data = cell.data;
            if (data instanceof good.realtime.CollaborativeMap) {
              that.sendDevice(data.get('id'), deviceId);
            } else {
              that.sendDevice(data.id, deviceId);
            }
          });
       }
     }
  };
};

/**
 * @param {string} dataId
 * @param {string} deviceId
 */
good.drive.search.Rightmenu.prototype.sendDevice = function(dataId, deviceId) {
  this._rightmenusource.send(dataId, deviceId);
};

/**
 * @return {goog.ui.PopupMenu}
 */
good.drive.search.Rightmenu.prototype.getRightMenu = function() {
  return this._rightMenu;
};

/**
 * @return {goog.ui.SubMenu}
 */
good.drive.search.Rightmenu.prototype.getsubMenu = function() {
  return this._subMenu;
};

/** @type {JSON} */
good.drive.search.Rightmenu.SUBMENUDATA = null;



