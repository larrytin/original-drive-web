'use strict';
goog.provide('good.drive.nav.button');

goog.require('goog.dom');
goog.require('goog.ui.CustomButton');
goog.require('good.drive.nav.menu.Renderer');

good.drive.nav.button.View = function(content, var_args) {
	var button_ = new goog.ui.CustomButton(content, good.drive.nav.menu.Renderer.getInstance());
	button_.render(goog.dom.getElement('contentcreationpane'));
	for(var i in var_args) {
		goog.dom.classes.add(button_.getElement(), var_args[i]);
	}
	this.button = button_;
};