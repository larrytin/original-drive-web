'use strict';
goog.provide('good.drive.device.listdevice');

goog.require('good.constants');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');

/**
 * @constructor
 */
good.drive.device.Listdevice = function() {
  var personman = goog.dom.getElement('personman');
  this._personman = personman;
  var grid = good.drive.device.Listdevice.SEARCHGRID;
  if (grid == undefined) {
    grid = new good.drive.view.table.View(
        {'select': 'select', 'information': '设备信息',
          'name': '教师名称'});
    grid.render(goog.dom.getElement('tableviewmanager'));
    good.drive.device.Listdevice.SEARCHGRID = grid;
    good.drive.view.baseview.View.visiable(grid);
  }
};

/** Type {good.drive.view.table.View} */
good.drive.device.Listdevice.SEARCHGRID = undefined;

/**
 *
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
      goog.array.forEach(json['items'], function(item) {
        var cell = grid.createCell(item);
        cell.getValue = function(key) {
          return this.data[key];
        };
        grid.add(cell);
        cell.renderCell();
      });
      good.drive.view.baseview.View.visiable(grid);
    }
  });
};
