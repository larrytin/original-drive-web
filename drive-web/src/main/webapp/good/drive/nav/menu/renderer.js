goog.provide('good.drive.nav.menu.ViewRenderer');

goog.require('goog.ui.MenuRenderer');

good.drive.nav.menu.ViewRenderer = function() {
	goog.ui.MenuRenderer.call(this);
};
goog.inherits(good.drive.nav.menu.ViewRenderer, goog.ui.MenuRenderer);
goog.addSingletonGetter(good.drive.nav.menu.ViewRenderer);

good.drive.nav.menu.ViewRenderer.CSS_CLASS = goog.getCssName('goog-menu');

good.drive.nav.menu.ViewRenderer.prototype.containsElement = function(menu,
		element) {
	return goog.dom.contains(menu.getElement(), element);
};

good.drive.nav.menu.ViewRenderer.prototype.getCssClass = function() {
	return good.drive.nav.menu.ViewRenderer.CSS_CLASS;
};