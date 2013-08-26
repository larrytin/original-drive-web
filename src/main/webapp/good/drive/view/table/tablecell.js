'use strict';
goog.provide('good.drive.view.table.TableCell');

goog.require('good.drive.view.baseview.Cell');

/**
 * @param {Object} heads
 * @param {good.realtime.CollaborativeMap} data
 * @param {Object} keytype
 * @param {Object} defaultConfig
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {good.drive.view.baseview.Cell}
 */
good.drive.view.table.TableCell =
  function(heads, data, keytype, defaultConfig, opt_domHelper) {
  good.drive.view.baseview.Cell.call(
      this, data, keytype, defaultConfig, opt_domHelper);
  this.heads = heads;
  var aImage = undefined;
};
goog.inherits(good.drive.view.table.TableCell, good.drive.view.baseview.Cell);

/** @override */
good.drive.view.table.TableCell.prototype.enterDocument = function() {
  this.genTd();
  good.drive.view.table.TableCell.superClass_.enterDocument.call(this);
};

/** */
good.drive.view.table.TableCell.prototype.createDom = function() {
  var tr = this.dom_.createDom('tr',
      {'class': this.defaultConfig.cssTableCellRoot,
    'id': this.getId()});
  this.setElementInternal(/** @type {Element} */ (tr));
};

/** */
good.drive.view.table.TableCell.prototype.genTd = function() {
  var tr = this.getElement();
  var i = 0;
  var that = this;
  goog.object.forEach(this.heads, function(value, key) {
    goog.dom.appendChild(tr, that.getTdElm(key, that.getValue(key), i));
    i++;
  });
};

/**
 * @return {string}
 * @override
 */
good.drive.view.table.TableCell.prototype.cellHover = function() {
  return this.defaultConfig.cssTablehover;
};

/**
 * @param {string} key
 * @param {data} value
 * @param {number} idx
 * @return {Element}
 */
good.drive.view.table.TableCell.prototype.getTdElm = function(key, value, idx) {
  var el = undefined;
  if (key == 'select') {
    el = this.genCheckBox();
    return el;
  }
  if (idx == 1) {
    this.aImage = this.genImage(key);
    el = goog.dom.createDom('td',
        {'class': 'doclist-td-name'},
        goog.dom.createDom('div', {'class': 'doclist-name-wrapper'},
            this.aImage));
    return el;
  }
  el = goog.dom.createDom('td',
      {'class': 'doclist-td-owners'},
      goog.dom.createDom('div', {'class': 'doclist-owners'},
          goog.dom.createDom('span', {'class': 'doclist-owner'},
              goog.dom.createDom('span', {'class': 'g-hovercard'},
                  value))));
  return el;
};

/**
 * @return {Element}
 */
good.drive.view.table.TableCell.prototype.createImageElement = function() {
  var images = this.createImage(this.data);
  var el = undefined;
  if (this.data instanceof good.realtime.CollaborativeMap) {
    if (this.data.get('isfile') == undefined) {
      return goog.dom.createDom('span',
      {'class': this.getLabelIcon()});
    }
  }
  return goog.dom.createDom('img', {
    'class': 'doclist-icon-image',
    'src': images
  });
};

/**
 * @param {data} data
 * @return {string}
 */
good.drive.view.table.TableCell.prototype.createImage = function(data) {
  var path = good.drive.nav.folders.Path.getINSTANCE().path;
  var docid = path[good.drive.nav.folders.Path.NameType.CURRENTDOCID];
  if (data instanceof good.realtime.CollaborativeMap) {
    if (data.get('isfile') != undefined) {
      var dataImage = data.get('type').indexOf('image/');
      var audioImage = data.get('type').indexOf('audio/');
      if (dataImage != -1) {
        return './good/images/icon_11_image_list.png';
      } else if (audioImage != -1) {
        return './good/images/icon_10_audio_list.png';
      } else {
        return './good/images/icon_10_generic_list.png';
      }
    }
  } else {
    if (docid == good.constants.PUBLICRESDOCID) {
      if (data.contentType.indexOf('image/') != -1) {
          return './good/images/icon_11_image_list.png';
        } else if (data.contentType.indexOf('audio/') != -1) {
          return './good/images/icon_10_audio_list.png';
        } else {
          return 'good/images/icon_10_generic_list.png';
        }
      } else {
        var pathControl = good.drive.nav.folders.Path.getINSTANCE();
        var view = pathControl.getViewBydocId(docid);
        var curItem = view.getCurItem();
        var id = curItem.getId();
        if (id == 'personman') {
          return 'good/images/tablephoto.png';
        } else {
          return 'good/images/device.png';
        }
     }
  }
};

/**
 * @param {string} key
 * @return {Object}
 */
good.drive.view.table.TableCell.prototype.getValue = function(key) {
  if (this.data instanceof good.realtime.CollaborativeMap) {
    return this.data.get(key);
  } else {
    return this.data[key];
  }
};

/**
 * @return {string}
 */
good.drive.view.table.TableCell.prototype.getLabelIcon = function() {
  return 'goog-inline-block doclist-icon doclist-icon-sprite' +
  ' drive-sprite-folder-list-icon icon-color-1';
};

/**
 * @return {Eleleme}
 */
good.drive.view.table.TableCell.prototype.genCheckBox = function() {
  var ele = goog.dom.createDom('td',
      {'class': 'doclist-td-checkbox', 'style': 'padding: 0 0 0 6px;'},
        goog.dom.createDom('span', {'class': 'jfk-checkbox goog-inline-block' +
          ' jfk-checkbox-unchecked'},
          goog.dom.createDom('div',
              {'class': 'jfk-checkbox-checkmark'}))
        );
  return ele;
};
/**
 * @param {string} key
 * @return {Eleleme}
 */
good.drive.view.table.TableCell.prototype.genImage = function(key) {
  var image = this.createImageElement(this.data);
  var filename = this.getValue(key);
  var ele = goog.dom.createDom('a',
      {'class': 'doclist-content-wrapper'},
      image,
          goog.dom.createDom('span',
              {'class': 'goog-inline-block doclist-name'},
              goog.dom.createDom('span',
                  {'dir': 'ltr'},
                  filename)));
  return ele;
};

/**
 * @return {Element}
 */
good.drive.view.table.TableCell.prototype.getCheckboxTd = function() {
  var el = this.getElement();
  return el ?
      /** @type {Element} */ (el.firstChild) : null;
};
/**
 * @return {Element}
 */
good.drive.view.table.TableCell.prototype.getCheckImage = function() {
  var el = this.getElement();
  return el ?
      /** @type {Element} */ (el.lastChild) : null;
};
/**
 * @return {Element}
 */
good.drive.view.table.TableCell.prototype.getCheckbox = function() {
  return this.getCheckboxTd();
};

/**
 * @override
 */
good.drive.view.baseview.Cell.prototype.getCheckImageElement = function() {
  return this.aImage;
};

/**
 * @override
 */
good.drive.view.table.TableCell.prototype.getCheckStyle = function() {
  good.drive.view.grid.GridCell.superClass_.getCheckStyle.call(this);
  var rootElement = this.getElement();
  if (!goog.dom.classes.has(rootElement, 'doclist-tr-selected')) {
    goog.dom.classes.remove(rootElement, 'doclist-tr');
    goog.dom.classes.add(rootElement, 'doclist-tr-selected');
  } else {
    goog.dom.classes.remove(rootElement, 'doclist-tr-selected');
    goog.dom.classes.add(rootElement, 'doclist-tr');
  }
};
