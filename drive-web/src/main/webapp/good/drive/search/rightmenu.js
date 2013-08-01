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
good.drive.search.Rightmenu = function(dom, grid, handle) {

  var rpc = new good.net.CrossDomainRpc('GET', good.constants.DEVICE,
      good.config.VERSION, 'deviceinfo',
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      if (json['items'] != undefined) {
        var submenu = new goog.ui.SubMenu('发送');
        var items = json['items'];
        goog.array.forEach(items, function(item) {
          submenu.addItem(new goog.ui.MenuItem(item.name));
        });
        var menu = new good.drive.nav.menu.View();
        var type = [['i', '预览'], ['i', '详细信息'], ['i', '安排课程'],
                   ['i', '收藏'], ['i', '重新上传'], ['i', '删除'], ['m', submenu]];
        var corner = {targetCorner: undefined,
            menuCorner: undefined, contextMenu: true};
        var rightmenuChildIds = undefined;
        var rightMenu = menu.genPopupMenu(dom, type, function(e) {
            var selectedElemnet = grid.getSelectedItem();
            var data = selectedElemnet.data;
            if (rightmenuChildIds == undefined) {
              rightmenuChildIds = rightMenu.getChildIds();
            }
            var rightmenusource = new good.drive.rightmenu.Rightmenu();
            var menu = new good.drive.search.AdvancedMenu();
            var index = goog.array.indexOf(rightmenuChildIds, e.target.getId());
            switch (index) {
              case 0:
                rightmenusource.preview(data.id);
                break;
              case 1:
                rightmenusource.detailInfo(data.id, function() {
                });
                break;
              case 2:
                break;
              case 3:
                break;
              case 4:
                rightmenusource.uploadAgain(data.id, function() {
                });
                break;
              case 5:
                /*rightmenusource.deletefn(data.id, function() {
                  menu.search('click');
                });*/
                break;
              default:
                var deviceId = undefined;
                var action = e.target.getCaption();
                 goog.array.forEach(items, function(item) {
                   if (item.name == action) {
                     deviceId = item.id;
                   }
                });
                 rightmenusource.send(data.id, deviceId);
                break;
             }
            if (handle != undefined) {
              handle(e, data, index);
            }
        }, corner);

        rightMenu.getHandler().listen(rightMenu,
            goog.ui.Menu.EventType.BEFORE_SHOW, function(e) {
          var target = e.target;
          if (good.drive.role.Role.USERNAME != good.constants.ADMIN) {
            var itemupdate = target.getItemAt(4);
            itemupdate.setEnabled(false);
          } else {
            var item = target.getItemAt(5);
            item.setEnabled(false);
          }
        });
      }
    }
  });
};




