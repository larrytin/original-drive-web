'use strict';
goog.provide('good.drive.nav.button.ToggleView');

goog.require('goog.ui.ToggleButton');
goog.require('good.drive.nav.button.ToolBarView');
goog.require('goog.dom');



/**
 * @constructor
 * @param {goog.ui.ControlContent} content
 * @param {...Array.<string>} var_args
 * @param {Element} targetElm
 */
good.drive.nav.button.ToggleView = function(content, var_args, targetElm) {
  var button = new goog.ui.ToggleButton(content,
      good.drive.nav.button.TooBarRenderer.getInstance());
  good.drive.nav.button.View.call(this, button, targetElm,
      var_args);
};
goog.inherits(good.drive.nav.button.ToggleView, good.drive.nav.button.View);
