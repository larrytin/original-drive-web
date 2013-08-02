'use strict';
goog.provide('good.drive.search.rigthmenu');

goog.require('good.drive.nav.menu.popupmenu');
goog.require('good.drive.rightmenu');
goog.require('good.drive.search');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.ui.SubMenu');


/**
 * @constructor
 * @param {Element} dom
 * @param {good.drive.nav.grid} grid
 * @param {Function} handle
 */
good.drive.search.Rightmenu = function(dom, grid) {
  this._rightMenu = undefined;
  var submenu = new goog.ui.SubMenu('发送');
  var menu = new good.drive.nav.menu.View();
  var type = [['i', '打开'], ['i', '预览'], ['s', ''],
              ['i', '详细信息'], ['i', '重命名'], ['s', ''], 
              ['i', '安排课程'], ['i', '收藏'], ['s', ''], 
              ['i', '重新上传'], ['i', '删除'], ['s', ''], 
              ['m', submenu]];  

  var corner = {targetCorner: undefined,
      menuCorner: undefined, contextMenu: true};
  var rightmenuChildIds = undefined;
  var rightMenu = menu.genPopupMenu(dom, type, undefined, corner);
  this._rightMenu = rightMenu;
  
  rightMenu.getHandler().listen(rightMenu,
      goog.ui.Menu.EventType.BEFORE_SHOW, function(e) {
    var path = good.drive.nav.folders.Path.getINSTANCE();
    var docId = path.currentDocId;
    var target = e.target;
    var grid = good.drive.nav.grid.View.currentGrid;
    switch (docId){
    case good.constants.MYCLASSRESDOCID :      
      var cell = grid.getSelectedItem();
      if (cell.data instanceof good.realtime.CollaborativeMap) {
        var array = new Array(1,3,6,7,8,9,11,12);
        menu.hideItem(rightMenu, array);
      } else {
        var array = new Array(0,4,6,9);
        menu.hideItem(rightMenu, array);
      }
      break;
    case good.constants.MYRESDOCID :
      var cell = grid.getSelectedItem();
      if (cell.data instanceof good.realtime.CollaborativeMap) {
        var array = new Array(1,3,6,7,8,9,11,12);
        menu.hideItem(rightMenu, array);
      } else {
        var array = new Array(0,4,9);
        menu.hideItem(rightMenu, array);
      }
      break;
    case good.constants.PUBLICRESDOCID :
      if (good.drive.role.Role.USERNAME != good.constants.ADMIN) {
        menu.hideItem(rightMenu, [0,4,9,10,11]);
      } else {
        menu.hideItem(rightMenu, [0,4,10]);
      }
      break;
    default :
      break;
    };
  });
  
  var rpc = new good.net.CrossDomainRpc('GET', good.constants.DEVICE,
      good.config.VERSION, 'deviceinfo',
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      if (json['items'] != undefined) {
        var items = json['items'];
        var names = new Array();
        goog.array.forEach(items, function(item) {
          submenu.addItem(new goog.ui.MenuItem(item.name));
          names.push(item.name);
        });
        goog.events.listen(rightMenu, 'action', function(e) {
          var selectedElemnet = grid.getSelectedItem();
          var data = selectedElemnet.data;         
          var rightmenusource = new good.drive.rightmenu.Rightmenu();

          var action = e.target.getCaption();
          switch (action) {
            case '预览':
              rightmenusource.preview(data.id);
              break;
            case '详细信息':
              rightmenusource.detailInfo(data.id, function() {
              });
              break;            
            case '重新上传':
              rightmenusource.uploadAgain(data.id, function() {
              });
              break;
            default:              
              break;
           };
           if (goog.array.contains(names, action)) {
             var deviceId = undefined;             
              goog.array.forEach(items, function(item) {
                if (item.name == action) {
                  deviceId = item.id;
                }
             });
              rightmenusource.send(data.id, deviceId);
           }
        });
      }
    }
  });
};

good.drive.search.Rightmenu.prototype.getRightMenu = function() {
  return this._rightMenu;
};




