'use strict';
goog.provide('good.drive.nav.dialog');

goog.require('goog.dom');
goog.require('goog.ui.Dialog');



/**
 * @constructor
 */
good.drive.nav.dialog.View = function() {
  var createFolderDialog_ = new goog.ui.Dialog(null, true);
  createFolderDialog_
      .setContent('<p>请输入新文件夹的名称：</p><div class="new' +
          '-item-dialog-folder-input"><input type="text"' +
          ' dir="ltr"></div>');
  createFolderDialog_.setTitle('新建文件夹');

  var buttonSet = new goog.ui.Dialog.ButtonSet().addButton({
    key: 'cr',
    caption: '创建'
  }, true).addButton({
    key: 'c',
    caption: '取消'
  }, false, true);

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
  createFolderDialog_.setButtonSet(buttonSet);
  this.createDialog = createFolderDialog_;
};


/**
 * @param {Function} handle
 * @return {goog.ui.Dialog}
 */
good.drive.nav.dialog.View.prototype.createFolderDialog = function(handle) {
  goog.events.listen(this.createDialog, goog.ui.Dialog.EventType.SELECT,
      handle);
  return this.createDialog;
};
