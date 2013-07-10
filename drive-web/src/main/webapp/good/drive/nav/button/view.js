'use strict';
goog.provide('good.drive.nav.button');

goog.require('good.drive.nav.button.Renderer');
goog.require('goog.dom');
goog.require('goog.ui.CustomButton');



/**
 * @constructor
 * @param {goog.ui.Button} button
 * @param {Element} renderTarget
 * @param {...Array.<string>} var_args
 */
good.drive.nav.button.View = function(button, renderTarget, var_args) {
  button.render(renderTarget);
  for (var i in var_args) {
    goog.dom.classes.add(button.getElement(), var_args[i]);
  }
  this.button = button;
};


/**
 * @return {Element}
 */
good.drive.nav.button.View.prototype.getElement = function() {
  return this.button.getElement();
};
