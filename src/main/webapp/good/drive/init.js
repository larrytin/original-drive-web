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
  var isInitCreate = false;
  var createInput;
  var modifeInput;
  var navFolderslist = goog.dom.getElement('navfolderslist');
  var viewpanetoolbar = goog.dom.getElement('viewpane-toolbar');
  var isGridEvent = false;
  //这里给docid添加了用户的标识符  以保证他们的唯一性
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
  //初始化Tree
  var myclassLabel = '我的课程';
  var myClassViewControl =
    new good.drive.nav.folders.MyClassViewControl(
        good.constants.MYCLASSRESDOCID);
  var myclass = new good.drive.nav.folders.Tree(myclassLabel,
      undefined, navFolderslist, myClassViewControl);
//  myclass.setDraggable();
  var myResLabel = '我的收藏夹';
  var myResTree = new good.drive.nav.folders.Tree(myResLabel,
      good.constants.MYRESDOCID, navFolderslist);
//  myResTree.setDraggable();
  var puclicViewControl = new good.drive.nav.folders.PublicViewControl(
      good.constants.PUBLICRESDOCID);
  var publicResTree = new good.drive.nav.folders.Tree('公共资料库',
      undefined, navFolderslist, puclicViewControl);
  var list = new good.drive.nav.list.View(good.constants.OTHERDOCID);
  //初始化Path
  var pathControl = good.drive.nav.folders.Path.getINSTANCE();
  //进行docid和View的映射
  pathControl.addPath(good.constants.MYRESDOCID, myResTree);
  pathControl.addPath(good.constants.MYCLASSRESDOCID,
      myclass);
  pathControl.addPath(good.constants.PUBLICRESDOCID,
      publicResTree);
  pathControl.addPath(good.constants.OTHERDOCID,
      list);
  //path加载完成时的回调
  pathControl.pathload = function() {
//    good.drive.view.baseview.View.initGrid();
    good.drive.init.initgrid();
    good.drive.resourcemap.Resourcemap.init();
  };
  //开始有序的加载doc
  good.drive.nav.folders.AbstractControl.linkload();
  //创建一个左边按钮的获取类
  var leftButton = new good.drive.nav.button.LeftButton();
  //创建按钮
  var leftCreateBtn = leftButton.createBtn();
  //创建一个dialog获取类
  var dialog = new good.drive.nav.dialog.View();
  //获取创建按钮的弹出框 并且添加事件
  var createdialog = dialog.createFolderDialog(function(evt) {
    if (!isInitCreate) {
      return;
    }
    isInitCreate = false;
    //确保createInput只创建一次
    if (createInput == undefined) {
      createInput = goog.dom.getElement('crateFolder');
    }
    var docid = pathControl.currentDocId;
    //通过docid获取View
    var view = pathControl.getViewBydocId(docid);
    switch (evt.key) {
      case 'cr':
        //创建文件夹
        if (createInput.value.indexOf(' ') != -1) {
          break;
        }
        if (createInput.value == '') {
          createInput.value = '新建文件夹';
        }
        //对于公共资料库和我的课程有不同的文件夹数据结构 需要特殊判断
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
  //修改的弹出框
  var modifydialog = dialog.modifyFolderDialog(function(evt) {
    var docid = pathControl.currentDocId;
    var view = pathControl.getViewBydocId(docid);
    switch (evt.key) {
      case 'cr':
        //修改的逻辑
        if (modifeInput.value[0] != ' ') {
          if (modifeInput.value != '') {
            if (isGridEvent) {
              var grid = good.drive.view.baseview.View.currentGrid;
              grid.renameChildData(modifeInput.value);
            } else {
              view.renameLeaf(modifeInput.value);
            }
          }
        }
        break;
      case 'c':
        break;
      default:
        break;
    }
  });
  //申明安排课程和资源添加到
  var moToClassTree = undefined;
  var moToresTree = undefined;
  //获取安排课程的弹出框
  var moToDialog = dialog.moveToDialog(myclassLabel, function(e) {
    switch (e.key) {
      case 'mv':
        //先确定当前选中的节点非根节点
        var node = moToClassTree.getCurrentItem();
        if (node == moToClassTree.tree) {
          return;
        }
        //获取当前选中的所有Cell
        var items = good.drive.view.baseview.View.currentGrid.
        getClickList();
        goog.array.forEach(items, function(item) {
          //安排课程
          moToClassTree.moveToNode(item.data);
        });
        break;
      case 'c':
        break;
    }
  });
  //收藏资源的弹出框
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
  //右键菜单的部分逻辑 具体看caption
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
  //把这个事件添加到右键菜单
  goog.events.listen(rightmenu.getRightMenu(), 'action', rightMenuHandle);
  var detailinfo = new good.drive.rightmenu.
  DetailInfo(function() {
    advancedMenu.search('click');
  });
  //构造一个Menu的获取类
  var menu = new good.drive.nav.menu.View();
  var leftSubmenuChildIds = undefined;
  //获取一个我的资料库的右键菜单
  var leftSubmenu = menu.leftSubMenu(myResTree.tree.getChildrenElement(),
      function(e) {
      if (leftSubmenuChildIds == undefined) {
        leftSubmenuChildIds = leftSubmenu.getChildIds();
      }
      var docid = pathControl.currentDocId;
      var view = pathControl.getViewBydocId(docid);
      //通过索引来判断当前点击的Item
      switch (goog.array.indexOf(leftSubmenuChildIds, e.target.getId())) {
        case 0:
          view.extended();
          break;
        case 2:
          createdialog.setVisible(true);
          isInitCreate = true;
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
  //获取新建课程的弹出框 并添加点击事件
  var newClassDialog = dialog.genDialog('新建课程', function(evt) {
    if (newClassInput == undefined) {
      newClassInput = goog.dom.getElement('newclassdialog');
    }
    var docid = pathControl.currentDocId;
    var view = pathControl.getViewBydocId(docid);
    switch (evt.key) {
      case 'cr':
        if (newClassInput.value[0] != '') {
          if (newClassInput.value != '') {
            view.addLeaf({'label': newClassInput.value, 'isclass': true});
            break;
          }
        }
        var classInput = '新建课程';
        view.addLeaf({'label': classInput, 'isclass': true});
        break;
      case 'c':
        break;
      default:
        break;
    }
  }, 'newclassdialog');
  //这里是创建按钮点击之后的弹出框
  var createPopup = menu.createPopup(leftCreateBtn.getElement(),
      function(e) {
    var docid = pathControl.currentDocId;
    var view = pathControl.getViewBydocId(docid);
    switch (goog.array.indexOf(
      createPopup.getChildIds(), e.target.getId())) {
        case 0:
          //这个表示点击了新建文件夹
          createdialog.setVisible(true);
          isInitCreate = true;
          break;
        case 1:
          //这个表示新建课程
          newClassDialog.setVisible(true);
          break;
        default:
          break;
    }
  });
  //控制创建按钮弹出框弹出后的显示内容
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
      if (good.drive.role.Role.USERNAME != good.constants.ADMIN) {
        menu.hideItem(createPopup, [0, 1]);
      } else {
        menu.hideItem(createPopup, [1]);
      }
      break;
    }
  });
  var bindPopup = false;
  //创建我的课程的右键弹出菜单
  var corner = {targetCorner: undefined,
      menuCorner: undefined, contextMenu: true};
  var submenu = new goog.ui.SubMenu('发送');
  var type = [['i', '新建课程'], ['i', '新建文件夹'], ['i', '重命名'], ['s', ''],
              ['i', '删除'], ['m', submenu]];
  var myClassMenuChildIds = undefined;
  //通过上面提供的来构建弹出菜单
  var myClassMenu = menu.genPopupMenu(
      myclass.tree.getChildrenElement(), type, function(e) {
        if (myClassMenuChildIds == undefined) {
          myClassMenuChildIds = myClassMenu.getChildIds();
        }
        var docid = pathControl.currentDocId;
        var view = pathControl.getViewBydocId(docid);
        //根据索引来判断点击的选项
        switch (goog.array.indexOf(myClassMenuChildIds, e.target.getId())) {
        case 0:
          newClassDialog.setVisible(true);
          break;
        case 1:
          createdialog.setVisible(true);
          isInitCreate = true;
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
          //如果不包括上面几种  就表示当前选中的是发送到里面的选项
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
  //我的课程右键菜单弹出的展现项
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
  //构建一个toolbarButton的构造类
  var toolBarButton = new good.drive.nav.button.ToolBarButton();
  //获取工具栏的创建按钮 并添加事件
  good.drive.init.toolBarCreate = toolBarButton.createTolBtn();
  goog.events.listen(good.drive.init.toolBarCreate.getButton(),
      goog.ui.Component.EventType.ACTION, function(e) {
    var docid = pathControl.getCurrentDocid();
    var view = pathControl.getViewBydocId(docid);
    var item = view.getCurrentItem();
    if (item.map.get('isclass') == undefined || !item.map.get('isclass')) {
      //直接调用创建文件夹的弹出框
      createdialog.setVisible(true);
      isInitCreate = true;
    }
  });
  //获取工具栏上的重命名按钮
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
  //获取工具的一些回调操作
  var toolbarSettingMenu = new good.drive.nav.button.rigthmenu();
  //获取工具栏上删除按钮
  good.drive.init.toolBarDelete = toolBarButton.deleteTolBtn();
  goog.events.listen(good.drive.init.toolBarDelete.getButton(),
      goog.ui.Component.EventType.ACTION, function(e) {
    var path = good.drive.nav.folders.Path.getINSTANCE();
    var docId = path.getCurrentDocid();
    var grid = good.drive.view.baseview.View.currentGrid;
    if (docId == good.constants.OTHERDOCID) {
      var cell = grid.getSelectedItem();
      //如果是点击人员管理或者设备管理的删除 就调用这个方法
      toolbarSettingMenu.deletePersonOrdevice(cell.data, 'delete');
      return;
    }
    grid.removeCurrentData();
  });
  //获取一个切换列表和网格的构造类
  var toggleButton = new good.drive.nav.button.ToggleButton();
  //获取列表按钮
  good.drive.init.listBtn = toggleButton.createListBtn();
  //获取网格按钮
  good.drive.init.gridBtn = toggleButton.createGridBtn();
  //添加列表按钮的事件
  goog.events.listen(good.drive.init.listBtn.getButton(),
      goog.ui.Component.EventType.ACTION, function(e) {
    //设置选中状态
    good.drive.init.listBtn.getButton().setChecked(true);
    good.drive.init.gridBtn.getButton().setChecked(false);
    //设置一个全局状态来告诉所有需要用到GridView的类目前的类型
    good.drive.view.baseview.View.isGrid = false;
    var docid = good.drive.nav.folders.Path.getINSTANCE().getCurrentDocid();
    //如果是公共资料库 通过另外一种方式展现ListView
    if (docid == good.constants.PUBLICRESDOCID) {
      advancedMenu.search('click');
    } else {
      good.drive.init.initCallback(
          good.drive.nav.folders.Path.getINSTANCE().path);
    }
  });
  //默认是GridView
  good.drive.init.gridBtn.getButton().setChecked(true);
  //添加Grid按钮的事件
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
  //获取一个MenuBar的构建类
  var menuBarButton = new good.drive.nav.button.MenuBarButton();
  //获取更多按钮
  good.drive.init.menuBarMore = menuBarButton.moreMenuBar(
      toolbarSettingMenu.getRightMenu());
  //对更多按钮添加事件
  goog.events.listen(good.drive.init.menuBarMore.getButton(),
      goog.ui.Component.EventType.ACTION, function(e) {
    toolbarSettingMenu.onSelectedHandle(e);
  });
  //对更多按钮添加另一个事件
  goog.events.listen(good.drive.init.menuBarMore.getButton(),
      goog.ui.Component.EventType.ACTION, rightMenuHandle);
  goog.events.listen(good.drive.init.menuBarMore.getButton(),
      'enter', function(e) {
    if (e.target != good.drive.init.menuBarMore.getButton()) {
      return;
    }
    toolbarSettingMenu.hideMenuItem(e);
  });
  //获取设置按钮
  var settingDialog = new goog.ui.Dialog(null, true);
  settingDialog.setContent('版本1.0');
  settingDialog.setButtonSet(dialog.genButtonSet([{
    key: 'cr',
    caption: '确定'
  }, {
    key: 'c',
    caption: '取消'
  }]));
  var settingMenu = new good.drive.nav.button.Settingmenu();
  //添加设置按钮的点击事件
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
      //公共资料库右键
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
             createdialog.setVisible(true);
             isInitCreate = true;
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
    }
  });
  //添加一些工具栏按钮的出事状态
  var control = new good.drive.flashcontrol.Control();
  good.drive.init.toolBarRename.setVisible(false);
  good.drive.init.toolBarCreate.setVisible(false);
  good.drive.init.toolBarDelete.setVisible(false);
  good.drive.init.menuBarMore.setVisible(false);
  var preview = new good.drive.preview.Control();
  preview.init();
};

/**
 * 对GridView和ListView的一个控制方法
 */
good.drive.init.initgrid = function() {
  var root = good.drive.nav.folders.Path.getINSTANCE().root;
  //添加path的监听事件 以方便改变Path后进行回调处理
  root.addValueChangedListener(function(evt) {
    var property = evt.getProperty();
    var newValue = evt.getNewValue();
    //如果时间源是path 则处理GridView和ListView的切换
    if (property == good.drive.nav.folders.Path.NameType.PATH) {
      good.drive.init.initCallback(newValue);
      return;
    }
    //如果时间源是select 则处理选择状态的切换
    if (property == good.drive.nav.folders.Path.NameType.SELECT) {
      good.drive.init.visiabletoolbar(newValue);
      return;
    }
  });
  //初始化需要默认调用一次
  good.drive.init.initCallback(
      good.drive.nav.folders.Path.getINSTANCE().path);
};

/**
 * 处理切换
 * @param {Object} path
 */
good.drive.init.initCallback = function(path) {
  //获取当前的path
  var pathlist = path[good.drive.nav.folders.Path.NameType.CURRENTPATH];
  if (goog.array.isEmpty(pathlist)) {
    return;
  }
  //获取当前选中节点的ID
  var id = pathlist[pathlist.length - 1];
  var docid = path[good.drive.nav.folders.Path.NameType.CURRENTDOCID];
  //对当前docid进行判断 控制一些按钮的显示
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
      if (good.drive.role.Role.USERNAME != good.constants.ADMIN) {
        good.drive.init.toolBarCreate.setVisible(false);
      } else {
        good.drive.init.toolBarCreate.setVisible(true);
      }
      good.drive.init.gridBtn.setVisible(true);
      good.drive.init.listBtn.setVisible(true);
      break;
    default:
      good.drive.init.toolBarCreate.setVisible(false);
      good.drive.init.gridBtn.setVisible(false);
      good.drive.init.listBtn.setVisible(false);
      break;
  }
  //忽略掉一些docid的默认行为
  if (docid == good.constants.PUBLICRESDOCID ||
      docid == good.constants.OTHERDOCID) {
    return;
  }
  //根据一个全局的boolean值来确定是创建Gridview还是ListView
  var grids = good.drive.view.baseview.View.isGrid ?
      good.drive.view.baseview.View.grids :
      good.drive.view.baseview.View.lists;
  good.drive.init.callListOrGrid(grids, docid, id);
};

/**
 * 根据Grids从一个Map中获取具体的view 如果已经存在 就不创建 不存在 就创建
 * @param {Object} grids
 * @param {string} docid
 * @param {string} id
 */
good.drive.init.callListOrGrid = function(grids, docid, id) {
  //先判断这个docid是否已经存在于grids列表内
  if (!goog.object.containsKey(grids, docid)) {
    var cells = {};
    goog.object.add(grids, docid, cells);
  }
  //通过docid获取cells
  var cells = goog.object.get(grids, docid);
  //在从cells里判断id是否存在
  if (goog.object.containsKey(cells, id)) {
    //如果已经存在 取出来显示
    good.drive.view.baseview.View.visiable(goog.object.get(cells, id));
    return;
  }
  //不存在就开始构建
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
 * 用于处理选中之后的状态
 * @param {Object} selected
 */
good.drive.init.visiabletoolbar = function(selected) {
  var pathControl = good.drive.nav.folders.Path.getINSTANCE();
  var root = pathControl.root;
  var isSelected = root.get(good.drive.nav.folders.Path.NameType.SELECT);
  //如果当前没有选中
  if (isSelected == 0) {
    good.drive.init.toolBarRename.setVisible(false);
    good.drive.init.toolBarDelete.setVisible(false);
    good.drive.init.menuBarMore.setVisible(false);
    return;
  }
  //选中之后
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
    //只选中一个
    if (isSelected == 1) {
      good.drive.init.toolBarDelete.setVisible(true);
      good.drive.init.menuBarMore.setVisible(true);
      return;
    }
    //选中了多个
    good.drive.init.toolBarDelete.setVisible(true);
    good.drive.init.menuBarMore.setVisible(false);
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
