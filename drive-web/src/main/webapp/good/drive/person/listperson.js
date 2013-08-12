'use strict';
goog.provide('good.drive.person.listperson');

goog.require('good.constants');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');

/**
 * @constructor
 */
good.drive.person.Listperson = function() {
  var personman = goog.dom.getElement('personman');
  this._personman = personman;

  goog.events.listen(personman, goog.events.EventType.CLICK, function(e) {
//    var rpc = new good.net.CrossDomainRpc('GET',
//        good.config.ACCOUNT,
//        good.config.VERSION,
//        'accountinfo',
//        good.config.SERVERADRESS);
//    rpc.send(function(json) {
//      if (json && !json['error']) {
//        var grid = new good.drive.view.table.View(
//          {'select': 'select', 'displayName': '姓名',
//            'name': '用户名'}, json['items']);
//        goog.array.forEach(json['items'], function(item) {
//          var cell = grid.createCell(item);
//          cell.getValue = function(key) {
//            return this.data[key];
//          };
//          grid.add(cell);
//          cell.renderCell();
//        });
//        good.drive.view.baseview.View.visiable(grid);
//      }
//    });
  });
};
