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
  var grid = good.drive.person.Listperson.SEARCHGRID;
  if (grid == undefined) {
    grid = new good.drive.view.table.View(
        {'select': 'select', 'displayName': '姓名',
          'name': '用户名'});
    grid.render(goog.dom.getElement('tableviewmanager'));
    good.drive.person.Listperson.SEARCHGRID = grid;
    good.drive.view.baseview.View.visiable(grid);
  }
  
  var view = new good.drive.person.View();
  var dialog = view.createDailog('编辑人员', function(evt) {
  switch (evt.key) {
    case 'cr':
      view.insertOrUpdate(good.drive.person.Listperson.USERID,
          function(e) {
            that.searchPerson();
          });
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
  this._view = view;
};

/** Type {good.drive.view.table.View} */
good.drive.person.Listperson.SEARCHGRID = undefined;

/** Type {string} */
good.drive.person.Listperson.USERID = undefined;

/**
 *
 */
good.drive.person.Listperson.prototype.searchPerson = function() {
  var rpc = new good.net.CrossDomainRpc('GET',
      good.config.ACCOUNT,
      good.config.VERSION,
      'accountinfo',
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      var grid = good.drive.person.Listperson.SEARCHGRID;
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

/**
 * @param {string} userId
 */
good.drive.person.Listperson.prototype.deletePerson = function(userId) {
  var that = this;
  var rpc = new good.net.CrossDomainRpc('POST',
      good.config.ACCOUNT,
      good.config.VERSION,
      'accountinfo' + userId,
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      alert('删除成功！');
      that.searchPerson();
    }
  });
};

/**
 * @param {string} userId
 */
good.drive.person.Listperson.prototype.editPerson = function(userId) {
  good.drive.person.Listperson.USERID = userId;
  var that = this;
  var rpc = new good.net.CrossDomainRpc('GET',
      good.config.ACCOUNT,
      good.config.VERSION,
      'accountinfo/' + userId,
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      that._dialog.setVisible(true);
      that._view.initDailog(json);
    }
  });
};

