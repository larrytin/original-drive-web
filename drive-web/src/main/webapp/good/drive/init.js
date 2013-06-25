'use strict';
goog.provide('good.drive.init');

goog.require('good.drive.nav.folders');
goog.require('good.drive.nav.menu');
goog.require('good.drive.nav.button');
goog.require('goog.dom');

good.drive.init.start = function() {
	var tree = new good.drive.nav.folders.Tree();
	var menu = new good.drive.nav.menu.View();
	
	var label = goog.dom.createDom('div', {'class' : 'goog-inline-block jfk-button-caption'}, '创建');
	var empty = goog.dom.createDom('div', {'class' : 'goog-inline-block jfk-button-caption'}, ' ');
	var button1 = new good.drive.nav.button.View([label, empty], ['jfk-button-primary', 'goog-toolbar-item-new']);
	
	var icon = goog.dom.createDom('div', {'class' : 'goog-inline-block jfk-button-caption'}, goog.dom.createDom('span', {'class' : 'drive-sprite-core-upload upload-icon-position goog-inline-block'}));
	var button2 = new good.drive.nav.button.View([icon, empty], ['jfk-button-primary', 'jfk-button-narrow', 'goog-toolbar-item-upload']);
};

goog.exportSymbol('good.drive.init.start', good.drive.init.start);