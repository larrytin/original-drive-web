 'use strict';
goog.provide('good.drive.init');

goog.require('good.auth');
goog.require('good.config');
goog.require('good.drive.creation.fileupload');
goog.require('good.drive.creation.mouserevent');
goog.require('good.drive.device.listdevice');
goog.require('good.drive.flashcontrol');
goog.require('good.drive.nav.button.CustomView');
goog.require('good.drive.nav.button.LeftButton');
goog.require('good.drive.nav.button.MenuBarButton');
goog.require('good.drive.nav.button.MenuBarView');
goog.require('good.drive.nav.button.Settingmenu');
goog.require('good.drive.nav.button.ToggleButton');
goog.require('good.drive.nav.button.ToggleView');
goog.require('good.drive.nav.button.ToolBarButton');
goog.require('good.drive.nav.button.ToolBarView');
goog.require('good.drive.nav.button.rigthmenu');
goog.require('good.drive.nav.dialog');
goog.require('good.drive.nav.folders');
goog.require('good.drive.nav.folders.MyClassViewControl');
goog.require('good.drive.nav.folders.Path');
goog.require('good.drive.nav.folders.PublicViewControl');
goog.require('good.drive.nav.list');
goog.require('good.drive.nav.menu');
goog.require('good.drive.nav.menu.popupmenu');
goog.require('good.drive.nav.userinfo');
goog.require('good.drive.person');
goog.require('good.drive.person.listperson');
goog.require('good.drive.person.rigthmenu');
goog.require('good.drive.preview.previewcontrol');
goog.require('good.drive.resourcemap');
goog.require('good.drive.rightmenu');
goog.require('good.drive.rightmenu.detailinfo');
goog.require('good.drive.role');
goog.require('good.drive.search');
goog.require('good.drive.view.baseview');
goog.require('good.drive.view.grid');
goog.require('good.drive.view.table');
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

/**
 * @type {good.drive.nav.button.ToolBarView}
 */
good.drive.init.toolBarCreate;
/**
 * @type {good.drive.nav.button.ToolBarView}
 */
good.drive.init.toolBarRename;
/**
 * @type {good.drive.nav.button.ToolBarView}
 */
good.drive.init.toolBarDelete;
/**
 * @type {good.drive.nav.button.MenuBarView}
 */
good.drive.init.menuBarMore;
/**
 * @type {good.drive.nav.button.ToggleView}
 */
good.drive.init.gridBtn;
/**
 * @type {good.drive.nav.button.ToggleView}
 */
good.drive.init.listBtn;

