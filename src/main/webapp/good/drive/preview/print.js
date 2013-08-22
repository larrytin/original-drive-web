'use strict';
goog.provide('good.drive.preview.print');

goog.require('goog.Uri');
goog.require('goog.dom');

/**
 *
 */
good.drive.preview.print.start = function() {
  var uri = new goog.Uri(window.location);
  var img_print = goog.dom.getElement('img_print');
  img_print.src = uri.getParameterValue('SRC');
  window.print();
};

goog.exportSymbol('good.drive.preview.print.start',
    good.drive.preview.print.start);
