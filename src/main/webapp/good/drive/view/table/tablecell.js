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
};
goog.inherits(good.drive.view.table.TableCell, good.drive.view.baseview.Cell);

/** @override */
good.drive.view.table.TableCell.prototype.enterDocument = function() {
  good.drive.view.table.TableCell.superClass_.enterDocument.call(this);
  this.genTd();
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
    var enable = new goog.ui.Checkbox();
    el = goog.dom.createDom('td',
        {'class': 'doclist-td-checkbox', 'style' : 'padding: 0 0 0 6px;'},
        this.genCheckBox());
    enable.render(el);
    return el;
  }
  if (idx == 1) {
    el = goog.dom.createDom('td',
        {'class': 'doclist-td-name'},
        goog.dom.createDom('div', {'class': 'doclist-name-wrapper'},
            goog.dom.createDom('a',
                {'class': 'doclist-content-wrapper'},
                goog.dom.createDom('span',
                    {'class': this.getLabelIcon()}),
                    goog.dom.createDom('span',
                        {'class': 'goog-inline-block doclist-name'},
                        goog.dom.createDom('span',
                            {'dir': 'ltr'},
                            value)))));
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

/** */
good.drive.view.table.TableCell.prototype.genCheckBox = function() {
};

