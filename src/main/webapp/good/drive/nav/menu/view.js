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
 * @constructor
 */
good.drive.nav.menu.View = function() {
};
/**
 * @param {Element} dom
 * @param {Array.<Array>} items
 * @param {Function} handle
 * @param {Object} corner
 * @param {Element} target
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
 * @param {Element} dom
 * @param {Array.<Array>} items
 * @param {Function} handle
 * @param {Object} corner
 * @param {Element} target
 * @return {goog.ui.PopupMenu}
 */
good.drive.nav.menu.View.prototype.genMenu =
  function(dom, items, handle, corner, target, isLazy) {
  var popupMenu = new goog.ui.Menu();
  this.genBase_(popupMenu, dom, items, handle, corner, target, isLazy);
  return popupMenu;
};

good.drive.nav.menu.View.prototype.genBase_=
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
 * @param {goog.ui.PopupMenu} popupMenu
 */
good.drive.nav.menu.View.prototype.clearItem =
  function(popupMenu) {
  for (var i = 0; i < popupMenu.getChildCount(); i++) {
    popupMenu.removeChildAt(0);
  }
};

/**
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
