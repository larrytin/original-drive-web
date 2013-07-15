'use strict';
goog.provide('good.drive.search');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Popup');
goog.require('goog.ui.PopupMenu');



/**
 * @constructor
 */
good.drive.search.AdvancedMenu = function() {

  var popupElt = goog.dom.getElement('search_menu');

  var btn = goog.dom.getElement('advanced-search-button-container');
  var pop = new goog.ui.PopupMenu();
  pop.decorateContent = function(element) {
    var renderer = this.getRenderer();
    var contentElements = this.getDomHelper().
    getElementsByTagNameAndClass('div',
        goog.getCssName(renderer.getCssClass(), 'vertical'), element);

    // Some versions of IE do not like it when you access this nodeList
    // with invalid indices. See
    // http://code.google.com/p/closure-library/issues/detail?id=373
    var length = contentElements.length;
    for (var i = 0; i < length; i++) {
      renderer.decorateChildren(this, contentElements[i]);
    }
  };

  pop.setToggleMode(true);
  pop.decorate(popupElt);

  pop.attach(
      btn,
      goog.positioning.Corner.BOTTOM_RIGHT,
      goog.positioning.Corner.TOP_RIGHT);

  popupElt.style.minWidth = '510px';

  //popupElt.style.minHeight = '305px';
  this._pop = pop;
  this.popaction();
};

/**
 *
 */
good.drive.search.AdvancedMenu.prototype.popaction = function() {
  goog.events.listen(this._pop, 'action', function(e) {
    var div = goog.dom.createDom('div',
        {'class': 'goog-inline-block filter-chip',
          'title': '在' +
          e.target.element_.innerText.trim() +
          '过滤器。使用退格或 Delete 键可以删除'},null);
    var span_title = goog.dom.createDom('span',
        {'class': 'goog-inline-block filter-chip-label'},
        e.target.element_.innerText.trim());
    var span_clean = goog.dom.createDom('span',
        {'class': 'goog-inline-block filter-chip-x'},'×');
    div.appendChild(span_title);
    div.appendChild(span_clean);
    var search_input = goog.dom.getElement('search_input');
    var clear_container = goog.dom.
        getElement('search-input-clear-container').children[0];
    search_input.appendChild(div);
    if (search_input.childElementCount === 0) {
      clear_container.style.display = 'none';
    } else {
      clear_container.style.removeProperty('display');
    }
  });
};
