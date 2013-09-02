'use strict';
goog.provide('good.drive.person');

goog.require('good.constants');
goog.require('good.drive.nav.menu');
goog.require('good.drive.person.createdailog');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');

/**
 * 添加人员类
 * @constructor
 */
good.drive.person.AddPerson = function() {
  var personman = goog.dom.getElement('personman');
  this._personman = personman;
  this.rightmenu();
  var that = this;
  var view = new good.drive.person.View(function() {
       view.insertOrUpdate(function() {
         good.drive.person.Listperson.SEARCHPERSON();
      });
    });
  this._view = view;
  };

/**
 * 人员管理菜单绑定右键事件，实现新建人员功能
 */
good.drive.person.AddPerson.prototype.rightmenu = function() {
  var that = this;
  var menu = new good.drive.nav.menu.View();
  var type = [['i', '新建人员']];
  var corner = {targetCorner: undefined,
      menuCorner: undefined, contextMenu: true};
  var rightMenu = menu.genPopupMenu(that._personman, type, undefined, corner);
  goog.events.listen(rightMenu, 'action', function(e) {
    good.drive.person.View.DIALOG.setTitle('新建人员');
    good.drive.person.Listperson.USERID = undefined;
    that._view.initDailog();
  });
};
