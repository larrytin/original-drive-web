'use strict';
goog.provide('good.drive.nav.menu');

goog.require('goog.ui.Menu');
goog.require('goog.ui.SubMenu');
goog.require('goog.ui.PopupMenu');

good.drive.nav.menu.View = function() {
	var create_ = new goog.ui.PopupMenu();
	create_.addItem(new goog.ui.MenuItem('One'));
	create_.addItem(new goog.ui.MenuItem('Two'));
	create_.addItem(new goog.ui.MenuItem('Three'));
	create_.addItem(new goog.ui.MenuItem('Four'));
	create_.addItem(new goog.ui.MenuItem('Five'));
	create_.addItem(new goog.ui.MenuItem('Six'));
	create_.addItem(new goog.ui.MenuItem('Seven'));
	create_.render(document.body);

	this.create = create_;
};

good.drive.nav.menu.View.prototype.createPopup = function(dom) {
	this.create.attach(dom,
			goog.positioning.Corner.BOTTOM_LEFT,
			goog.positioning.Corner.TOP_LEFT);
	return this.create;
}
