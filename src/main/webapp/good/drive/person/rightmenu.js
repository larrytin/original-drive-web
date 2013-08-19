'use strict';
goog.provide('good.drive.person.rigthmenu');

goog.require('good.drive.device.listdevice');
goog.require('good.drive.nav.menu');
goog.require('good.drive.person.listperson');

/**
 * @constructor
 * @param {Element} dom
 */
good.drive.person.rigthmenu.Menu = function(dom) {

  var menu = new good.drive.nav.menu.View();
  var type = [['i', '详细信息'], ['s', ''],
              ['i', '删除']];

  var corner = {targetCorner: undefined,
      menuCorner: undefined, contextMenu: true};
  var rightMenu = menu.genPopupMenu(dom, type, undefined, corner);
  this._rightMenu = rightMenu;
  this.action();
};

/**
 *
 */
good.drive.person.rigthmenu.Menu.prototype.action = function() {
  var that = this;
  goog.events.listen(that._rightMenu, 'action', function(e) {
    var grid = good.drive.view.baseview.View.currentGrid;
    var selectedElemnet = grid.getSelectedItem();
    var data = selectedElemnet.data;
    var list = new good.drive.person.Listperson();
    var listdevice = new good.drive.device.Listdevice();
    var action = e.target.getCaption();
    var path = good.drive.nav.folders.Path.getINSTANCE().path;
    var docid = path[good.drive.nav.folders.Path.NameType.CURRENTDOCID];
    var pathControl = good.drive.nav.folders.Path.getINSTANCE();
    var view = pathControl.getViewBydocId(docid);
    var curItem = view.getCurItem();
    var id = curItem.getId();
    var flag = false;
    if (id == 'personman') {
      flag = true;
    } else {
      flag = false;
    }
    switch (action) {
      case '详细信息':
          if (flag) {
            list.editPerson(data.userId);
          } else {
            listdevice.editPerson(data.id);
          }        
        break;
      case '删除':
          if (flag) {
             list.deletePerson(data.userId);          
          } else {
            listdevice.deletePerson(data.id);
          }
        break;
      default:
        break;
     }
  });
};
