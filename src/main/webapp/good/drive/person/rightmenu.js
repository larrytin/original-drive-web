'use strict';
goog.provide('good.drive.person.rigthmenu');

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
    var action = e.target.getCaption();
    switch (action) {
      case '详细信息':
        list.editPerson(data.userId);
        break;
      case '删除':
        list.deletePerson(data.userId);
        break;
      default:
        break;
     }
  });
};
