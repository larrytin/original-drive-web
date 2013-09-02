'use strict';
goog.provide('good.drive.person.listperson');

goog.require('good.constants');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');

/**
 * 查询人员管理
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
    goog.style.showElement(
        grid.getElement());
  }

  var view = new good.drive.person.View(function() {
      view.insertOrUpdate(
          function(e) {
           good.drive.person.Listperson.SEARCHPERSON();
          });
    });
  this._view = view;
};

/** @type {good.drive.view.table.View} */
good.drive.person.Listperson.SEARCHGRID = undefined;

/** @type {string} */
good.drive.person.Listperson.USERID = undefined;

/**
 * 查询人员并Table显示
 */
good.drive.person.Listperson.SEARCHPERSON = function() {
  var rpc = new good.net.CrossDomainRpc('GET',
      good.config.ACCOUNT,
      good.config.VERSION,
      'accountinfo',
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    good.drive.person.Listperson.SEARCHGRID.clear();
    if (json && !json['error']) {
      var grid = good.drive.person.Listperson.SEARCHGRID;
      if (json['items'] != undefined) {
        goog.array.forEach(json['items'], function(item) {
          if (item['name'] != good.constants.ADMIN) {
            var cell = grid.createCell(item);
            cell.getValue = function(key) {
              return this.data[key];
            };
            grid.add(cell);
            cell.renderCell();
          }
        });
      }
      good.drive.view.baseview.View.visiable(grid);
    }
  });
};

/**
 * 根据人员Id删除人员信息
 * @param {string} userId
 */
good.drive.person.Listperson.prototype.deletePerson = function(userId) {
  var that = this;
  var rpc = new good.net.CrossDomainRpc('POST',
      good.config.ACCOUNT,
      good.config.VERSION,
      'accountinfo/' + userId,
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      alert('删除成功！');
      good.drive.person.Listperson.SEARCHPERSON();
    }
  });
};

/**
 * 删除多选的人员
 * @param {Array.<string>} userIds
 */
good.drive.person.Listperson.prototype.deletePersons = function(userIds) {
  if (userIds != null && userIds.length != 0) {
    goog.array.forEach(userIds, function(userId, index) {
      var rpc = new good.net.CrossDomainRpc('POST',
          good.config.ACCOUNT,
          good.config.VERSION,
          'accountinfo/' + userId,
          good.config.SERVERADRESS);
      rpc.send(function(json) {
        if (json && !json['error']) {
           if (index == (userIds.length - 1)) {
             alert('删除成功！');
             good.drive.person.Listperson.SEARCHPERSON();
           }
        }
      });
    });
  }
};

/**
 * 编辑人员
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
      good.drive.person.View.DIALOG.setTitle('编辑人员');
      that._view.initDailog(json);
    }
  });
};

