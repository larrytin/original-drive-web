'use strict';
goog.provide('good.drive.nav.button');

goog.require('good.drive.nav.button.Renderer');
goog.require('goog.dom');
goog.require('goog.ui.CustomButton');



/**
 * @constructor
 * @param {goog.ui.ControlContent} content
 * @param {...Array.<string>} var_args
 */
good.drive.nav.button.View = function(content, var_args) {
  var button_ = new goog.ui.CustomButton(content,
      good.drive.nav.button.Renderer.getInstance());
  button_.render(goog.dom.getElement('contentcreationpane'));
  for (var i in var_args) {
    goog.dom.classes.add(button_.getElement(), var_args[i]);
  }
  this.button = button_;
};


/**
 * @return {Element}
 */
good.drive.nav.button.View.prototype.getElement = function() {
  return this.button.getElement();
};
