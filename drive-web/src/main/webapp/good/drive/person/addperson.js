'use strict';
goog.provide('good.drive.person');

goog.require('good.constants');
goog.require('good.drive.nav.menu');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.ui.Dialog');

/**
 * @constructor
 */
good.drive.person.AddPerson = function() {
  var personman = goog.dom.getElement('personman');
  this._personman = personman;
  this.rightmenu();
  var that = this;
  var dialog = this.createDailog('新建人员', function(evt) {
  switch (evt.key) {
  case 'cr':
    that.insertOrUpdate();
    if (good.drive.person.AddPerson.FLAG) {
      return false;
    }
    break;
  case 'c':
    break;
  default:
    break;
}

  });
  this._dialog = dialog;
  };

/** Type{boolean} */
good.drive.person.AddPerson.FLAG = false;

/**
 * @param {string} str
 * @return {boolean}
 */
good.drive.person.AddPerson.ISEMPTY = function(str) {
  if (str == null || str == '') {
    return true;
  }else {
    return false;
  }
};

/**
 *
 */
good.drive.person.AddPerson.prototype.rightmenu = function() {
  var that = this;
  var menu = new good.drive.nav.menu.View();
  var type = [['i', '新建人员']];
  var corner = {targetCorner: undefined,
      menuCorner: undefined, contextMenu: true};
  var rightMenu = menu.genPopupMenu(that._personman, type, undefined, corner);
  goog.events.listen(rightMenu, 'action', function(e) {
    that._dialog.setVisible(true);
    var displayname = goog.dom.getElement('name');
    displayname.value = '';
    var username = goog.dom.getElement('username');
    username.value = '';
    var password = goog.dom.getElement('password');
    password.value = '';
    var errormsg_name = goog.dom.getElement('errormsg_name');
    errormsg_name.innerText = '';
    var errormsg_username = goog.dom.getElement('errormsg_username');
    var errormsg_password = goog.dom.getElement('errormsg_password');
    errormsg_password.innerText = '';
    errormsg_username.innerText = '';
    goog.events.listen(username, goog.events.EventType.CHANGE, function(e) {
      if (!good.drive.person.AddPerson.ISEMPTY(username.value)) {
        var rpc = new good.net.CrossDomainRpc('POST',
            good.config.ACCOUNT, good.config.VERSION,
            'findByName/' + username.value,
            good.config.SERVERADRESS);
        rpc.send(function(json) {
          if (json && json['token']) {
            errormsg_username.innerText = '该用户名已存在。改用其他用户名?';
          } else {
            errormsg_username.innerText = '';
          }
        });
      } else {
        errormsg_username.innerText = '请输入用户名';
      }
    });
  });
};

/**
 * @param {string} title
 * @param {Function} handle
 * @return {goog.ui.Dialog}
 */
good.drive.person.AddPerson.prototype.createDailog = function(title, handle) {
  var dialog = new goog.ui.Dialog();
  dialog.setContent(good.drive.person.AddPerson.CREATEFORM);
  dialog.setTitle(title);
  var buttonSet = this.genButtonSet([
                                   {key: 'cr',
                                    caption: '确定'},
                                    {key: 'c',
                                      caption: '取消'}
                                    ]);
  dialog.setButtonSet(buttonSet);
  goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT, handle);
  return dialog;
};

/** Type{string} */
good.drive.person.AddPerson.CREATEFORM =
'<p><strong>姓名 </strong></p><div class="new' +
'-item-dialog-folder-input"><input id="name" type="text"' +
' dir="ltr"><span role="alert" style="margin: .5em 0 0;display: ' +
'block;color: #dd4b39;line-height: 17px" id="errormsg_name" ></span></div>' +
'<p><strong>用户名</strong></p><div class="new' +
'-item-dialog-folder-input"><input id="username" type="text"' +
' dir="ltr"><span role="alert" style="margin: .5em 0 0;display: ' +
'block;color: #dd4b39;line-height: 17px" ' +
'id="errormsg_username" ></span></div>' +
'<p><strong>密码 </strong></p><div class="new' +
'-item-dialog-folder-input"><input id="password" type="password"' +
' dir="ltr"><span role="alert" style="margin: .5em 0 0;display: ' +
'block;color: #dd4b39;line-height: 17px" ' +
'id="errormsg_password" ></span></div>';

/**
 * @param {Object} buttons
 * @return {goog.ui.Dialog.ButtonSet}
 */
good.drive.person.AddPerson.prototype.genButtonSet = function(buttons) {
  var buttonSet = new goog.ui.Dialog.ButtonSet();
  goog.array.forEach(buttons, function(button, idx) {
    if (idx == 0) {
      buttonSet.addButton(button, false, false);
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
 *
 */
good.drive.person.AddPerson.prototype.insertOrUpdate = function() {
  var that = this;
  var displayname = goog.dom.getElement('name').value;
  var errormsg_name = goog.dom.getElement('errormsg_name');
  var username = goog.dom.getElement('username').value;
  var errormsg_username = goog.dom.getElement('errormsg_username');
  var password = goog.dom.getElement('password').value;
  var errormsg_password = goog.dom.getElement('errormsg_password');
  if (good.drive.person.AddPerson.ISEMPTY(displayname)) {
    errormsg_name.innerText = '请输入姓名';
  } else {
    errormsg_name.innerText = '';
  }
  if (good.drive.person.AddPerson.ISEMPTY(username)) {
    errormsg_username.innerText = '请输入用户名';
  }

  if (good.drive.person.AddPerson.ISEMPTY(password)) {
    errormsg_password.innerText = '请输入密码';
  } else {
    errormsg_password.innerText = '';
  }
  if (errormsg_name.innerText != '' ||
      errormsg_username.innerText != '' ||
      errormsg_password.innerText != '') {
    good.drive.person.AddPerson.FLAG = true;
  } else {
    good.drive.person.AddPerson.FLAG = false;
  }
   if (!good.drive.person.AddPerson.FLAG) {
    var rpc = new good.net.CrossDomainRpc('POST',
        good.config.ACCOUNT,
        good.config.VERSION, 'accountinfo',
        good.config.SERVERADRESS);
    var body = {
      'name' : username,
      'token' : password,
      'displayName' : displayname};
    rpc.body = body;
    rpc.send(function(json) {
      if (json && !json['error']) {
        that._dialog.setVisible(false);
      }
    });
   }
};
