'use strict';
goog.provide('good.drive.device');

goog.require('good.constants');
goog.require('good.drive.device.createdailog');
goog.require('good.drive.nav.menu');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');


/**
 * @constructor
 */
good.drive.device.AddDevice = function() {
  var deviceman = goog.dom.getElement('deviceman');
  this._deviceman = deviceman;
  this.rightmenu();
  var that = this;
  var view = new good.drive.device.View(function() {
       view.insertOrUpdate(function() {
         good.drive.device.Listdevice.SEARCHDEVICE();
      });
    });
  this._view = view;
  };

/**
 *
 */
  good.drive.device.AddDevice.prototype.rightmenu = function() {
  var that = this;
  var menu = new good.drive.nav.menu.View();
  var type = [['i', '添加设备']];
  var corner = {targetCorner: undefined,
      menuCorner: undefined, contextMenu: true};
  var rightMenu = menu.genPopupMenu(that._deviceman, type, undefined, corner);
  goog.events.listen(rightMenu, 'action', function(e) {
    good.drive.device.View.DIALOG.setTitle('添加设备');
    that._view.initDailog();
  });
};
