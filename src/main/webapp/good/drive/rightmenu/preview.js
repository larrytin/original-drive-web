'use strict';
goog.provide('good.drive.rightmenu.preview');

goog.require('goog.Uri');
goog.require('goog.dom');

/**
 * IE文件打开页面控制类
 */
good.drive.rightmenu.preview.start = function() {

  var uri = new goog.Uri(window.location);

  var play = goog.dom.getElement('Player');
  play.data = uri.getParameterValue('SRC');
  play.type = uri.getParameterValue('TYPE');

  var param = goog.dom.getElement('param1');
  param.value = uri.getParameterValue('SRC');
};

goog.exportSymbol('good.drive.rightmenu.preview.start',
    good.drive.rightmenu.preview.start);
