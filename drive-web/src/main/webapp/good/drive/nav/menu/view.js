'use strict';
goog.provide('good.drive.nav.menu');

goog.require('goog.dom');
goog.require('goog.ui.Menu');
goog.require('goog.ui.SubMenu');
goog.require('goog.ui.PopupMenu');
goog.require('goog.positioning.Corner');
goog.require('good.drive.nav.menu.ViewRenderer');
goog.require('goog.ui.ContainerRenderer');
goog.require('goog.ui.ControlRenderer');
goog.require('goog.ui.MenuItemRenderer');
goog.require('goog.ui.registry');

good.drive.nav.menu.View = function() {
	var render = goog.ui.ContainerRenderer.getCustomRenderer(
			good.drive.nav.menu.ViewRenderer, 'detroit-createmenu');
	var itemRender = goog.ui.ControlRenderer.getCustomRenderer(
			goog.ui.MenuItemRenderer, 'detroit-createmenuitem');
	goog.ui.registry.setDecoratorByClassName('detroit-createmenuitem', function() {
		return new goog.ui.MenuItem("", null, null, itemRender);
	});
	var create_ = new goog.ui.PopupMenu(null, render);
	create_.decorateContent = function(element) {
		var renderer = this.getRenderer();
		var contentElements = this.getDomHelper().getElementsByTagNameAndClass(
				'div', goog.getCssName(renderer.getCssClass(), 'entries-col'),
				element);
		var length = contentElements.length;
		for ( var i = 0; i < length; i++) {
			renderer.decorateChildren(this, contentElements[i]);
		}
	};
	create_.setToggleMode(true);
	create_.decorate(goog.dom.getElement('dMenu'));
	this.create = create_;
};

good.drive.nav.menu.View.prototype.createPopup = function(dom, handle) {
	this.create.attach(dom, goog.positioning.Corner.BOTTOM_LEFT,
			goog.positioning.Corner.TOP_LEFT);
	goog.events.listen(this.create, 'action', handle);
	return this.create;
};
