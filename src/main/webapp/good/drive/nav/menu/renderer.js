goog.provide('good.drive.nav.menu.ViewRenderer');

goog.require('goog.ui.MenuRenderer');



/**
 * @constructor
 */
good.drive.nav.menu.ViewRenderer = function() {
  goog.ui.MenuRenderer.call(this);
};
goog.inherits(good.drive.nav.menu.ViewRenderer, goog.ui.MenuRenderer);
goog.addSingletonGetter(good.drive.nav.menu.ViewRenderer);


/** @type {string} */
good.drive.nav.menu.ViewRenderer.CSS_CLASS = goog.getCssName('goog-menu');


/** @override */
good.drive.nav.menu.ViewRenderer.prototype.getCssClass = function() {
  return good.drive.nav.menu.ViewRenderer.CSS_CLASS;
};
