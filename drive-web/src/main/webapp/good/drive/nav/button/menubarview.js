'use strict';
goog.provide('good.drive.nav.button.MenuBarView');

goog.require('good.drive.nav.button');
goog.require('goog.dom');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuButtonRenderer');



/**
 * @constructor
 * @param {goog.ui.ControlContent} content
 * @param {...Array.<string>} var_args
 * @param {Element} targetElm
 * @param {goog.ui.PopupMenu} menu
 */
good.drive.nav.button.MenuBarView = function(content,
    var_args, targetElm, menu) {
  var button = new goog.ui.MenuButton(content, menu,
      good.drive.nav.button.MenuBarRenderer.getInstance());
  good.drive.nav.button.View.call(this, button, targetElm, var_args);
};
goog.inherits(good.drive.nav.button.MenuBarView, good.drive.nav.button.View);



/**
 * @constructor
 */
good.drive.nav.button.MenuBarRenderer = function() {
  goog.ui.MenuButtonRenderer.call(this);
};
goog.inherits(good.drive.nav.button.MenuBarRenderer,
    goog.ui.MenuButtonRenderer);
goog.addSingletonGetter(good.drive.nav.button.MenuBarRenderer);


/**
 * @type {string}
 */
good.drive.nav.button.MenuBarRenderer.CSS_CLASS =
    goog.getCssName('goog-flat-menu-button');


/**
 * @param {goog.ui.Control} control goog.ui.Button to render.
 * @return {Element} Root element for the button.
 * @override
 */
good.drive.nav.button.MenuBarRenderer.prototype.createDom =
    function(control) {
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


/**
 * @override
 */
good.drive.nav.button.MenuBarRenderer.prototype.getCssClass = function() {
  return good.drive.nav.button.MenuBarRenderer.CSS_CLASS;
};
