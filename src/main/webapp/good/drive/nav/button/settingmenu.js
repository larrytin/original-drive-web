'use strict';
goog.provide('good.drive.nav.button.Settingmenu');

goog.require('good.drive.rightmenu');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.ui.SubMenu');


/**
 * 设置按钮
 * @constructor
 */
good.drive.nav.button.Settingmenu = function() {
  var that = this;
  this._rightMenu = undefined;
  var menu = new good.drive.nav.menu.View();
  var type = [['i', '关于科睿星']];

//  var corner = {targetCorner: undefined,
//      menuCorner: undefined, contextMenu: true};
  var rightMenu = menu.genMenu(undefined,
      type, undefined, undefined, undefined, true);
  this._rightMenu = rightMenu;
  this._menu = menu;
};

/**
 * 隐藏Item事件
 * @param {goog.events.Event} e
 */
good.drive.nav.button.Settingmenu.prototype.hideMenuItem = function(e) {
  var that = this;
  var grid = good.drive.view.baseview.View.currentGrid;
  var selectedElemnet = grid.getSelectedItem();
  if (selectedElemnet == undefined) {
    return;
  }
  var data = selectedElemnet.data;
  var path = good.drive.nav.folders.Path.getINSTANCE();
  var docId = path.currentDocId;
  var grid = good.drive.view.baseview.View.currentGrid;
  var cell = grid.getSelectedItem();
  switch (docId) {
  case good.constants.MYCLASSRESDOCID:
  case good.constants.MYRESDOCID:
    var cell = grid.getSelectedItem();
    if (cell.data.get('isfile') == undefined) {
      var array = new Array(1, 3, 4, 5);
      that._menu.hideItem(that._rightMenu, array);
    } else {
      var array = new Array(3, 6);
      if (data.get('type') == 'application/x-print') {
        array.push(3);
      }
      if (data.get('type') != 'application/x-shockwave-flash' &&
          data.get('type').indexOf('image/') == -1) {
        array.push(1);
      }
      that._menu.hideItem(that._rightMenu, array);
    }
    break;
  case good.constants.PUBLICRESDOCID:
    var array = new Array(6, 7, 8);
    if (data.contentType == 'application/x-print') {
      array.push(3);
    }
    if (data['contentType'] != 'application/x-shockwave-flash' &&
        data['contentType'].indexOf('image/') == -1) {
      array.push(1);
    }
    that._menu.hideItem(that._rightMenu, array);
    break;
  default:
    break;
  }
};

/**
 * 点击Item事件
 * @param {goog.events.Event} e
 */
good.drive.nav.button.Settingmenu.prototype.onSelectedHandle = function(e) {
  var that = this;
  var grid = good.drive.view.baseview.View.currentGrid;
  var selectedElemnet = grid.getSelectedItem();
  if (selectedElemnet == undefined) {
    return;
  }
  var data = selectedElemnet.data;
  var rightmenusource = new good.drive.rightmenu.Rightmenu();

  var action = e.target.getCaption();
  switch (action) {
  case '预览':
    if (data instanceof good.realtime.CollaborativeMap) {
      rightmenusource.preview2(data.get('id'));
    } else {
      rightmenusource.preview2(data.id);
    }
    break;
  case '详细信息':
    if (data instanceof good.realtime.CollaborativeMap) {
      rightmenusource.detailInfo(data.get('id'), function() {
      });
    } else {
      rightmenusource.detailInfo(data.id, function() {
      });
    }
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
};

/**
 * 获取设置Button的Menu
 * @return {goog.ui.PopupMenu}
 */
good.drive.nav.button.Settingmenu.prototype.getRightMenu = function() {
  return this._rightMenu;
};

/** @type {JSON} */
good.drive.nav.button.Settingmenu.SUBMENUDATA = null;



