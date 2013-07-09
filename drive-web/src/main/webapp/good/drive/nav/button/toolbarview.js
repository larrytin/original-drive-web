'use strict';
goog.provide('good.drive.nav.button.ToolBarView');

goog.require('good.drive.nav.button');
goog.require('good.drive.nav.button.Renderer');
goog.require('goog.dom');



/**
 * @constructor
 * @param {goog.ui.ControlContent} content
 * @param {...Array.<string>} var_args
 * @param {Element} targetElm
 */
good.drive.nav.button.ToolBarView = function(content, var_args, targetElm) {
  var button = new goog.ui.CustomButton(content,
      good.drive.nav.button.TooBarRenderer.getInstance());
  good.drive.nav.button.View.call(this, button, targetElm,
      var_args);
};
goog.inherits(good.drive.nav.button.ToolBarView, good.drive.nav.button.View);



/**
 * @constructor
 */
good.drive.nav.button.TooBarRenderer = function() {
  goog.ui.CustomButtonRenderer.call(this);
};
goog.inherits(good.drive.nav.button.TooBarRenderer,
    good.drive.nav.button.Renderer);
goog.addSingletonGetter(good.drive.nav.button.TooBarRenderer);


/**
 * @param {goog.ui.Control} control goog.ui.Button to render.
 * @return {Element} Root element for the button.
 * @override
 */
good.drive.nav.button.TooBarRenderer.prototype.createDom = function(control) {
  var button = /** @type {goog.ui.Button} */ (control);
  var classNames = this.getClassNames(button);
  var attributes = {
    'class': goog.ui.INLINE_BLOCK_CLASSNAME + ' ' + classNames.join(' ')
  };
  var buttonElement = button.getDomHelper().createDom('div',
      attributes, button.getContent());
  this.setTooltip(
      buttonElement, /** @type {!string}*/ (button.getTooltip()));
  this.setAriaStates(button, buttonElement);

  return buttonElement;
};
