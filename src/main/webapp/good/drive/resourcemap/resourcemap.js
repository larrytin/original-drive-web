'use strict';
goog.provide('good.drive.resourcemap');

goog.require('good.drive.search');

/**
 * PATH变化监听类
 * @constructor
 */
good.drive.resourcemap.Resourcemap = function() {
};

/**
 * 初始化类
 */
good.drive.resourcemap.Resourcemap.init = function() {
  var root = good.drive.nav.folders.Path.getINSTANCE().root;
  root.addValueChangedListener(function(evt) {
    var property = evt.getProperty();
    if (property != good.drive.nav.folders.Path.NameType.PATH) {
      return;
    }
    var newValue = evt.getNewValue();
    good.drive.resourcemap.Resourcemap.initcallback(newValue);
    var previewpane = goog.dom.getElement('previewpane');
    if (previewpane.style.display == 'block') {
      var pathControl = good.drive.nav.folders.Path.getINSTANCE();
      var docid = pathControl.currentDocId;
      if (docid == good.constants.PUBLICRESDOCID) {
        //公共资料库详细信息显示
        var view = pathControl.getViewBydocId(docid);
        var model = view.getCurrentItem();
        var data = model.map;
        var label = data.get(good.constants.LABEL);
        var query = data.get(good.constants.QUERY);
        var tags = query.get(good.constants.TAGS);
        var contentType = query.get('contentType');
        good.drive.rightmenu.DetailInfo.TYPEFLAG = 'public';
        good.drive.rightmenu.DetailInfo.PUBLICDETAIL(label, tags, contentType);
      } else {
        previewpane.style.display = 'none';
      }
    }
  });
  good.drive.resourcemap.Resourcemap.
  initcallback(good.drive.nav.folders.Path.getINSTANCE().path);
};

/**
 * @param {Object} path
 */
good.drive.resourcemap.Resourcemap.initcallback = function(path) {
  var menu = new good.drive.search.AdvancedMenu();
  var pathlist = path[good.drive.nav.folders.Path.NameType.CURRENTPATH];
  var pathlistLength = goog.array.count(pathlist, function() {
    return true;
  });
  var id = pathlist[pathlistLength - 1];
  var docid = path[good.drive.nav.folders.Path.NameType.CURRENTDOCID];

  var input_text = goog.dom.getElement('gbqfq');
  var search_input = goog.dom.getElement('search_input');
  goog.dom.removeChildren(search_input);
  input_text.value = '';
  menu.inputstyle();
  if (docid == good.constants.PUBLICRESDOCID) {
    // 公共资料库PATH变化查询
    var model = goog.object.get(good.drive.nav
        .folders.AbstractControl.docs, docid);
        var data = model.getObject(id);
        var query = data.get(good.constants.QUERY);
        var tags = query.get(good.constants.TAGS).asArray();
        var contentType = query.get(good.constants.CONTENTTYPE);
        goog.array.forEach(tags, function(e) {
          menu.createCondition(e);
        });
        menu.createCondition(good.constants.REVERSETYPE[contentType]);
        menu.inputstyle();
        menu.search();
  } else if (docid == good.constants.OTHERDOCID) {
    //人员管理和设备管理查询
    var previewpane = goog.dom.getElement('previewpane');
    previewpane.style.display = 'none';
    var pathControl = good.drive.nav.folders.Path.getINSTANCE();
    var view = pathControl.getViewBydocId(docid);
    var curItem = view.getCurItem();
    var id = curItem.getId();
    if (id == 'personman') {
      good.drive.person.Listperson.SEARCHPERSON();
    } else {
      good.drive.device.Listdevice.SEARCHDEVICE();
    }
  }
};
