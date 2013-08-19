'use strict';
goog.provide('good.drive.device.createdialog');

goog.require('goog.ui.Dialog');

/**
 * @constructor
 * @param {Function} handle
 */
good.drive.device.View = function(handle) {
  if (good.drive.device.View.DIALOG == undefined) {
    var dialog = this.createDailog('新建设备', function(evt) {
      switch (evt.key) {
      case 'cr':
        handle();
        if (good.drive.device.View.FLAG) {
          return false;
        }
        break;
      case 'c':
        break;
      default:
        break;
    }
    });
    good.drive.device.View.DIALOG = dialog;
  }
};

/** Type{goog.ui.Dialog} */
good.drive.device.View.DIALOG = undefined;

/** Type{boolean} */
good.drive.device.View.FLAG = false;

/**
 * @param {string} title
 * @param {Function} handle
 * @return {goog.ui.Dialog}
 */
good.drive.device.View.prototype.createDailog = function(title, handle) {
  var dialog = new goog.ui.Dialog();
  dialog.setContent(good.drive.device.View.CREATEFORM);
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
good.drive.device.View.CREATEFORM =
'<p><strong>设备名称</strong></p><div class="new' +
'-item-dialog-folder-input"><input id="devicename" type="text"' +
' dir="ltr"><span role="alert" style="margin: .5em 0 0;display: ' +
'block;color: #dd4b39;line-height: 17px" id="errormsg_devicename" ></span></div>' +
'<p><strong>教室名称</strong></p><div class="new' +
'-item-dialog-folder-input"><input id="classroom" type="text"' +
' dir="ltr"><span role="alert" style="margin: .5em 0 0;display: ' +
'block;color: #dd4b39;line-height: 17px" ' +
'id="errormsg_classroom" ></span></div>';

/**
 * @param {Object} buttons
 * @return {goog.ui.Dialog.ButtonSet}
 */
good.drive.device.View.prototype.genButtonSet = function(buttons) {
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
 * @param {Json} data
 */
good.drive.device.View.prototype.initDailog = function(data) {
  good.drive.device.View.DIALOG.setVisible(true);
  var that = this;
  var devicename = goog.dom.getElement('devicename');
  devicename.value = '';
  var classroom = goog.dom.getElement('classroom');
  classroom.value = '';  
  var errormsg_devicename = goog.dom.getElement('errormsg_devicename');
  errormsg_devicename.innerText = '';
  var errormsg_classroom = goog.dom.getElement('errormsg_classroom'); 
  errormsg_classroom.innerText = '';
  if (data != undefined) {
    if (data['information'] == undefined) {
      devicename.value = '';
    } else {
      devicename.value = data['information'];
    }
    if (data['name'] == undefined) {
      classroom.value = '';
    } else {
      classroom.value = data['name'];
    }
  }
};

/**
* @param {Function} handle
*/
good.drive.device.View.prototype.insertOrUpdate = function(handle) {
 var devicename = goog.dom.getElement('devicename').value;
 var errormsg_devicename = goog.dom.getElement('errormsg_devicename');
 var classroom = goog.dom.getElement('classroom').value;
 var errormsg_classroom = goog.dom.getElement('errormsg_classroom'); 
 if (good.drive.person.View.ISEMPTY(devicename)) {
   errormsg_devicename.innerText = '请输入设备名称';
 } else {
   errormsg_devicename.innerText = '';
 }
 if (good.drive.person.View.ISEMPTY(classroom)) {
   errormsg_classroom.innerText = '请输入教室名称';
 } else {
   errormsg_classroom.innerText = '';
 }

 if (errormsg_devicename.innerText != '' ||
     errormsg_classroom.innerText != '') {
   good.drive.device.View.FLAG = true;
 } else {
   good.drive.device.View.FLAG = false;
 }
  if (!good.drive.device.View.FLAG) {
    if (good.drive.device.Listdevice.DEVICEID == undefined) {
      var rpc = new good.net.CrossDomainRpc('POST',
          good.constants.DEVICE,
          good.config.VERSION, 'deviceinfo',
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
      var deviceID = good.drive.device.Listdevice.DEVICEID;
      var rpc = new good.net.CrossDomainRpc('GET',
          good.constants.DEVICE,
          good.config.VERSION,
          'deviceinfo/' + deviceID,
          good.config.SERVERADRESS);
      rpc.send(function(json) {
        if (json && !json['error']) {
          var rpc = new good.net.CrossDomainRpc('POST',
              good.constants.DEVICE,
              good.config.VERSION, 'updateDeviceInfo',
              good.config.SERVERADRESS);
          json['name'] = classroom;
          json['information'] = devicename;          
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
