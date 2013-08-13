'use strict';
goog.provide('good.drive.nav.list');

goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItemRenderer');
/**
 * @constructor
 */
good.drive.nav.list.View = function(docid) {
//  var render = goog.ui.ContainerRenderer.getCustomRenderer(
//      good.drive.nav.menu.ViewRenderer, 'detroit-createmenu');
  var itemRender = goog.ui.ControlRenderer.getCustomRenderer(
      goog.ui.MenuItemRenderer, 'goog-listitem');
  goog.ui.registry.setDecoratorByClassName(
      'goog-listitem', function() {
        return new goog.ui.MenuItem('', null, null, itemRender);
      });
  var menu = new goog.ui.Menu();
  menu.decorateContent = function(element) {
    var renderer = this.getRenderer();
    var contentElements = this.getDomHelper().getElementsByTagNameAndClass(
        'div', goog.getCssName(renderer.getCssClass(), 'goog-listitem-content'),
        element);
    var length = contentElements.length;
    for (var i = 0; i < length; i++) {
      renderer.decorateChildren(this, contentElements[i]);
    }
  };
  menu.decorate(
      goog.dom.getElement('navpanelist').
      firstElementChild.firstElementChild.firstElementChild);
  this.menu = menu;
  
  this.idx = -1;
  this.docid = docid;
};

/**
 * @return {goog.ui.Menu}
 */
good.drive.nav.list.View.prototype.listMenu = function() {
  return this.menu;
};

/**
 * @param {good.realtime.CollaborativeList} pathlist
 * @param {good.realtime.CollaborativeMap} pathroot
 * @param {Function} callback
 */
good.drive.nav.list.View.prototype.initPath =
  function(pathlist, pathroot, callback) {
  var childs = this.menu.getChildIds();
  var that = this;
  goog.events.listen(this.menu, 'action', function(e) {
    that.idx = childs.indexOf(e.target.getId());
    var path = good.drive.nav.folders.Path.getINSTANCE().path;
    var pathjson = path[good.drive.nav.folders.Path.NameType.CURRENTPATH];
    if (e.target.getId() == pathjson[0]) {
      return;
    }
    var curPath = {};
    curPath[good.drive.nav.folders.Path.NameType.CURRENTDOCID] =
      that.docid;
    curPath[good.drive.nav.folders.Path.NameType.CURRENTPATH] = [e.target.getId()];
    pathroot.set(good.drive.nav.folders.Path.NameType.PATH,
        curPath);
  });
};

/**
 */
good.drive.nav.list.View.prototype.recovery = function() {
  var childIds = this.menu.getChildIds();
  var that = this;
  goog.array.forEach(childIds, function(childid) {
    var item = that.menu.getChild(childid);
    var e = item.getElement();
    if (goog.dom.classes.has(e, 'goog-option-selected')) {
      goog.dom.classes.remove(e, 'goog-option-selected');
    }
  });
};

/**
 * @param {good.realtime.CollaborativeList} pathlist
 */
good.drive.nav.list.View.prototype.location = function(pathlist) {
  var curItem = this.menu.getChild(pathlist[0]);
  var e = curItem.getElement();
  if (!goog.dom.classes.has(e, 'goog-option-selected')) {
    goog.dom.classes.add(e, 'goog-option-selected');
  }
};