/** */
good.drive.init.init = function() {
  var createInput;
  var modifeInput;
  var navFolderslist = goog.dom.getElement('navfolderslist');
  var viewpanetoolbar = goog.dom.getElement('viewpane-toolbar');
  var isGridEvent = false;
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
  good.drive.init.buildIndexurl();
  var myclassLabel = '我的课程';
  var myClassViewControl =
    new good.drive.nav.folders.MyClassViewControl(
        good.constants.MYCLASSRESDOCID);
  var myclass = new good.drive.nav.folders.Tree(myclassLabel,
      undefined, navFolderslist, myClassViewControl);
  myclass.setDraggable();
  var myResLabel = '我的收藏夹';
  var myResTree = new good.drive.nav.folders.Tree(myResLabel,
      good.constants.MYRESDOCID, navFolderslist);
  myResTree.setDraggable();
  var puclicViewControl = new good.drive.nav.folders.PublicViewControl(
      good.constants.PUBLICRESDOCID);
  var publicResTree = new good.drive.nav.folders.Tree('公共资料库',
      undefined, navFolderslist, puclicViewControl);
  var list = new good.drive.nav.list.View(good.constants.OTHERDOCID);
  var pathControl = good.drive.nav.folders.Path.getINSTANCE();
  pathControl.addPath(good.constants.MYRESDOCID, myResTree);
  pathControl.addPath(good.constants.MYCLASSRESDOCID,
      myclass);
  pathControl.addPath(good.constants.PUBLICRESDOCID,
      publicResTree);
  pathControl.addPath(good.constants.OTHERDOCID,
      list);
  pathControl.pathload = function() {
//    good.drive.view.baseview.View.initGrid();
    good.drive.init.initgrid();
    good.drive.resourcemap.Resourcemap.init();
  };
  good.drive.nav.folders.AbstractControl.linkload();
  var leftButton = new good.drive.nav.button.LeftButton();
  var leftCreateBtn = leftButton.createBtn();
  var dialog = new good.drive.nav.dialog.View();
  var createdialog = dialog.createFolderDialog(function(evt) {
    if (createInput == undefined) {
      createInput = goog.dom.getElement('crateFolder');
    }
    var docid = pathControl.currentDocId;
    var view = pathControl.getViewBydocId(docid);
    switch (evt.key) {
      case 'cr':
        if (createInput.value.indexOf(' ') != -1) {
          break;
        }
        if (createInput.value == "") {
          createInput.value = "新建文件夹";
        }
        if (docid == good.constants.PUBLICRESDOCID) {
          var model = view.getCurrentItem();
          var data = model.map;
          var query = data.get(good.constants.QUERY);
          var tags = query.get(good.constants.TAGS);
          var leaftags = new Array();
          goog.array.forEach(tags.asArray(), function(item) {
            leaftags.push(item);
          });
          leaftags.push(createInput.value);
          view.addLeaf({'label': createInput.value,
            'query': {'tags': leaftags}});
        } else {
          view.addLeaf({'label': createInput.value, 'isclass': false});
        }
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
        if (isGridEvent) {
          var grid = good.drive.view.baseview.View.currentGrid;
          grid.renameChildData(modifeInput.value);
        } else {
          view.renameLeaf(modifeInput.value);
        }
        break;
      case 'c':
        break;
      default:
        break;
    }
  });
  var moToClassTree = undefined;
  var moToresTree = undefined;
  var moToDialog = dialog.moveToDialog(myclassLabel, function(e) {
    switch (e.key) {
      case 'mv':
        var node = moToClassTree.getCurrentItem();
        if (node == moToClassTree.tree) {
          return;
        }
        var items = good.drive.view.baseview.View.currentGrid.
        getClickList();
        goog.array.forEach(items, function(item) {
          moToClassTree.moveToNode(item.data);
        });
        break;
      case 'c':
        break;
    }
  });
  var faToDialog = dialog.favoritesToDialog(myResLabel, function(e) {
    switch (e.key) {
      case 'fv':
        var node = moToresTree.getCurrentItem();
        if (node == moToresTree.tree) {
          return;
        }
        var items = good.drive.view.baseview.View.currentGrid.
        getClickList();
        goog.array.forEach(items, function(item) {
          moToresTree.moveToNode(item.data);
        });
        break;
      case 'c':
        break;
    }
  });
  var advancedMenu = new good.drive.search.AdvancedMenu();
  advancedMenu.init();
  var rightmenu = new good.drive.search.
  Rightmenu(goog.dom.getElement('viewmanager'));
  var rightMenuHandle = function(e) {
    var caption = e.target.getCaption();
    var grid = good.drive.view.baseview.View.currentGrid;
    switch (caption) {
      case '资源安排至':
        moToDialog.setVisible(true);
        if (moToClassTree == undefined) {
          var data = myclass.control().model().getData();
          moToClassTree = new good.drive.nav.folders.Tree(data.get('label'),
              good.constants.MYCLASSRESDOCID,
              goog.dom.getElement('moveTo'));
          moToClassTree.setData(data);
        }
        break;
      case '收藏':
        faToDialog.setVisible(true);
        if (moToresTree == undefined) {
          var data = myResTree.control().model().getData();
          moToresTree = new good.drive.nav.folders.Tree(data.get('label'),
              good.constants.MYRESDOCID,
              goog.dom.getElement('favoritesTo'));
          moToresTree.setData(data);
        }
        break;
      case '打开':
        var cell = grid.getSelectedItem();
        cell.openCell();
        break;
      case '重命名':
        isGridEvent = true;
        modifydialog.setVisible(true);
        if (modifeInput == undefined) {
          modifeInput = goog.dom.getElement('modifyFolder');
        }
        modifeInput.value = grid.getCurrentTitle();
        break;
      case '删除':
        var path = good.drive.nav.folders.Path.getINSTANCE();
        var docId = path.getCurrentDocid();
        if (docId == good.constants.OTHERDOCID) {
          break;
        }
        grid.removeCurrentData();
        break;
      default:
        break;
    }
  };
  goog.events.listen(rightmenu.getRightMenu(), 'action', rightMenuHandle);
  var detailinfo = new good.drive.rightmenu.
  DetailInfo(function() {
    advancedMenu.search('click');
  });
  var menu = new good.drive.nav.menu.View();  
  var leftSubmenuChildIds = undefined;
  var leftSubmenu = menu.leftSubMenu(myResTree.tree.getChildrenElement(),
      function(e) {
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
          isGridEvent = false;
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
  var newClassInput = undefined;
  var newClassDialog = dialog.genDialog('新建课程', function(evt) {
    if (newClassInput == undefined) {
      newClassInput = goog.dom.getElement('newclassdialog');
    }
    var docid = pathControl.currentDocId;
    var view = pathControl.getViewBydocId(docid);
    switch (evt.key) {
      case 'cr':
        view.addLeaf({'label': newClassInput.value, 'isclass': true});
        break;
      case 'c':
        break;
      default:
        break;
    }
  }, 'newclassdialog');
  var createPopup = menu.createPopup(leftCreateBtn.getElement(),
      function(e) {
    var docid = pathControl.currentDocId;
    var view = pathControl.getViewBydocId(docid);
    switch (goog.array.indexOf(
      createPopup.getChildIds(), e.target.getId())) {
        case 0:
          createdialog.setVisible(true);
          break;
        case 1:
          newClassDialog.setVisible(true);
          break;
        default:
          break;
    }
  });
  createPopup.getHandler().listen(createPopup,
      goog.ui.Menu.EventType.BEFORE_SHOW,
      function(e) {
    var docid = pathControl.getCurrentDocid();
    var view = pathControl.getViewBydocId(docid);
    var node = view.getCurrentItem();
    switch (docid) {
    case good.constants.MYCLASSRESDOCID:
      if (node.map.get('isclass')) {
        menu.hideItem(createPopup, [0, 1]);
        return;
      }
      menu.hideItem(createPopup, []);
      break;
    case good.constants.MYRESDOCID:
      menu.hideItem(createPopup, [1]);
      break;
    case good.constants.PUBLICRESDOCID:
      menu.hideItem(createPopup, [1]);
      break;
    }
  });
  var bindPopup = false;
  var corner = {targetCorner: undefined,
      menuCorner: undefined, contextMenu: true};
  var submenu = new goog.ui.SubMenu('发送');
  var type = [['i', '新建课程'], ['i', '新建文件夹'], ['i', '修改'], ['s', ''],
              ['i', '删除'], ['m', submenu]];
  var myClassMenuChildIds = undefined;
  var myClassMenu = menu.genPopupMenu(
      myclass.tree.getChildrenElement(), type, function(e) {
        if (myClassMenuChildIds == undefined) {
          myClassMenuChildIds = myClassMenu.getChildIds();
        }
        var docid = pathControl.currentDocId;
        var view = pathControl.getViewBydocId(docid);
        switch (goog.array.indexOf(myClassMenuChildIds, e.target.getId())) {
        case 0:
          newClassDialog.setVisible(true);
          break;
        case 1:
          createdialog.setVisible(true);
          break;
        case 2:
          isGridEvent = false;
          modifydialog.setVisible(true);
          if (modifeInput == undefined) {
            modifeInput = goog.dom.getElement('modifyFolder');
          }
          modifeInput.value = view.getCurrentItem().title;
          break;
        case 4:
          view.removeLeaf();
          break;
        default:
          var subdata = good.drive.search.Rightmenu.SUBMENUDATA;
          var deviceId = undefined;
          var action = e.target.getCaption();
          goog.array.forEach(subdata, function(item) {
            if (item.name == action) {
              deviceId = item.id;
              var files = view.getCurrentItem().map.get('files');
              if (files.length() == 0) {
                return;
              }
              for (var i = 0; i < files.length(); i++) {
                var file = files.get(i);
                rightmenu.sendDevice(file.get('id'), deviceId);
              }
              return;
            }
          });
          break;
      }
  }, corner);
  var initSubMenu = false;
  myClassMenu.getHandler().listen(myClassMenu,
      goog.ui.Menu.EventType.BEFORE_SHOW,
      function(e) {
    var submenu = e.target.getChildAt(5);
    var subdata = good.drive.search.Rightmenu.SUBMENUDATA;
    if (subdata != undefined) {
      if (!initSubMenu) {
        initSubMenu = true;
        goog.array.forEach(subdata, function(data) {
          submenu.addItem(new goog.ui.MenuItem(data.name));
        });
      }
    }
    var data = good.drive.nav.folders.Path.INSTANCE.getCurrentData();
    var target = e.target;
    var isClass = data.get('isclass');
    if (isClass == undefined) {
      return;
    }
    var item1 = target.getItemAt(0);
    var item2 = target.getItemAt(1);
    if (isClass) {
      item1.setEnabled(false);
      item2.setEnabled(false);
      submenu.setEnabled(true);
      return;
    }
    item1.setEnabled(true);
    item2.setEnabled(true);
    submenu.setEnabled(false);
  });

  var submenu = new goog.ui.SubMenu('发送');
  var type = [['i', '新建文件夹..'], ['i', '重命名'], ['i', '详细信息'],
               ['s', ''], ['i', '删除']];
  var publicResMenuChildIds = undefined;
  var publicResMenu = menu.genPopupMenu(
      publicResTree.tree.getChildrenElement(), type, function(e) {
        if (publicResMenuChildIds == undefined) {
          publicResMenuChildIds = publicResMenu.getChildIds();
        }
        var docid = pathControl.currentDocId;
        var view = pathControl.getViewBydocId(docid);
        switch (goog.array.indexOf(publicResMenuChildIds, e.target.getId())) {
        case 0:
          /*var model = view.getCurrentItem();
          var data = model.map;
          var query = data.get(good.constants.QUERY);
          var tags = query.get(good.constants.TAGS);
          tags.push(createInput.value);
          view.addLeaf({'label': createInput.value, 'query': {'tags': tags}});*/
          createdialog.setVisible(true);
          break;
        case 1:
          isGridEvent = false;
          modifydialog.setVisible(true);
          if (modifeInput == undefined) {
            modifeInput = goog.dom.getElement('modifyFolder');
          }
          modifeInput.value = view.getCurrentItem().title;
          break;
        case 2:
          var model = view.getCurrentItem();
          var data = model.map;
          var label = data.get(good.constants.LABEL);
          var query = data.get(good.constants.QUERY);
          var tags = query.get(good.constants.TAGS);
          var contentType = query.get('contentType');
          good.drive.rightmenu.DetailInfo.TYPEFLAG = 'public';
          good.drive.rightmenu.DetailInfo.PUBLICDETAIL(label,
              tags, contentType);
          break;
        case 4:
          view.removeLeaf();
          break;
        default:
          break;
      }
  }, corner);

  var toolBarButton = new good.drive.nav.button.ToolBarButton();
  good.drive.init.toolBarCreate = toolBarButton.createTolBtn();
  goog.events.listen(good.drive.init.toolBarCreate.getButton(),
      goog.ui.Component.EventType.ACTION, function(e) {
    var docid = pathControl.getCurrentDocid();
    var view = pathControl.getViewBydocId(docid);
    var item = view.getCurrentItem();
    if (item.map.get('isclass') == undefined || !item.map.get('isclass')) {
      createdialog.setVisible(true);
    }
  });
  good.drive.init.toolBarRename = toolBarButton.renameTolBtn();
  goog.events.listen(good.drive.init.toolBarRename.getButton(),
      goog.ui.Component.EventType.ACTION, function(e) {
    moToDialog.setVisible(true);
    if (moToClassTree == undefined) {
      var data = myclass.control().model().getData();
      moToClassTree = new good.drive.nav.folders.Tree(data.get('label'),
          good.constants.MYCLASSRESDOCID,
          goog.dom.getElement('moveTo'));
      moToClassTree.setData(data);
    }
  });
  var toolbarSettingMenu = new good.drive.nav.button.rigthmenu();
  good.drive.init.toolBarDelete = toolBarButton.deleteTolBtn();
  goog.events.listen(good.drive.init.toolBarDelete.getButton(),
      goog.ui.Component.EventType.ACTION, function(e) {
    var path = good.drive.nav.folders.Path.getINSTANCE();
    var docId = path.getCurrentDocid();
    var grid = good.drive.view.baseview.View.currentGrid;
    if (docId == good.constants.OTHERDOCID) {
      var cell = grid.getSelectedItem();
      toolbarSettingMenu.deletePersonOrdevice(cell.data, 'delete');
      return;
    }
    grid.removeCurrentData();
  });
  var toggleButton = new good.drive.nav.button.ToggleButton();
  good.drive.init.listBtn = toggleButton.createListBtn();
  good.drive.init.gridBtn = toggleButton.createGridBtn();
  goog.events.listen(good.drive.init.listBtn.getButton(),
      goog.ui.Component.EventType.ACTION, function(e) {
    good.drive.init.listBtn.getButton().setChecked(true);
    good.drive.init.gridBtn.getButton().setChecked(false);
    good.drive.view.baseview.View.isGrid = false;
    var docid = good.drive.nav.folders.Path.getINSTANCE().getCurrentDocid();
    if (docid == good.constants.PUBLICRESDOCID) {
      advancedMenu.search('click');
    } else {
      good.drive.init.initCallback(
          good.drive.nav.folders.Path.getINSTANCE().path);
    }
  });
  good.drive.init.gridBtn.getButton().setChecked(true);
  goog.events.listen(good.drive.init.gridBtn.getButton(),
      goog.ui.Component.EventType.ACTION, function(e) {
    good.drive.init.gridBtn.getButton().setChecked(true);
    good.drive.init.listBtn.getButton().setChecked(false);
    good.drive.view.baseview.View.isGrid = true;
    var docid = good.drive.nav.folders.Path.getINSTANCE().getCurrentDocid();
    if (docid == good.constants.PUBLICRESDOCID) {
      advancedMenu.search('click');
    } else {
      good.drive.init.initCallback(
          good.drive.nav.folders.Path.getINSTANCE().path);
    }
  });
  var menuBarButton = new good.drive.nav.button.MenuBarButton();
  good.drive.init.menuBarMore = menuBarButton.moreMenuBar(
      toolbarSettingMenu.getRightMenu());
  goog.events.listen(good.drive.init.menuBarMore.getButton(),
      goog.ui.Component.EventType.ACTION, function(e) {
    toolbarSettingMenu.onSelectedHandle(e);
  });
  goog.events.listen(good.drive.init.menuBarMore.getButton(),
      goog.ui.Component.EventType.ACTION, rightMenuHandle);
  goog.events.listen(good.drive.init.menuBarMore.getButton(),
      'enter', function(e) {
    if (e.target != good.drive.init.menuBarMore.getButton()) {
      return;
    }
    toolbarSettingMenu.hideMenuItem(e);
  });
  var settingDialog = new goog.ui.Dialog(null, true);
  settingDialog.setContent('版本1.0');
  settingDialog.setButtonSet(dialog.genButtonSet([ {
    key : 'cr',
    caption : '确定'
  }, {
    key : 'c',
    caption : '取消'
  } ]));
  var settingMenu = new good.drive.nav.button.Settingmenu();
  var settingBarMore = menuBarButton.settingMenuBar(settingMenu.getRightMenu());
  goog.events.listen(settingBarMore.getButton(),
      goog.ui.Component.EventType.ACTION, function(e) {
    switch (e.target.getCaption()) {
    case '关于科睿星':
      settingDialog.setVisible(true);
      break;
    default:
      break;
    }
  });
  var headuserinfo = new good.drive.nav.userinfo.Headuserinfo();
  var role = new good.drive.role.Role(auth.userId,
      function(username) {
    if (username == good.constants.ADMIN) {
      var navpanelist = goog.dom.getElement('navpanelist');
      navpanelist.style.display = '';
      var addperson = new good.drive.person.AddPerson();
      var listperson = new good.drive.person.Listperson();
      var listdevice = new good.drive.device.Listdevice();
      var userMenu = new good.drive.person.rigthmenu.Menu(
          goog.dom.getElement('tableviewmanager'));
      var leftUpdateBtn = leftButton.updateBtn();
//    var moverEvent = good.drive.creation.Mouserevent(
//        leftUpdateBtn.getElement());
      if (goog.userAgent.IE && goog.userAgent.VERSION < 10) {
        var menulst = '上传功能不支持IE10以下浏览器，建议选择Google Chrome浏览器。';
        menu.genPopupMenu(leftUpdateBtn.getElement(),
            [['i', menulst]], function(e) {
        });
      } else {
        var menulst = '文件...';
        var fileupload = new good.drive.creation.Fileupload();
        fileupload.fileChange();
        menu.genPopupMenu(leftUpdateBtn.getElement(),
            [['i', menulst]], function(e) {
          fileupload.fileClick('new', '');
        });
      }
    } else {
      var navpanelist = goog.dom.getElement('navpanelist');
      navpanelist.style.display = 'none';
    };
  });
  var control = new good.drive.flashcontrol.Control();
  good.drive.init.toolBarRename.setVisible(false);
  good.drive.init.toolBarCreate.setVisible(false);
  good.drive.init.toolBarDelete.setVisible(false);
  good.drive.init.menuBarMore.setVisible(false);
  var preview = new good.drive.preview.Control();
  preview.init();
};

/**
 */
good.drive.init.initgrid = function() {
  var root = good.drive.nav.folders.Path.getINSTANCE().root;
  root.addValueChangedListener(function(evt) {
    var property = evt.getProperty();
    var newValue = evt.getNewValue();
    if (property == good.drive.nav.folders.Path.NameType.PATH) {
      good.drive.init.initCallback(newValue);
      return;
    }
    if (property == good.drive.nav.folders.Path.NameType.SELECT) {
      good.drive.init.visiabletoolbar(newValue);
      return;
    }
  });
  good.drive.init.initCallback(
      good.drive.nav.folders.Path.getINSTANCE().path);
};

/**
 * @param {Object} path
 */
good.drive.init.initCallback = function(path) {
  var pathlist = path[good.drive.nav.folders.Path.NameType.CURRENTPATH];
  if (goog.array.isEmpty(pathlist)) {
    return;
  }
  var id = pathlist[pathlist.length - 1];
  var docid = path[good.drive.nav.folders.Path.NameType.CURRENTDOCID];
  switch (docid) {
    case good.constants.MYCLASSRESDOCID:
      good.drive.init.toolBarCreate.setVisible(true);
      good.drive.init.gridBtn.setVisible(true);
      good.drive.init.listBtn.setVisible(true);
      break;
    case good.constants.MYRESDOCID:
      good.drive.init.toolBarCreate.setVisible(true);
      good.drive.init.gridBtn.setVisible(true);
      good.drive.init.listBtn.setVisible(true);
      break;
    case good.constants.PUBLICRESDOCID:
      good.drive.init.toolBarCreate.setVisible(true);
      good.drive.init.gridBtn.setVisible(true);
      good.drive.init.listBtn.setVisible(true);
      break;
    default:
      good.drive.init.toolBarCreate.setVisible(false);
      good.drive.init.gridBtn.setVisible(false);
      good.drive.init.listBtn.setVisible(false);
      break;
  }
  if (docid == good.constants.PUBLICRESDOCID ||
      docid == good.constants.OTHERDOCID) {
    return;
  }
  var grids = good.drive.view.baseview.View.isGrid ?
      good.drive.view.baseview.View.grids :
      good.drive.view.baseview.View.lists;
  good.drive.init.callListOrGrid(grids, docid, id);
};

/**
 * @param {Object} grids
 * @param {string} docid
 * @param {string} id
 */
good.drive.init.callListOrGrid = function(grids, docid, id) {
  if (!goog.object.containsKey(grids, docid)) {
    var cells = {};
    goog.object.add(grids, docid, cells);
  }
  var cells = goog.object.get(grids, docid);
  if (goog.object.containsKey(cells, id)) {
    good.drive.view.baseview.View.visiable(goog.object.get(cells, id));
    return;
  }
  var model = goog.object.get(
      good.drive.nav.folders.AbstractControl.docs, docid);
  var data = model.getObject(id);
  var grid = new good.drive.view.grid.View(data, docid);
  if (good.drive.view.baseview.View.isGrid) {
    grid = new good.drive.view.grid.View(data, docid);
  } else {
  var grid = new good.drive.view.table.View(
      {'select': 'select', 'label': '名字'}, data, docid);
  }
  grid.render(goog.dom.getElement('viewmanager'));
  grid.renderCell(data);
  grid.renderFolderPath();
  goog.object.add(cells, id, grid);
  good.drive.view.baseview.View.visiable(grid);
};

/**
 * @param {Object} selected
 */
good.drive.init.visiabletoolbar = function(selected) {
  var pathControl = good.drive.nav.folders.Path.getINSTANCE();
  var root = pathControl.root;
  var isSelected = root.get(good.drive.nav.folders.Path.NameType.SELECT);
  if (!isSelected) {
    good.drive.init.toolBarRename.setVisible(false);
    good.drive.init.toolBarDelete.setVisible(false);
    good.drive.init.menuBarMore.setVisible(false);
    return;
  }
  var docid = pathControl.getCurrentDocid();
  switch (docid) {
    case good.constants.MYCLASSRESDOCID:
    case good.constants.MYRESDOCID:
      good.drive.init.toolBarDelete.setVisible(true);
      good.drive.init.menuBarMore.setVisible(true);
      break;
    case good.constants.PUBLICRESDOCID:
      good.drive.init.toolBarRename.setVisible(true);
      good.drive.init.menuBarMore.setVisible(true);
      break;
    case good.constants.OTHERDOCID:
      good.drive.init.toolBarDelete.setVisible(true);
      good.drive.init.menuBarMore.setVisible(true);
      break;
    default:
      break;
  }
};

/**
 */
good.drive.init.buildIndexurl = function() {
  var els = goog.dom.getElementsByClass('gbqla');
  goog.array.forEach(els, function(el) {
    el.href = location.href;
  });
};

goog.exportSymbol('good.drive.init.start', good.drive.init.start);
