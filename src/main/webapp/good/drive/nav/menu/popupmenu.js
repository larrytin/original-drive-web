'use strict';
goog.provide('good.drive.nav.menu.popupmenu');

goog.require('goog.object');
goog.require('goog.positioning.Corner');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.PopupMenu');



/**
 * 构建一个右击菜单
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
 * 返回一个创建按钮按下的弹出菜单
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

/**
 * 返回一个按下上传按钮弹出的菜单
 * @param {Element} dom
 * @param {Function} handle
 * @return {goog.ui.PopupMenu}
 */
good.drive.nav.menu.Popupmenu.prototype.createRight =
    function(dom, handle) {
  this._pm.attach(dom, undefined,
      undefined, true);
  goog.events.listen(this._pm, 'action', handle);
  return this._pm;
};
