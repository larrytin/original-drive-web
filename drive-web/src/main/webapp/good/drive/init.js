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
goog.require('good.drive.nav.folders.Path');
goog.require('good.drive.nav.folders.PublicViewControl');
goog.require('good.drive.nav.grid');
goog.require('good.drive.nav.menu');
goog.require('good.drive.nav.menu.popupmenu');
goog.require('good.drive.nav.userinfo');
goog.require('good.drive.rightmenu');
goog.require('good.drive.resourcemap');
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
  var baseDocid = '@tmp/' + good.auth.Auth.current.userId + '/';
  good.constants.MYRESDOCID = baseDocid +
    good.constants.MYRESDOCID;
  good.constants.MYCLASSRESDOCID = baseDocid +
    good.constants.MYCLASSRESDOCID;
  good.constants.PATHDOCID = baseDocid +
    good.constants.PATHDOCID;

  good.config.start();
  var auth = good.auth.Auth.current;
  good.realtime.authorize(auth.userId, auth.access_token);
  
  var myclass = new good.drive.nav.folders.Tree('我的课程',
      good.constants.MYCLASSRESDOCID);
  var myResTree = new good.drive.nav.folders.Tree('我的收藏夹',
      good.constants.MYRESDOCID);
  var puclicViewControl = new good.drive.nav.folders.PublicViewControl(
      good.constants.PUBLICRESDOCID);
  var publicResTree = new good.drive.nav.folders.Tree('公共资料库',
      undefined, puclicViewControl);
  var pathControl = good.drive.nav.folders.Path.getINSTANCE();
  pathControl.addPath(good.constants.MYRESDOCID, myResTree);
  pathControl.addPath(good.constants.MYCLASSRESDOCID, myclass);
  pathControl.addPath(good.constants.PUBLICRESDOCID, publicResTree);
  pathControl.pathload = function() {
    good.drive.nav.grid.View.initGrid();
    good.drive.resourcemap.Resourcemap.init();
  };
  
  var advancedMenu = new good.drive.search.AdvancedMenu();
  advancedMenu.init();

  good.drive.nav.folders.AbstractControl.linkload();
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
    var docid = pathControl.currentDocId;
    var view = pathControl.getViewBydocId(docid);
    switch (evt.key) {
      case 'cr':
        view.addLeaf(createInput.value);
        break;
      case 'c':
        break;
      default:
        break;
    }
  });

  var modifydialog = dialog.modifyFolderDialog(function(evt) {
    var docid = pathControl.currentDocId;
    var view = pathControl.getViewBydocId(docid);
    switch (evt.key) {
      case 'cr':
        view.renameLeaf(modifeInput.value);
        break;
      case 'c':
        break;
      default:
        break;
    }
  });

  var menu = new good.drive.nav.menu.View();
  var createPopup = menu.createPopup(leftCreateBtn.getElement(), function(e) {
    var docid = pathControl.currentDocId;
    var view = pathControl.getViewBydocId(docid);
    switch (goog.array.indexOf(
      createPopup.getChildIds(), e.target.getId())) {
        case 0:
          view.setVisible(true);
          break;
        default:
          break;
    }
  });

//    var moverEvent = good.drive.creation.Mouserevent(
//        leftUpdateBtn.getElement());
  if (goog.userAgent.IE && goog.userAgent.VERSION < 10) {
    var menulst = '上传功能不支持IE10以下浏览器，建议选择Google Chrome浏览器。';
    menu.genPopupMenu(leftUpdateBtn.getElement(), [['i', menulst]], function(e) {
    });
  } else {
    var menulst = '文件...';
    var fileupload = new good.drive.creation.Fileupload();
    fileupload.fileChange();
    menu.genPopupMenu(leftUpdateBtn.getElement(), [['i', menulst]], function(e) {
      fileupload.fileClick('new', '');
    });
  }
  var leftSubmenuChildIds = undefined;
  var leftSubmenu = menu.leftSubMenu(myclass.tree.getChildrenElement(), function(e) {
      if (leftSubmenuChildIds == undefined) {
        leftSubmenuChildIds = leftSubmenu.getChildIds();
      }
      var docid = pathControl.currentDocId;
      var view = pathControl.getViewBydocId(docid);
      switch (goog.array.indexOf(leftSubmenuChildIds, e.target.getId())) {
        case 0:
          view.extended();
          break;
        case 2:
          createdialog.setVisible(true);
          break;
        case 3:
          modifydialog.setVisible(true);
          if (modifeInput == undefined) {
            modifeInput = goog.dom.getElement('modifyFolder');
          }
          modifeInput.value = view.getCurrentItem().title;
          break;
        case 6:
          view.removeLeaf();
          break;
        default:
          break;
      }
    });
  var bindPopup = false;
  var corner = {targetCorner: undefined,
      menuCorner: undefined, contextMenu: true};
  myclass.tree.getHandler().listen(
      myclass.tree, goog.ui.tree.BaseNode.EventType.EXPAND,
      function (e) {
        var target = e.target;
        if (bindPopup) {
          return;
        }
        if (target.title != undefined) {
          return;
        }
        bindPopup = true;
        var myClassNode = target.getChildAt(0);
        var type = [['i', '新建课程'], ['s', ''], ['i', '删除课程']];
        menu.genPopupMenu(myClassNode.getElement(), type, function(e) {
          alert('a');
        }, corner);
        var myFolderNode = target.getChildAt(1);
        menu.genPopupMenu(myFolderNode.getElement(), [['i', 'abc']], function(e) {
          alert('a');
        }, corner);
      });
  var menuBarButton = new good.drive.nav.button.MenuBarButton();
  var menuBarMore = menuBarButton.moreMenuBar(leftSubmenu);
  var settingBarMore = menuBarButton.settingMenuBar(leftSubmenu);
  var headuserinfo = new good.drive.nav.userinfo.Headuserinfo();
  var ceshi = new good.drive.rightmenu.Rightmenu();
};
goog.exportSymbol('good.drive.init.start', good.drive.init.start);
