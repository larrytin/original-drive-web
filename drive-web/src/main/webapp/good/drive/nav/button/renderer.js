goog.provide('good.drive.nav.button.Renderer');

goog.require('goog.ui.CustomButtonRenderer');



/**
 * @constructor
 */
good.drive.nav.button.Renderer = function() {
  goog.ui.ButtonRenderer.call(this);
};
goog.inherits(good.drive.nav.button.Renderer, goog.ui.CustomButtonRenderer);
goog.addSingletonGetter(good.drive.nav.button.Renderer);


/** @type {string} */
good.drive.nav.button.Renderer.CSS_CLASS = goog.getCssName('jfk-button');


/**
 * @param {goog.ui.Control} control goog.ui.Button to render.
 * @return {Element} Root element for the button.
 * @override
 */
good.drive.nav.button.Renderer.prototype.createDom = function(control) {
  var button = /** @type {goog.ui.Button} */ (control);
  var classNames = this.getClassNames(button);
  var attributes = {
    'class': goog.ui.INLINE_BLOCK_CLASSNAME + ' ' + classNames.join(' ')
  };
  var buttonElement = button.getDomHelper().createDom('div', attributes,
      this.createButton(button.getContent(), button.getDomHelper()));
  this.setTooltip(
      buttonElement, /** @type {!string}*/ (button.getTooltip()));
  this.setAriaStates(button, buttonElement);

  return buttonElement;
};


/** @override */
good.drive.nav.button.Renderer.prototype.getCssClass = function() {
  return good.drive.nav.button.Renderer.CSS_CLASS;
};
