'use strict';
goog.provide('good.drive.nav.button.ToggleButton');

goog.require('good.drive.nav.button.ToggleView');



/**
 * @constructor
 */
good.drive.nav.button.ToggleButton = function() {
  var targetElm = goog.dom.getElement('viewpane-toolbar');
  this.leftElm = goog.dom.getFirstElementChild(targetElm);
  this.rightElm = goog.dom.getLastElementChild(targetElm);
};


/**
 * @return {good.drive.nav.button.ToggleView}
 */
good.drive.nav.button.ToggleButton.prototype.createListBtn = function() {
  var icon = goog.dom.createDom('div', {
    'class' : 'viewpane-toolbar-details-icon drive-sprite-core-view-options-list'
  });
  return new good.drive.nav.button.ToggleView(icon,
      ['jfk-button-standard', 'jfk-button-narrow',
       'jfk-button-collapse-right',
       'goog-toolbar-item-details-button'], this.rightElm);
};

/**
 * @return {good.drive.nav.button.ToggleView}
 */
good.drive.nav.button.ToggleButton.prototype.createGridBtn = function() {
  var icon = goog.dom.createDom('div', {
    'class' : 'viewpane-toolbar-grid-icon drive-sprite-core-view-options-grid'
  });
  return new good.drive.nav.button.ToggleView(icon,
      ['jfk-button-standard', 'jfk-button-narrow',
       'jfk-button-collapse-left',
       'goog-toolbar-item-details-button'], this.rightElm);
};

