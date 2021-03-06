'use strict';
goog.provide('good.drive.nav.button.ToolBarButton');

goog.require('good.drive.nav.button.ToolBarView');



/**
 * 获取ToolbarButton
 * @constructor
 */
good.drive.nav.button.ToolBarButton = function() {
  var targetElm = goog.dom.getElement('viewpane-toolbar');
  this.leftElm = goog.dom.getFirstElementChild(targetElm);
  this.rightElm = goog.dom.getLastElementChild(targetElm);
};


/**
 * 获取工具栏创建按钮
 * @return {good.drive.nav.button.ToolBarView}
 */
good.drive.nav.button.ToolBarButton.prototype.createTolBtn = function() {
  var icon = goog.dom.createDom('div', {'class':
        'viewpane-toolbar-collection-icon drive-sprite-core-new-folder'});
  return new good.drive.nav.button.ToolBarView(icon,
      ['jfk-button-standard', 'goog-toolbar-item-collection-button'],
      this.leftElm);
};


/**
 * 获取工具栏删除按钮
 * @return {good.drive.nav.button.ToolBarView}
 */
good.drive.nav.button.ToolBarButton.prototype.deleteTolBtn = function() {
  var icon = goog.dom.createDom('div',
      {'class': 'viewpane-toolbar-trash-icon drive-sprite-core-trash'});
  return new good.drive.nav.button.ToolBarView(icon,
      ['jfk-button-standard', 'jfk-button-collapse-left',
       'goog-toolbar-item-trash-button'], this.leftElm);
};


/**
 * 获取工具栏重命名按钮
 * @return {good.drive.nav.button.ToolBarView}
 */
good.drive.nav.button.ToolBarButton.prototype.renameTolBtn = function() {
  var icon = goog.dom.createDom('div',
      {'class': 'viewpane-toolbar-organize-icon drive-sprite-core-organize'});
  return new good.drive.nav.button.ToolBarView(icon,
      ['jfk-button-standard', 'jfk-button-collapse-left',
       'jfk-button-collapse-right',
       'goog-toolbar-item-organize-button'], this.leftElm);
};

