'use strict';
goog.provide('good.drive.search.rigthmenu');

goog.require('good.drive.rightmenu');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.ui.SubMenu');


/**
 * @constructor
 * @param {Element} dom
 */
good.drive.search.Rightmenu = function(dom) {
  this._rightMenu = undefined;
  var submenu = new goog.ui.SubMenu('发送');
  var menu = new good.drive.nav.menu.View();
  var type = [['i', '打开'], ['s', ''],
              ['m', submenu], ['i', '资源安排至'], ['i', '收藏'],
              ['i', '详细信息'], ['i', '重命名'], ['s', ''],
              ['i', '重新上传'], ['i', '删除'], ['i', '预览']];

  var corner = {targetCorner: undefined,
      menuCorner: undefined, contextMenu: true};
  var rightmenuChildIds = undefined;
  var rightMenu = menu.genPopupMenu(dom, type, undefined, corner);
  this._rightMenu = rightMenu;
  this._subMenu = submenu;

  rightMenu.getHandler().listen(rightMenu,
      goog.ui.Menu.EventType.BEFORE_SHOW, function(e) {
    var grid = good.drive.view.baseview.View.currentGrid;
    var selectedElemnet = grid.getSelectedItem();
    var data = selectedElemnet.data;
    var path = good.drive.nav.folders.Path.getINSTANCE();
    var docId = path.currentDocId;
    var grid = good.drive.view.baseview.View.currentGrid;
    switch (docId) {
    case good.constants.MYCLASSRESDOCID:
      var cell = grid.getSelectedItem();
      if (cell.data.get('isfile') == undefined) {
        var array = new Array(2, 3, 4, 5, 8);
        menu.hideItem(rightMenu, array);
      } else {
        var array = new Array(3, 6, 8);
        if (data.contentType ==
          'application/x-print') {
          array.push(2);
         }
        menu.hideItem(rightMenu, array);
      }
      break;
    case good.constants.MYRESDOCID:
      var cell = grid.getSelectedItem();
      if (cell.data.get('isfile') == undefined) {
        var array = new Array(2, 3, 4, 5, 8);
        menu.hideItem(rightMenu, array);
      } else {
        var array = new Array(4, 6, 8);
        if (data.contentType ==
        'application/x-print') {
         array.push(2);
       }
        menu.hideItem(rightMenu, array);
      }
      break;
    case good.constants.PUBLICRESDOCID:
      if (good.drive.role.Role.USERNAME != good.constants.ADMIN) {
        var array = new Array(6, 7, 8, 9);
        if (data.contentType ==
        'application/x-print') {
        array.push(2);
       }
        menu.hideItem(rightMenu, array);
      } else {
        var array = new Array(6, 9);
        if (data.contentType ==
        'application/x-print') {
        array.push(2);
       }
        menu.hideItem(rightMenu, array);
      }
      break;
    default :
      break;
    }
  });

  var rpc = new good.net.CrossDomainRpc('GET', good.constants.DEVICE,
      good.config.VERSION, 'deviceinfo',
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      if (json['items'] != undefined) {
        var items = json['items'];
        good.drive.search.Rightmenu.SUBMENUDATA = items;
        var names = new Array();
        goog.array.forEach(items, function(item) {
          submenu.addItem(new goog.ui.MenuItem(item.name));
          names.push(item.name);
        });
        goog.events.listen(rightMenu, 'action', function(e) {
          var grid = good.drive.view.baseview.View.currentGrid;
          var selectedElemnet = grid.getSelectedItem();
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
           if (goog.array.contains(names, action)) {
             var deviceId = undefined;
              goog.array.forEach(items, function(item) {
                if (item.name == action) {
                  deviceId = item.id;
                }
             });
              if (data instanceof good.realtime.CollaborativeMap) {
                rightmenusource.send(data.get('id'), deviceId);
              } else {
                rightmenusource.send(data.id, deviceId);
              }
           }
        });
      }
    }
  });
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



