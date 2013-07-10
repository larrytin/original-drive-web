'use strict';
goog.provide('good.drive.nav.button.LeftButton');

goog.require('good.drive.nav.button.CustomView');



/**
 * @constructor
 */
good.drive.nav.button.LeftButton = function() {
  var targetElm = goog.dom.getElement('contentcreationpane');
  this.targetElm = targetElm;
};


/**
 * @return {good.drive.nav.button.CustomView}
 */
good.drive.nav.button.LeftButton.prototype.createBtn = function() {
  var label = goog.dom.createDom('div', {
    'class' : 'goog-inline-block jfk-button-caption'
  }, '创建');
  var empty = goog.dom.createDom('div', {
    'class' : 'goog-inline-block jfk-button-caption'
  }, ' ');
  return new good.drive.nav.button.CustomView([label, empty],
      ['jfk-button-primary', 'goog-toolbar-item-new'], this.targetElm);
};


/**
 * @return {good.drive.nav.button.CustomView}
 */
good.drive.nav.button.LeftButton.prototype.updateBtn = function() {
  var icon = goog.dom.createDom('div', {
    'class' : 'goog-inline-block jfk-button-caption'
  }, goog.dom.createDom('span', {
    'class' : 'drive-sprite-' +
        'core-upload upload-icon-position goog-inline-block'
  }));
  var empty = goog.dom.createDom('div', {
    'class' : 'goog-inline-block jfk-button-caption'
  }, ' ');
  return new good.drive.nav.button.CustomView([icon, empty], [
    'jfk-button-primary', 'jfk-button-narrow',
    'goog-toolbar-item-upload'], this.targetElm);
};
