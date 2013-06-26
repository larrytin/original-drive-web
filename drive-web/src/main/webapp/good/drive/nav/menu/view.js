'use strict';
goog.provide('good.drive.nav.menu');

goog.require('goog.dom');
goog.require('goog.ui.Menu');
goog.require('goog.ui.SubMenu');
goog.require('goog.ui.PopupMenu');
goog.require('goog.positioning.Corner');
goog.require('good.drive.nav.menu.ViewRenderer');

good.drive.nav.menu.View = function() {
	var create_ = new goog.ui.PopupMenu(null ,good.drive.nav.menu.ViewRenderer.getInstance());
	create_.addItem(new goog.ui.MenuItem('One'));
	create_.addItem(new goog.ui.MenuItem('Two'));
	create_.addItem(new goog.ui.MenuItem('Three'));
	create_.addItem(new goog.ui.MenuItem('Four'));
	create_.addItem(new goog.ui.MenuItem('Five'));
	create_.addItem(new goog.ui.MenuItem('Six'));
	create_.addItem(new goog.ui.MenuItem('Seven'));
	create_.render(document.body);

	this.create = create_;
	
	var pm2 = new goog.ui.PopupMenu();
    pm2.setToggleMode(true);
    pm2.decorate(document.getElementById('dMenu'));
    this.pm = pm2;
};

good.drive.nav.menu.View.prototype.createPopup = function(dom, handle) {
	this.pm.attach(dom,
			goog.positioning.Corner.BOTTOM_LEFT,
			goog.positioning.Corner.TOP_LEFT);
	goog.events.listen(this.pm, 'action', handle);
	return this.pm;
};
