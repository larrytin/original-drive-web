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
  var path = good.drive.nav.folders.Path.getINSTANCE().path;
  var pathlist = good.drive.nav.folders.Path.getINSTANCE().pathlist;
  pathlist.addValuesAddedListener(function(evt) {
    var id = pathlist.get(pathlist.length() - 1);
    var docid = path.get(good.drive.nav.folders.Path.NameType.CURRENTDOCID);

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
