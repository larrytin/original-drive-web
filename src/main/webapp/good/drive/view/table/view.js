'use strict';
goog.provide('good.drive.view.table');

goog.require('good.drive.view.baseview');
goog.require('good.drive.view.table.TableCell');
goog.require('goog.ui.Checkbox');

/**
 * @param {Object} heads
 * @param {Object} data
 * @param {string} docid
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {good.drive.view.baseview.View}
 */
good.drive.view.table.View =
  function(heads , data, docid, opt_domHelper) {
  good.drive.view.baseview.View.call(this, data, docid, opt_domHelper);
  this.heads = heads;
};
goog.inherits(good.drive.view.table.View,
    good.drive.view.baseview.View);

/** @override */
good.drive.view.table.View.prototype.enterDocument = function() {
  good.drive.view.table.View.superClass_.enterDocument.call(this);
  this.genHeads();
};

/**  */
good.drive.view.table.View.prototype.genHeads = function() {
  var headElm = this.getTheadElement();
  var headKey = goog.object.getKeys(this.heads);
  var that = this;
  goog.array.forEach(headKey, function(key, idx) {
    var el;
    if (key == 'select') {
      el = goog.dom.createDom('th',
          {'class': 'doclist-header-selection-checkbox'},
          that.genCheckBox());
      goog.dom.appendChild(headElm, el);
      return;
    }
    if (idx == 1) {
      el = goog.dom.createDom('th',
          {'class': 'doclist-header-name doclist-header-sortable'},
          goog.dom.createDom('div',
              {'class': 'doclist-header-inner doclist-header-label-name'},
              goog.dom.createDom('div', {'class': 'doclist-header-label'},
                 goog.object.get(that.heads, key))));
      goog.dom.appendChild(headElm, el);
      return;
    }
    el = goog.dom.createDom('th',
        {'class': 'doclist-header-owners'},
        goog.dom.createDom('div',
            {'class': 'doclist-header-inner doclist-header-label-owners'},
            goog.dom.createDom('div',
                {'class':
                  'doclist-header-label doclist-header-with-column-selector'},
               goog.object.get(that.heads, key))));
    goog.dom.appendChild(headElm, el);
  });
};

/**
 * @return {Element}
 */
good.drive.view.table.View.prototype.genCheckBox = function() {
  var render = goog.ui.ContainerRenderer.getCustomRenderer(
      goog.ui.CheckboxRenderer, 'jfk-checkbox');
  var enable = new goog.ui.Checkbox(undefined, undefined, render);
  var content = goog.dom.createDom('div', {'class': 'jfk-checkbox-checkmark'});
  var en = goog.dom.createDom('div',
      {'class': 'goog-inline-block selectioncomponent'});
  enable.render(en);
  var el = goog.dom.createDom('div',
      {'class': 'doclist-header-inner doclist-header-label-checkbox'},
      goog.dom.createDom('div', {'class': 'doclist-header-label'}, en));
  var that = this;
  enable.setContent(content);
  goog.events.listen(enable, 'change', function(e) {
    e.target.getChecked() ? that.selectAll() : that.deSelectAll();
  });
  this.allCheck = enable;
  return el;
};

/** @override */
good.drive.view.table.View.prototype.addChildAt = function(child, index,
    opt_render) {
  goog.asserts.assert(!child.getParent());

  good.drive.view.baseview.View.superClass_.addChildAt.call(this, child, index);

  if (this.getElement()) {
    var contentElm = this.getTbodyElement();
    var sb = new goog.string.StringBuffer();
    child.createDom();
    goog.dom.appendChild(contentElm, child.getElement());
    child.enterDocument();
  }
};

/**
 * @override
 */
good.drive.view.table.View.prototype.removeChild =
    function(childNode, opt_unrender) {
  var child = /** @type {good.drive.view.baseview.Cell} */ (childNode);

  good.drive.view.baseview.View.superClass_.removeChild.call(this, child);

  var contentElm = this.getTbodyElement();
  contentElm.removeChild(childNode.getElement());

};

/** @override */
good.drive.view.table.View.prototype.getGridContainerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getGridContainerClassName(),
      '">' + this.getTableHtml() + '</div>');
  return sb.toString();
};

/** @override */
good.drive.view.table.View.prototype.getGridContainerClassName = function() {
  return this.getConfig().cssTableContainer;
};

/** @override */
good.drive.view.table.View.prototype.getGridViewClassName = function() {
  return this.getConfig().cssTableView;
};

/**
 * @return {string}
 */
good.drive.view.table.View.prototype.getTableHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<table class="' + this.getTableClassName()).
  append('" cellspacing="0" cellpadding="0">').
  append(this.getTheadHtml()).
  append(this.getTbodyHtml()).
  append('</table>');
  return sb.toString();
};

/**
 * @return {Element}
 */
good.drive.view.table.View.prototype.getTableElement = function() {
  var el = this.getGridContainerElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};

/**
 * @return {string}
 */
good.drive.view.table.View.prototype.getTableClassName = function() {
  return this.getConfig().cssTableRoot;
};

/**
 * @return {string}
 */
good.drive.view.table.View.prototype.getTheadHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<thead class="' + this.getTheadClassName()).
  append('"><tr class="' + this.getConfig().cssTableHeadtr + '"></tr>').
  append('</thead>');
  return sb.toString();
};

/**
 * @return {Element}
 */
good.drive.view.table.View.prototype.getTheadElement = function() {
  var el = this.getTableElement();
  return el ? /** @type {Element} */ (el.firstChild.firstChild) : null;
};

/**
 * @return {string}
 */
good.drive.view.table.View.prototype.getTheadClassName = function() {
  return this.getConfig().cssTableHead;
};

/**
 * @return {string}
 */
good.drive.view.table.View.prototype.getTbodyHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<tbody class="' + this.getTbodyClassName()).
  append('">').
  append('</tbody>');
  return sb.toString();
};

/**
 * @return {Element}
 */
good.drive.view.table.View.prototype.getTbodyElement = function() {
  var el = this.getTableElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};

/**
 * @return {string}
 */
good.drive.view.table.View.prototype.getTbodyClassName = function() {
  return this.getConfig().cssTableBody;
};

/** @override */
good.drive.view.table.View.prototype.createCell = function(data) {
  return new good.drive.view.table.TableCell(this.heads, data,
      this.getKeyType(), this.getConfig());
};
