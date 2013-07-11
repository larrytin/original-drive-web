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
  this.create_ = create;


  var left = new goog.ui.PopupMenu();
  left.decorate(goog.dom.getElement('leftsubmenu'));
  this.left_ = left;

  var box = goog.math.Box(10, 10, 10, 10);
  this.box_ = box;
};


/**
 * @param {Element} dom
 * @param {Function} handle
 * @return {goog.ui.PopupMenu}
 */
good.drive.nav.menu.View.prototype.createPopup = function(dom, handle) {
  this.create_.attach(dom, goog.positioning.Corner.BOTTOM_LEFT,
      goog.positioning.Corner.TOP_LEFT);
  goog.events.listen(this.create_, 'action', handle);
  return this.create_;
};


/**
 * @param {Element} dom
 * @param {Function} handle
 * @return {goog.ui.PopupMenu}
 */
good.drive.nav.menu.View.prototype.leftSubMenu = function(dom, handle) {
  this.left_.attach(dom, undefined, undefined, true, this.box_);
  goog.events.listen(this.left_, 'action', handle);
  return this.left_;
};
