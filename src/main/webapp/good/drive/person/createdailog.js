'use strict';
goog.provide('good.drive.person.createdailog');

goog.require('goog.ui.Dialog');

/**
 * 人员管理对话框类
 * @constructor
 * @param {Function} handle
 */
good.drive.person.View = function(handle) {
  if (good.drive.person.View.DIALOG == undefined) {
    var dialog = this.createDailog('新建人员', function(evt) {
      switch (evt.key) {
      case 'cr':
        handle();
        if (good.drive.person.View.FLAG) {
          return false;
        }
        break;
      case 'c':
        break;
      default:
        break;
    }
    });
    good.drive.person.View.DIALOG = dialog;
  }
};

/** @type {goog.ui.Dialog} */
good.drive.person.View.DIALOG = undefined;

/** @type {boolean} */
good.drive.person.View.FLAG = false;

/**
 * @param {string} str
 * @return {boolean}
 */
good.drive.person.View.ISEMPTY = function(str) {
  if (str == null || str == '') {
    return true;
  }else {
    return false;
  }
};


/**
 * 创建人员管理对话框
 * @param {string} title
 * @param {Function} handle
 * @return {goog.ui.Dialog}
 */
good.drive.person.View.prototype.createDailog = function(title, handle) {
  var dialog = new goog.ui.Dialog();
  dialog.setContent(good.drive.person.View.CREATEFORM);
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

/** @type {string} */
good.drive.person.View.CREATEFORM =
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
' dir="ltr" maxlength="12"><span role="alert"' +
' style="margin: .5em 0 0;display: ' +
'block;color: #dd4b39;line-height: 17px" ' +
'id="errormsg_password" ></span></div>';

/**
 * @param {Object} buttons
 * @return {goog.ui.Dialog.ButtonSet}
 */
good.drive.person.View.prototype.genButtonSet = function(buttons) {
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
 * 初始化人员管理对话框
 * @param {Json} data
 */
good.drive.person.View.prototype.initDailog = function(data) {
  good.drive.person.View.DIALOG.setVisible(true);
  var that = this;
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
  //更新人员信息时设定选中的数据
  if (data != undefined) {
    displayname.value = data['displayName'];
    username.value = data['name'];
  }
  goog.events.listen(username, goog.events.EventType.CHANGE, function(e) {
    if (!good.drive.person.View.ISEMPTY(username.value)) {
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
};

/**
* 新建或者更新人员信息
* @param {Function} handle
*/
good.drive.person.View.prototype.insertOrUpdate = function(handle) {
 //添加和更新时对人员信息进行check
 var displayname = goog.dom.getElement('name').value;
 var errormsg_name = goog.dom.getElement('errormsg_name');
 var username = goog.dom.getElement('username').value;
 var errormsg_username = goog.dom.getElement('errormsg_username');
 var password = goog.dom.getElement('password').value;
 var errormsg_password = goog.dom.getElement('errormsg_password');
 if (good.drive.person.View.ISEMPTY(displayname)) {
   errormsg_name.innerText = '请输入姓名';
 } else {
   errormsg_name.innerText = '';
 }
 if (good.drive.person.View.ISEMPTY(username)) {
   errormsg_username.innerText = '请输入用户名';
 }

 if (good.drive.person.View.ISEMPTY(password)) {
   errormsg_password.innerText = '请输入密码';
 } else {
   errormsg_password.innerText = '';
 }
 if (errormsg_name.innerText != '' ||
     errormsg_username.innerText != '' ||
     errormsg_password.innerText != '') {
   good.drive.person.View.FLAG = true;
 } else {
   good.drive.person.View.FLAG = false;
 }
  if (!good.drive.person.View.FLAG) {
    //check通过后进行插入或者更新用户信息
    if (good.drive.person.Listperson.USERID == undefined) {
      //插入新的用户
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
          handle();
        }
      });
    } else {
      //更新用户信息
      var userId = good.drive.person.Listperson.USERID;
      var rpc = new good.net.CrossDomainRpc('GET',
          good.config.ACCOUNT,
          good.config.VERSION,
          'accountinfo/' + userId,
          good.config.SERVERADRESS);
      rpc.send(function(json) {
        if (json && !json['error']) {
          var rpc = new good.net.CrossDomainRpc('POST',
              good.config.ACCOUNT,
              good.config.VERSION, 'updateAccountInfo',
              good.config.SERVERADRESS);
          json['name'] = username;
          json['token'] = password;
          json['displayName'] = displayname;
          rpc.body = json;
          rpc.send(function(json) {
            if (json && !json['error']) {
              handle();
            }
          });
        }
      });
    }
  }
};
