'use strict';
goog.provide('good.drive.nav.dialog');

goog.require('goog.dom');
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.Dialog');

/**
 * 构建弹出框
 * @constructor
 */
good.drive.nav.dialog.View = function() {
  var createFolderDialog_ = new goog.ui.Dialog(null, true);
  createFolderDialog_
      .setContent('<p>请输入新文件夹的名称：</p><div class="new' +
          '-item-dialog-folder-input"><input id="crateFolder" type="text"' +
          ' dir="ltr"></div>');
  createFolderDialog_.setTitle('新建文件夹');

  var buttonSet = this.genButtonSet([
                                     {key: 'cr',
                                      caption: '确定'},
                                      {key: 'c',
                                        caption: '取消'}
                                      ]);
  createFolderDialog_.setButtonSet(buttonSet);
  this.createDialog = createFolderDialog_;

  var modifyFolderDialog_ = new goog.ui.Dialog(null, true);
  modifyFolderDialog_
  .setContent('<p>请为该项输入新名称：</p><div class="new' +
      '-item-dialog-folder-input"><input id="modifyFolder" type="text"' +
      ' dir="ltr"></div>');
  modifyFolderDialog_.setTitle('重命名');
  modifyFolderDialog_.setButtonSet(buttonSet);
  this.modifyDialog = modifyFolderDialog_;
};

/**
 * 生成一个弹出框
 * @param {string} title
 * @param {Function} handle
 * @param {number} id
 * @param {Object} buttons
 * @return {goog.ui.Dialog}
 */
good.drive.nav.dialog.View.prototype.genDialog =
  function(title, handle, id, buttons) {
  var dialog = new goog.ui.Dialog(null, true);
  dialog.setContent('<p>请输入' + title + '的名称：</p><div class="new' +
      '-item-dialog-folder-input"><input id="' + id + '" type="text"' +
      ' dir="ltr"></div>');
  dialog.setTitle(title);
  var buttonSet = undefined;
  if (buttons != undefined) {
    buttonSet = this.genButtonSet(buttons);
  } else {
    buttonSet = this.genButtonSet([
                                   {key: 'cr',
                                    caption: '确定'},
                                    {key: 'c',
                                      caption: '取消'}
                                    ]);
  }
  dialog.setButtonSet(buttonSet);
  goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT,
      handle);
  return dialog;
};

/**
 * 构建一个弹出框功能按钮
 * @param {Object} buttons
 * @return {goog.ui.Dialog.ButtonSet}
 */
good.drive.nav.dialog.View.prototype.genButtonSet = function(buttons) {
  var buttonSet = new goog.ui.Dialog.ButtonSet();
  goog.array.forEach(buttons, function(button, idx) {
    if (idx == 0) {
      buttonSet.addButton(button, true);
      return;
    }
    buttonSet.addButton(button, false, true);
  });
  buttonSet.render = function() {
    if (this.element_) {
      this.element_.innerHTML = '';
      var domHelper = goog.dom.getDomHelper(this.element_);
      goog.structs.forEach(this, function(caption, key) {
        var button = domHelper.createDom('button', {
          'name' : key
        }, caption);
        if (key == this.defaultButton_) {
          button.className = goog.getCssName(this.class_, 'default');
          goog.dom.classes.add(button, this.class_ + '-action');
        }
        this.element_.appendChild(button);
      }, this);
    }
  };
  return buttonSet;
};

/**
 * 构建一个移动的弹出框
 * @param {string} title
 * @param {Function} handle
 * @return {goog.ui.Dialog}
 */
good.drive.nav.dialog.View.prototype.moveToDialog = function(title, handle) {
  var sb = new goog.string.StringBuffer();
  var dialog = new goog.ui.Dialog(null, true);
  dialog.setContent(this.getMoveToContent(title, 'moveTo'));
  dialog.setTitle('资源安排至');
  dialog.setButtonSet(this.genButtonSet([
                                         {key: 'mv',
                                           caption: '移动'},
                                           {key: 'c',
                                             caption: '取消'}
                                           ]));
  goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT,
      handle);
  return dialog;
};

/**
 * 构建资源安排至的弹出框
 * @param {string} title
 * @param {Function} handle
 * @return {goog.ui.Dialog}
 */
good.drive.nav.dialog.View.prototype.favoritesToDialog =
  function(title, handle) {
  var dialog = new goog.ui.Dialog(null, true);
  dialog.setContent(this.getMoveToContent(title, 'favoritesTo'));
  dialog.setTitle('收藏至');
  dialog.setButtonSet(this.genButtonSet([
                                         {key: 'fv',
                                           caption: '收藏'},
                                           {key: 'c',
                                             caption: '取消'}
                                           ]));
  goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT,
      handle);
  return dialog;
};

/**
 * 构建Tree移动的弹出框
 * @param {string} title
 * @param {string} target
 * @return {string}
 */
good.drive.nav.dialog.View.prototype.getMoveToContent =
  function(title, target) {
  var sb = new goog.string.StringBuffer();
  sb.append(goog.dom.createDom('div',
      {'class': 'folders-popup-summary'},
      goog.dom.createDom('div', {'class': 'goog-control'},
      '目前此项位于 ',
      goog.dom.createDom('span', {'class':
        'goog-inline-block treedoclistview-init-spacing'}),
      goog.dom.createDom('span', {'class': 'treedoclistview-node-name'},
          goog.dom.createDom('span', {'dir': 'ltr'}, title)),
          '中')).outerHTML);
  sb.append(goog.dom.createDom(
      'div', {'class': 'folders-popup single-selection ' +
        'navpane nav-tree-folder-view', 'id': target}).outerHTML);
  return sb.toString();
};

/**
 * 构建以个创建弹出框
 * @param {Function} handle
 * @return {goog.ui.Dialog}
 */
good.drive.nav.dialog.View.prototype.createFolderDialog = function(handle) {
  goog.events.listen(this.createDialog, goog.ui.Dialog.EventType.SELECT,
      handle);
  return this.createDialog;
};


/**
 * 构建一个修改弹出框
 * @param {Function} handle
 * @return {goog.ui.Dialog}
 */
good.drive.nav.dialog.View.prototype.modifyFolderDialog =
    function(handle) {
  goog.events.listen(this.modifyDialog, goog.ui.Dialog.EventType.SELECT,
      handle);
  return this.modifyDialog;
};
