'use strict';
goog.provide('good.drive.nav.menu');

goog.require('good.drive.nav.menu.ViewRenderer');
goog.require('goog.dom');
goog.require('goog.positioning.Corner');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItemRenderer');
goog.require('goog.ui.PopupMenu');
goog.require('goog.ui.SubMenu');
goog.require('goog.ui.registry');

/**
 * 用于构建弹出菜单的类
 * @constructor
 */
good.drive.nav.menu.View = function() {
};

/**
 * 构建一个弹出菜单 你最少需要提供一个时间源和一个结构化的item
 * @param {Element} dom
 * @param {Array.<Array>} items
 * @param {Function} handle
 * @param {Object} corner
 * @param {Element} target
 * @param {boolean} isLazy
 * @return {goog.ui.PopupMenu}
 */
good.drive.nav.menu.View.prototype.genPopupMenu =
  function(dom, items, handle, corner, target, isLazy) {
  var popupMenu = new goog.ui.PopupMenu();
  popupMenu.setToggleMode(true);
  this.genBase_(popupMenu, dom, items, handle, corner, target, isLazy);
  return popupMenu;
};

/**
 * 构建一个弹出框 功能genPopupMenu类似
 * @param {Element} dom
 * @param {Array.<Array>} items
 * @param {Function} handle
 * @param {Object} corner
 * @param {Element} target
 * @param {boolean} isLazy
 * @return {goog.ui.PopupMenu}
 */
good.drive.nav.menu.View.prototype.genMenu =
  function(dom, items, handle, corner, target, isLazy) {
  var popupMenu = new goog.ui.Menu();
  this.genBase_(popupMenu, dom, items, handle, corner, target, isLazy);
  return popupMenu;
};

/**
 * 构建菜单的基本方法 提供了自动生成的功能
 * @param {goog.ui.Menu} menu
 * @param {Element} dom
 * @param {Array.<Array>} items
 * @param {Function} handle
 * @param {Object} corner
 * @param {Element} target
 * @param {boolean} isLazy
 * @private
 */
good.drive.nav.menu.View.prototype.genBase_ =
  function(menu, dom, items, handle, corner, target, isLazy) {
  this.genItems_(menu, items);
  if (isLazy == undefined || !isLazy) {
    menu.render(target == undefined ? document.body : target);
  }
  if (dom != undefined) {
    if (corner == undefined) {
      menu.attach(dom, goog.positioning.Corner.BOTTOM_LEFT,
          goog.positioning.Corner.TOP_LEFT);
    } else {
      menu.attach(dom, corner.targetCorner,
          corner.menuCorner, corner.contextMenu);
    }
  }
  if (handle != undefined) {
    goog.events.listen(menu, 'action', handle);
  }
};

/**
 * 重新构建
 * @param {goog.ui.PopupMenu} popupMenu
 * @param {Array.<Array>} items
 * @param {Function} handle
 */
good.drive.nav.menu.View.prototype.reload =
  function(popupMenu, items, handle) {
  this.clearItem(popupMenu);
  this.genItems_(popupMenu, items);
  if (handel == undefined) {
    return;
  }
  if (handle != undefined) {
    goog.events.listen(popupMenu, 'action', handle);
  }
};

/**
 * 根据一个有序的Items来构建一个菜单
 * @param {goog.ui.PopupMenu} popupMenu
 * @param {Array.<Array>} items
 * @private
 */
good.drive.nav.menu.View.prototype.genItems_ =
  function(popupMenu, items) {
  if (goog.array.isEmpty(items)) {
    return;
  }
  goog.array.forEach(items, function(value) {
    switch (value[0]) {
    case 's':
      popupMenu.addItem(new goog.ui.MenuSeparator());
      break;
    case 'i':
      popupMenu.addItem(new goog.ui.MenuItem(value[1]));
      break;
    case 'm':
      popupMenu.addItem(value[1]);
      break;
    default:
      break;
    }
  });
};

/**
 * 根据提供的hides的数组来隐藏菜单中的匹配的索引
 * @param {goog.ui.PopupMenu} popupMenu
 * @param {Array.<number>} hides
 */
good.drive.nav.menu.View.prototype.hideItem = function(popupMenu, hides) {
  var items = popupMenu.getItems();
  goog.array.forEach(items, function(value) {
    value.setVisible(true);
  });
  goog.array.forEach(hides, function(value) {
    var item = items[value];
    item.setVisible(false);
  });
  var s = '';
};

/**
 * 清除弹出框的内容
 * @param {goog.ui.PopupMenu} popupMenu
 */
good.drive.nav.menu.View.prototype.clearItem =
  function(popupMenu) {
  for (var i = 0; i < popupMenu.getChildCount(); i++) {
    popupMenu.removeChildAt(0);
  }
};

/**
 * 构建一个创建的弹出康
 * @param {Element} dom
 * @param {Function} handle
 * @return {goog.ui.PopupMenu}
 */
good.drive.nav.menu.View.prototype.createPopup = function(dom, handle) {
  var render = goog.ui.ContainerRenderer.getCustomRenderer(
      good.drive.nav.menu.ViewRenderer, 'detroit-createmenu');
  var itemRender = goog.ui.ControlRenderer.getCustomRenderer(
      goog.ui.MenuItemRenderer, 'detroit-createmenuitem');
  goog.ui.registry.setDecoratorByClassName(
      'detroit-createmenuitem', function() {
        return new goog.ui.MenuItem('', null, null, itemRender);
      });
  var create = new goog.ui.PopupMenu(null, render);
  create.decorateContent = function(element) {
    var renderer = this.getRenderer();
    var contentElements = this.getDomHelper().getElementsByTagNameAndClass(
        'div', goog.getCssName(renderer.getCssClass(), 'entries-col'),
        element);
    var length = contentElements.length;
    for (var i = 0; i < length; i++) {
      renderer.decorateChildren(this, contentElements[i]);
    }
  };
  create.setToggleMode(true);
  create.decorate(goog.dom.getElement('dMenu'));
  create.attach(dom, goog.positioning.Corner.BOTTOM_LEFT,
      goog.positioning.Corner.TOP_LEFT);
  goog.events.listen(create, 'action', handle);
  return create;
};

/**
 * 构建一个右键的弹出框
 * @param {Element} dom
 * @param {Function} handle
 * @return {goog.ui.PopupMenu}
 */
good.drive.nav.menu.View.prototype.leftSubMenu = function(dom, handle) {
  var left = new goog.ui.PopupMenu();
  left.decorate(goog.dom.getElement('leftsubmenu'));
  left.attach(dom, undefined, undefined, true);
  left.getHandler().listen(
      left, goog.ui.Menu.EventType.BEFORE_SHOW, function(e) {
    var str = '';
  });
  goog.events.listen(left, 'action', handle);
  return left;
};
