'use strict';
goog.provide('good.drive.search.rigthmenu');

goog.require('good.drive.nav.menu.popupmenu');
goog.require('good.drive.rightmenu');
goog.require('good.drive.search');


/**
 * @constructor
 * @param {Element} dom
 * @param {good.drive.nav.grid} grid
 */
good.drive.search.Rightmenu = function(dom, grid) {
  var menu = new good.drive.nav.menu.View();
  var type = [['i', '预览'], ['i', '详细信息'], ['i', '安排课程'],
             ['i', '收藏'], ['i', '重新上传'], ['i', '删除'], ['i', '发送']];
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
    switch (goog.array.indexOf(rightmenuChildIds, e.target.getId())) {
      case 0:
        rightmenusource.preview(data.id);
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        rightmenusource.uploadAgain(data.id, function() {
          alert('22');
        });
        break;
      case 5:
        rightmenusource.deletefn(data.id, function() {
          menu.search('click');
        });
        break;
      default:
        break;
     }    
  }, corner);
};


