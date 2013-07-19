'use strict';
goog.provide('good.drive.init');

goog.require('good.auth');
goog.require('good.config');
goog.require('good.drive.creation.fileupload');
goog.require('good.drive.creation.mouserevent');
goog.require('good.drive.nav.button.CustomView');
goog.require('good.drive.nav.button.LeftButton');
goog.require('good.drive.nav.button.MenuBarButton');
goog.require('good.drive.nav.button.MenuBarView');
goog.require('good.drive.nav.button.ToolBarButton');
goog.require('good.drive.nav.button.ToolBarView');
goog.require('good.drive.nav.dialog');
goog.require('good.drive.nav.folders');
goog.require('good.drive.nav.grid');
goog.require('good.drive.nav.menu');
goog.require('good.drive.nav.menu.popupmenu');
goog.require('good.drive.nav.userinfo');
goog.require('good.drive.search');
goog.require('goog.dom');

/**
 * @type {boolean}
 */
good.drive.init.IsLoad = false;

/** */
good.drive.init.start = function() {
  good.auth.check();
  if (good.drive.init.IsLoad) {
    good.drive.init.init();
  } else {
    good.drive.init.IsLoad = true;
  }
};

/** */
window.gdrOnLoad = good.drive.init.start;

/** */
good.drive.init.init = function() {
  var createInput;
  var modifeInput;
  var viewpanetoolbar = goog.dom.getElement('viewpane-toolbar');

  good.config.start();
  var auth = good.auth.Auth.current;
  good.realtime.authorize(auth.userId, auth.access_token);

  var advancedMenu = new good.drive.search.AdvancedMenu();

  var tree = new good.drive.nav.folders.Tree();
  tree.changeHandle(function(e) {
    tree.buildPath();
  });

  var leftButton = new good.drive.nav.button.LeftButton();
  var leftCreateBtn = leftButton.createBtn();
  var leftUpdateBtn = leftButton.updateBtn();

  var toolBarButton = new good.drive.nav.button.ToolBarButton();
  var toolBarCreate = toolBarButton.createTolBtn();
  var toolBarRename = toolBarButton.renameTolBtn();
  var toolBarDelete = toolBarButton.deleteTolBtn();

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
  var createPopup = menu.createPopup(leftCreateBtn.getElement(), function(e) {
    switch (goog.array.indexOf(
      createPopup.getChildIds(), e.target.getId())) {
        case 0:
          createdialog.setVisible(true);
          break;
        default:
          break;
    }
  });

//    var moverEvent = good.drive.creation.Mouserevent(
//        leftUpdateBtn.getElement());
  var menulst = new Array('文件...');
  var popupmenu = new good.drive.nav.menu.Popupmenu(menulst);
  var fileupload = new good.drive.creation.Fileupload();
  fileupload.fileChange(tree);
  popupmenu.createPopup(leftUpdateBtn.getElement(), function(e) {
    fileupload.fileClick();
  });

  var leftSubmenuChildIds = undefined;
  var leftSubmenu = menu.leftSubMenu(
    tree.roottree.getElement(), function(e) {
      if (leftSubmenuChildIds == undefined) {
        leftSubmenuChildIds = leftSubmenu.getChildIds();
      }
      switch (goog.array.indexOf(leftSubmenuChildIds, e.target.getId())) {
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
        case 6:
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
goog.exportSymbol('good.drive.init.start', good.drive.init.start);
