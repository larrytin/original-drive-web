'use strict';
goog.provide('good.drive.resourcemap');

goog.require('good.drive.search');

/**
 * @constructor
 */
good.drive.resourcemap.Resourcemap = function() {
};

/**
 *
 */
good.drive.resourcemap.Resourcemap.init = function() {
  var menu = new good.drive.search.AdvancedMenu();
  var root = good.drive.nav.folders.Path.getINSTANCE().root;
  root.addValueChangedListener(function(evt) {
    var path = good.drive.nav.folders.Path.getINSTANCE().path;
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
      var model = goog.object.get(good.drive.nav
          .folders.AbstractControl.docs, docid);
          var data = model.getObject(id);
          var query = data.get(good.constants.QUERY);
          var tags = query.get(good.constants.TAGS).asArray();
          var contentType = query.get(good.constants.CONTENTTYPE);
          goog.array.forEach(tags, function(e) {
            menu.createCondition(e);
          });
          menu.createCondition(contentType);
          menu.inputstyle();
          menu.search();
    }
  });
};
