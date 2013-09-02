'use strict';
goog.provide('good.drive.nav.button.CustomView');

goog.require('good.drive.nav.button');
goog.require('good.drive.nav.button.Renderer');
goog.require('goog.dom');



/**
 * 自定义Button
 * @constructor
 * @param {goog.ui.ControlContent} content
 * @param {...Array.<string>} var_args
 * @param {Element} targetElm
 */
good.drive.nav.button.CustomView = function(content, var_args, targetElm) {
  var button = new goog.ui.CustomButton(content,
      good.drive.nav.button.CustomRenderer.getInstance());
  good.drive.nav.button.View.call(this, button, targetElm, var_args);
};
goog.inherits(good.drive.nav.button.CustomView, good.drive.nav.button.View);



/**
 * 自定义Button的Renderer
 * @constructor
 */
good.drive.nav.button.CustomRenderer = function() {
  goog.ui.CustomButtonRenderer.call(this);
};
goog.inherits(good.drive.nav.button.CustomRenderer,
    good.drive.nav.button.Renderer);
goog.addSingletonGetter(good.drive.nav.button.CustomRenderer);
