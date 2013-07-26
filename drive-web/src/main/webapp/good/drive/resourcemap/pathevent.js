'use strict';
goog.provide('good.drive.resourcemap');





/**
 *
 */
good.drive.resourcemap.Resourcemap.init = function() {
  /*var path = good.drive.nav.folders.Path.getINSTANCE().path;
  var pathlist = good.drive.nav.folders.Path.getINSTANCE().pathlist;
  pathlist.addValuesAddedListener(function(evt) {
    var id = pathlist.get(pathlist.length() - 1);
    var docid = path.get(good.drive.nav.folders.Path.NameType.CURRENTDOCID);
    if(!goog.object.containsKey(good.drive.nav.grid.View.grids, docid)) {
      var cells = {};
      goog.object.add(good.drive.nav.grid.View.grids, docid, cells);
    }
    var cells =  goog.object.get(good.drive.nav.grid.View.grids, docid);
    if (goog.object.containsKey(cells, id)) {
      good.drive.nav.grid.View.visiable(goog.object.get(cells, id));
      return;
    }
    var model = goog.object.get(good.drive.nav
    .folders.AbstractControl.docs, docid);
    var data = model.getObject(id);
    var grid = new good.drive.nav.grid.View(data, docid);
    grid.render(goog.dom.getElement('viewmanager'));
    grid.renderCell(data);
    grid.renderFolderPath(good.drive.nav.folders.Model.strType.LABEL);
    goog.object.add(cells, id, grid);
    good.drive.nav.grid.View.visiable(grid);
  });*/
};
