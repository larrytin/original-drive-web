'use strict';
goog.provide('good.drive.demo');


/** */
good.drive.demo.start = function() {
  var onLoad = function(doc) {
    var mod = doc.getModel();
    var root = mod.getRoot();
    console.log(root.get('a'));
    root.addValueChangedListener(function(evt) {
      var property = evt.getProperty();
      console.log(property);
      console.log(evt.isLocal());
    });
  };
  var onInit = function(mod) {
    var root = mod.getRoot();
    root.set('a', 'v');
  };
  good.realtime.load('@tmp/test3', onLoad, onInit, null);
};

goog.exportSymbol('good.drive.demo.start', good.drive.demo.start);
