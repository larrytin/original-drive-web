'use strict';
goog.provide('good.drive.search');

goog.require('goog.ui.MenuItem');
goog.require('goog.ui.PopupMenu');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.ui.Popup');



good.drive.search.AdvancedMenu = function() {
  
  var popupElt = goog.dom.getElement('search_menu');

  var btn = goog.dom.getElement('advanced-search-button-container');
  
  var pop = new goog.ui.PopupMenu();
  
  pop.setToggleMode(true);
  pop.decorate(popupElt);

  pop.attach(
      btn,
      goog.positioning.Corner.BOTTOM_RIGHT,
      goog.positioning.Corner.TOP_RIGHT);  
 
  popupElt.style.minWidth = '510px';
  
  popupElt.style.minHeight = '305px';
};
