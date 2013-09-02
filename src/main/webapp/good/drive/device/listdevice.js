'use strict';
goog.provide('good.drive.device.listdevice');

goog.require('good.constants');
goog.require('good.drive.device.View');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');

/**
 * 设备管理查询类
 * @constructor
 */
good.drive.device.Listdevice = function() {
  var personman = goog.dom.getElement('personman');
  this._personman = personman;
  var grid = good.drive.device.Listdevice.SEARCHGRID;
  if (grid == undefined) {
    grid = new good.drive.view.table.View(
        {'select': 'select', 'information': '设备信息',
          'name': '教室名称'});
    grid.render(goog.dom.getElement('tableviewmanager'));
    good.drive.device.Listdevice.SEARCHGRID = grid;
    goog.style.showElement(
        grid.getElement());
  }

  var view = new good.drive.device.View(function() {
    view.insertOrUpdate(
        function(e) {
          good.drive.device.Listdevice.SEARCHDEVICE();
        });
  });
  this._view = view;
};

/** @type {good.drive.view.table.View} */
good.drive.device.Listdevice.SEARCHGRID = undefined;

/** @type {string} */
good.drive.device.Listdevice.DEVICEID = undefined;

/**
 * 查询设备并Table显示
 */
good.drive.device.Listdevice.SEARCHDEVICE = function() {
  var rpc = new good.net.CrossDomainRpc('GET',
      good.constants.DEVICE,
      good.config.VERSION,
      'deviceinfo',
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    good.drive.device.Listdevice.SEARCHGRID.clear();
    if (json && !json['error']) {
      var grid = good.drive.device.Listdevice.SEARCHGRID;
      if (json['items'] != undefined) {
        goog.array.forEach(json['items'], function(item) {
          var cell = grid.createCell(item);
          cell.getValue = function(key) {
            return this.data[key];
          };
          grid.add(cell);
          cell.renderCell();
        });
      }
      good.drive.view.baseview.View.visiable(grid);
    }
  });
};


/**
 * 根据设备Id删除设备
 * @param {string} deviceId
 */
good.drive.device.Listdevice.prototype.deleteDevice = function(deviceId) {
  var that = this;
  var rpc = new good.net.CrossDomainRpc('POST',
      good.constants.DEVICE,
      good.config.VERSION,
      'deviceinfo/' + deviceId,
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      alert('删除成功！');
      good.drive.device.Listdevice.SEARCHDEVICE();
    }
  });
};


/**
 * 删除选中的多个设备
 * @param {Array.<string>} deviceIds
 */
good.drive.device.Listdevice.prototype.deleteDevices = function(deviceIds) {
  if (deviceIds != null && deviceIds.length != 0) {
    goog.array.forEach(deviceIds, function(deviceId, index) {
      var rpc = new good.net.CrossDomainRpc('POST',
          good.constants.DEVICE,
          good.config.VERSION,
          'deviceinfo/' + deviceId,
          good.config.SERVERADRESS);
      rpc.send(function(json) {
        if (json && !json['error']) {
          if (index == (deviceIds.length - 1)) {
            alert('删除成功！');
            good.drive.device.Listdevice.SEARCHDEVICE();
          }
        }
      });
    });
  }
};


/**
 * 更新设备与教室的对应关系
 * @param {string} deviceId
 */
good.drive.device.Listdevice.prototype.editDevice = function(deviceId) {
  good.drive.device.Listdevice.DEVICEID = deviceId;
  var that = this;
  var rpc = new good.net.CrossDomainRpc('GET',
      good.constants.DEVICE,
      good.config.VERSION,
      'deviceinfo/' + deviceId,
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      good.drive.device.View.DIALOG.setTitle('编辑设备');
      that._view.initDailog(json);
    }
  });
};

