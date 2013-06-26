goog.provide('good.drive.nav.button.Renderer');

goog.require('goog.a11y.aria.Role');
goog.require('goog.dom.NodeType');
goog.require('goog.dom.classes');
goog.require('goog.string');
goog.require('goog.ui.ButtonRenderer');
goog.require('goog.ui.INLINE_BLOCK_CLASSNAME');

good.drive.nav.button.Renderer = function() {
  goog.ui.ButtonRenderer.call(this);
};
goog.inherits(good.drive.nav.button.Renderer, goog.ui.ButtonRenderer);
goog.addSingletonGetter(good.drive.nav.button.Renderer);

good.drive.nav.button.Renderer.CSS_CLASS = goog.getCssName('jfk-button');

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


good.drive.nav.button.Renderer.prototype.getAriaRole = function() {
  return goog.a11y.aria.Role.BUTTON;
};

good.drive.nav.button.Renderer.prototype.getContentElement = function(element) {
  return element && /** @type {Element} */ (element.firstChild.firstChild);
};

good.drive.nav.button.Renderer.prototype.createButton = function(content, dom) {
  return dom.createDom('div',
      goog.ui.INLINE_BLOCK_CLASSNAME + ' ' +
      goog.getCssName(this.getCssClass(), 'outer-box'),
      dom.createDom('div',
          goog.ui.INLINE_BLOCK_CLASSNAME + ' ' +
          goog.getCssName(this.getCssClass(), 'inner-box'), content));
};

good.drive.nav.button.Renderer.prototype.canDecorate = function(element) {
  return element.tagName == 'DIV';
};

good.drive.nav.button.Renderer.prototype.hasBoxStructure = function(
    button, element) {
  var outer = button.getDomHelper().getFirstElementChild(element);
  var outerClassName = goog.getCssName(this.getCssClass(), 'outer-box');
  if (outer && goog.dom.classes.has(outer, outerClassName)) {

    var inner = button.getDomHelper().getFirstElementChild(outer);
    var innerClassName = goog.getCssName(this.getCssClass(), 'inner-box');
    if (inner && goog.dom.classes.has(inner, innerClassName)) {
      // We have a proper box structure.
      return true;
    }
  }
  return false;
};

good.drive.nav.button.Renderer.prototype.decorate = function(control, element) {
  var button = /** @type {goog.ui.Button} */ (control);
  // Trim text nodes in the element's child node list; otherwise madness
  // ensues (i.e. on Gecko, buttons will flicker and shift when moused over).
  good.drive.nav.button.Renderer.trimTextNodes_(element, true);
  good.drive.nav.button.Renderer.trimTextNodes_(element, false);

  // Create the buttom dom if it has not been created.
  if (!this.hasBoxStructure(button, element)) {
    element.appendChild(
        this.createButton(element.childNodes, button.getDomHelper()));
  }

  goog.dom.classes.add(element,
      goog.ui.INLINE_BLOCK_CLASSNAME, this.getCssClass());
  return good.drive.nav.button.Renderer.superClass_.decorate.call(this, button,
      element);
};


good.drive.nav.button.Renderer.prototype.getCssClass = function() {
  return good.drive.nav.button.Renderer.CSS_CLASS;
};

good.drive.nav.button.Renderer.trimTextNodes_ = function(element, fromStart) {
  if (element) {
    var node = fromStart ? element.firstChild : element.lastChild, next;
    // Tag soup HTML may result in a DOM where siblings have different parents.
    while (node && node.parentNode == element) {
      // Get the next/previous sibling here, since the node may be removed.
      next = fromStart ? node.nextSibling : node.previousSibling;
      if (node.nodeType == goog.dom.NodeType.TEXT) {
        // Found a text node.
        var text = node.nodeValue;
        if (goog.string.trim(text) == '') {
          // Found an empty text node; remove it.
          element.removeChild(node);
        } else {
          // Found a non-empty text node; trim from the start/end, then exit.
          node.nodeValue = fromStart ?
              goog.string.trimLeft(text) : goog.string.trimRight(text);
          break;
        }
      } else {
        // Found a non-text node; done.
        break;
      }
      node = next;
    }
  }
};
