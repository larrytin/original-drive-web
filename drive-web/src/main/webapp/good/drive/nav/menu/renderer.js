goog.provide('good.drive.nav.menu.ViewRenderer');

goog.require('goog.ui.MenuRenderer');

good.drive.nav.menu.ViewRenderer = function() {
		goog.ui.MenuRenderer.call(this);
	};
	goog.inherits(good.drive.nav.menu.ViewRenderer, goog.ui.MenuRenderer);
	goog.addSingletonGetter(good.drive.nav.menu.ViewRenderer);

	good.drive.nav.menu.ViewRenderer.CSS_CLASS = goog.getCssName('goog-menu');

	/*good.drive.nav.menu.ViewRenderer.prototype.getAriaRole = function() {
	  return goog.a11y.aria.Role.MENU;
	};

	good.drive.nav.menu.ViewRenderer.prototype.canDecorate = function(element) {
	  return element.tagName == 'UL' ||
	      good.drive.nav.menu.ViewRenderer.superClass_.canDecorate.call(this, element);
	};

	good.drive.nav.menu.ViewRenderer.prototype.getDecoratorForChild = function(element) {
	  return element.tagName == 'HR' ?
	      new goog.ui.Separator() :
	      good.drive.nav.menu.ViewRenderer.superClass_.getDecoratorForChild.call(this,
	          element);
	};*/

	good.drive.nav.menu.ViewRenderer.prototype.containsElement = function(menu, element) {
	  return goog.dom.contains(menu.getElement(), element);
	};

	good.drive.nav.menu.ViewRenderer.prototype.getCssClass = function() {
	  return good.drive.nav.menu.ViewRenderer.CSS_CLASS;
	};
	
	/*
	good.drive.nav.menu.ViewRenderer.prototype.initializeDom = function(container) {
	  good.drive.nav.menu.ViewRenderer.superClass_.initializeDom.call(this, container);

	  var element = container.getElement();
	  goog.asserts.assert(element, 'The menu DOM element cannot be null.');
	  goog.a11y.aria.setState(element, goog.a11y.aria.State.HASPOPUP, 'true');
	};*/