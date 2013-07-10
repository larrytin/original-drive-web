'use strict';
goog.provide('good.drive.nav.button.MenuBarButton');

goog.require('good.drive.nav.button.MenuBarView');



/**
 * @constructor
 */
good.drive.nav.button.MenuBarButton = function() {
  var targetElm = goog.dom.getElement('viewpane-toolbar');
  this.leftElm = targetElm.firstElementChild;
  this.rightElm = targetElm.lastElementChild;
};


/**
 * @param {goog.ui.PopupMenu} menu
 * @return {good.drive.nav.button.MenuBarView}
 */
good.drive.nav.button.MenuBarButton.prototype.moreMenuBar = function(menu) {
  var label = goog.dom.createDom('div',
      {'class': 'goog-inline-block goog-flat-menu-button-caption'}, '更多');
  var icon = goog.dom.createDom('div',
      {'class': 'goog-inline-block goog-flat-menu-button-dropdown'}, ' ');
  return new good.drive.nav.button.MenuBarView([label, icon],
      ['goog-toolbar-item-action-menu'], this.leftElm, menu);
};


/**
 * @param {goog.ui.PopupMenu} menu
 * @return {good.drive.nav.button.MenuBarView}
 */
good.drive.nav.button.MenuBarButton.prototype.settingMenuBar = function(menu) {
  var label = goog.dom.createDom('div',
      {'class': 'goog-inline-block goog-flat-menu-button-caption'},
      goog.dom.createDom('div', {'class':
            'viewpane-toolbar-settings-icon drive-sprite-core-settings'}));
  var icon = goog.dom.createDom('div',
      {'class': 'goog-inline-block goog-flat-menu-button-dropdown'}, ' ');
  return new good.drive.nav.button.MenuBarView([label, icon],
      ['goog-toolbar-item-viewpane-settings'], this.rightElm, menu);
};
