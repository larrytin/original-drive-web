'use strict';
goog.provide('good.drive.nav.button.rigthmenu');

goog.require('good.drive.rightmenu');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.ui.SubMenu');


/**
 * @constructor
 */
good.drive.nav.button.rigthmenu = function() {
  var that = this;
  this._rightMenu = undefined;
  var menu = new good.drive.nav.menu.View();
  var type = [['i', '打开'], ['i', '预览'], ['s', ''],
              ['i', '资源安排至'],
              ['i', '收藏'], ['i', '详细信息'],
              ['i', '重命名'], ['s', ''], ['i', '删除']];

//  var corner = {targetCorner: undefined,
//      menuCorner: undefined, contextMenu: true};
  var rightMenu = menu.genMenu(undefined,
      type, undefined, undefined, undefined, true);
  this._rightMenu = rightMenu;
  this._menu = menu;
};

/**
 * @param {goog.events.Event} e
 */
good.drive.nav.button.rigthmenu.prototype.hideMenuItem = function(e) {
  var that = this;
  var grid = good.drive.view.baseview.View.currentGrid;
  var selectedElemnet = grid.getSelectedItem();
  if (selectedElemnet == undefined) {
    return;
  }
  var data = selectedElemnet.data;
  var path = good.drive.nav.folders.Path.getINSTANCE();
  var docId = path.getCurrentDocid();
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
 * @param {goog.events.Event} e
 */
good.drive.nav.button.rigthmenu.prototype.onSelectedHandle = function(e) {
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
 * @return {goog.ui.PopupMenu}
 */
good.drive.nav.button.rigthmenu.prototype.getRightMenu = function() {
  return this._rightMenu;
};

/**
 * @return {goog.ui.SubMenu}
 */
good.drive.nav.button.rigthmenu.prototype.getsubMenu = function() {
  return this._subMenu;
};

/** @type {JSON} */
good.drive.nav.button.rigthmenu.SUBMENUDATA = null;



