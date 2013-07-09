'use strict';
goog.provide('good.drive.init');

goog.require('good.auth');
goog.require('good.config');
goog.require('good.drive.nav.button.CustomView');
goog.require('good.drive.nav.button.LeftButton');
goog.require('good.drive.nav.button.MenuBarButton');
goog.require('good.drive.nav.button.MenuBarView');
goog.require('good.drive.nav.button.ToolBarButton');
goog.require('good.drive.nav.button.ToolBarView');
goog.require('good.drive.nav.dialog');
goog.require('good.drive.nav.folders');
goog.require('good.drive.nav.menu');
goog.require('good.drive.nav.menu.popupmenu');
goog.require('good.drive.nav.userinfo');
goog.require('goog.dom');


/** */
good.drive.init.start = function() {
  good.auth.check();
  window.gdrOnLoad = function() {
    var createInput;
    var modifeInput;
    var viewpanetoolbar = goog.dom.getElement('viewpane-toolbar');

    good.config.start();
    var auth = good.auth.Auth.current;
    good.realtime.authorize(auth.userId, auth.access_token);

    var tree = new good.drive.nav.folders.Tree();

    var leftButton = new good.drive.nav.button.LeftButton();
    var leftCreateBtn = leftButton.createBtn();
    var leftUpdateBtn = leftButton.updateBtn();

    var toolBarButton = new good.drive.nav.button.ToolBarButton();
    var toolBarCreate = toolBarButton.createTolBtn();
    var toolBarDelete = toolBarButton.deleteTolBtn();
    var toolBarRename = toolBarButton.renameTolBtn();

    var dialog = new good.drive.nav.dialog.View();
    var createdialog = dialog.createFolderDialog(function(evt) {
      if (createInput == undefined) {
        createInput = goog.dom.getElement('crateFolder');
      }
      switch (evt.key) {
        case 'cr':
          tree.addLeaf(createInput.value);
          break;
        case 'c':
          break;
        default:
          break;
      }
    });

    var modifydialog = dialog.modifyFolderDialog(function(evt) {
      switch (evt.key) {
        case 'cr':
          tree.renameLeaf(modifeInput.value);
          break;
        case 'c':
          break;
        default:
          break;
      }
    });

    var menu = new good.drive.nav.menu.View();
    menu.createPopup(leftCreateBtn.getElement(), function(e) {
      switch (e.target.getId()) {
        case ':2':
          createdialog.setVisible(true);
          break;
        default:
          break;
      }
    });

    var menulst = new Array('文件...', '文件夹...');
    var popupmenu = new good.drive.nav.menu.Popupmenu(menulst);
    popupmenu.createPopup(leftUpdateBtn.getElement(), function(e) {
      alert('ss');
    });

    var leftSubmenuChildIds = undefined;
    var leftSubmenu = menu.leftSubMenu(tree.tree.getElement(), function(e) {
      if (leftSubmenuChildIds == undefined) {
        leftSubmenuChildIds = leftSubmenu.getChildIds();
      }
      switch (leftSubmenuChildIds.indexOf(e.target.getId())) {
        case 0:
          tree.extended();
          break;
        case 2:
          createdialog.setVisible(true);
          break;
        case 3:
          modifydialog.setVisible(true);
          if (modifeInput == undefined) {
            modifeInput = goog.dom.getElement('modifyFolder');
          }
          modifeInput.value = tree.getCurrentItem().title;
          break;
        case 4:
          tree.removeLeaf();
          break;
        default:
          break;
      }
    });
    var menuBarButton = new good.drive.nav.button.MenuBarButton();
    var menuBarMore = menuBarButton.moreMenuBar(leftSubmenu);
    var settingBarMore = menuBarButton.settingMenuBar(leftSubmenu);

    var headuserinfo = new good.drive.nav.userinfo.Headuserinfo();
  };
};

goog.exportSymbol('good.drive.init.start', good.drive.init.start);
