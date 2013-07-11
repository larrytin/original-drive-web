'use strict';
goog.provide('good.drive.nav.menu.popupmenu');

goog.require('goog.object');
goog.require('goog.positioning.Corner');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.PopupMenu');



/**
 * @constructor
 * @param {Array} menulst
 */
good.drive.nav.menu.Popupmenu = function(menulst) {
  if (menulst !== null && menulst.length > 0) {
    var pm = new goog.ui.PopupMenu();
    for (var i = 0; i < menulst.length; i++) {
      pm.addItem(new goog.ui.MenuItem(menulst[i]));
    }
    pm.setToggleMode(true);
    pm.render(document.body);
    this._pm = pm;
  }
};


/**
 * @param {Element} dom
 * @param {Function} handle
 * @return {goog.ui.PopupMenu}
 */
good.drive.nav.menu.Popupmenu.prototype.createPopup =
    function(dom, handle) {
  this._pm.attach(dom, goog.positioning.Corner.BOTTOM_LEFT,
      goog.positioning.Corner.TOP_LEFT);
  goog.events.listen(this._pm, 'action', handle);
  return this._pm;
};
