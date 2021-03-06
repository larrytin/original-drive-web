'use strict';
goog.provide('good.drive.view.baseview');

goog.require('good.drive.view.baseview.Cell');
goog.require('goog.asserts');
goog.require('goog.dom.classes');
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.Component');

/**
 * 这个是GridView和TableView的基类
 * @param {Object} data
 * @param {string} docid
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {goog.ui.Component}
 */
good.drive.view.baseview.View = function(data, docid, opt_domHelper) {
  goog.ui.Component.call(this, opt_domHelper);
  this.data = data;
  this.docid = docid;
  this._selectedItem = undefined;
  this.menu = undefined;
  this.checkList = [];
  this.selected = false;
  this.displayNum = 10;
  this.displayStart = 0;
  this.isRemote = false;
  this.isEnd = false;
  this.allCheck = undefined;
};
goog.inherits(good.drive.view.baseview.View, goog.ui.Component);

/**
 * @type {struct}
 */
good.drive.view.baseview.View.grids = {};
/**
 * @type {struct}
 */
good.drive.view.baseview.View.lists = {};
/**
 * @type {string}
 */
good.drive.view.baseview.View.isGrid = true;

/**
 * @type {good.drive.view.baseview.View}
 */
good.drive.view.baseview.View.currentGrid = undefined;

/**
 * 设置传入的grid为显示状态
 * @param {good.drive.view.baseview.View} grid
 */
good.drive.view.baseview.View.visiable = function(grid) {
  if (good.drive.view.baseview.View.currentGrid != undefined) {
    goog.style.showElement(
        good.drive.view.baseview.View.currentGrid.getElement());
    good.drive.view.baseview.View.currentGrid.clearSelect();
  }
  good.drive.view.baseview.View.currentGrid = grid;
  goog.style.showElement(grid.getElement(), 'none');
};

/**
 * 根据Data渲染Cell
 * @param {Object} data
 */
good.drive.view.baseview.View.prototype.renderCell = function(data) {
  if (goog.isArray(data)) {
    this.renderCellByArray(data);
    return;
  }
  if (goog.isObject(data)) {
    this.bindDataEvent(data);
    this.renderCellByObject(data);
  }
};

/**
 * 返回一个选中Cell列表的集合
 * @return {Array.<good.drive.view.baseview.Cell>}
 */
good.drive.view.baseview.View.prototype.getClickList = function() {
  if (goog.array.isEmpty(this.checkList)) {
    return null;
  }
  return this.checkList;
};

/**
 * 当前Grid是否有元素被选中
 * @return {boolean}
 */
good.drive.view.baseview.View.prototype.hasSeleted = function() {
  if (goog.array.isEmpty(this.checkList)) {
    return true;
  } else {
    return false;
  }
};

/**
 * 清楚所有的选中状态
 */
good.drive.view.baseview.View.prototype.clearSelect = function() {
  if (goog.array.isEmpty(this.checkList)) {
    return;
  }
  var bakListClick = goog.array.clone(this.checkList);
  goog.array.forEach(bakListClick, function(cell) {
    cell.deSelect();
  });
};

/**
 * 删除所有的Cell
 */
good.drive.view.baseview.View.prototype.clear = function() {
  this.clearSelect();
  this.isEnd = false;
  var length = this.getChildCount();
  if (length == 0) {
    return;
  }
  for (var i = 0; i < length; i++) {
    this.removeChildAt(0);
  }
};

/**
 * 根据一个数组渲染Grid
 * @param {Array.<Object>} data
 */
good.drive.view.baseview.View.prototype.renderCellByArray = function(data) {
  var that = this;
  goog.array.forEach(data, function(cell) {
    that.insertCell(cell, false);
  });
};

/**
 * 根据一个Object数据来渲染Grid
 * @param {Object} data
 */
good.drive.view.baseview.View.prototype.renderCellByObject = function(data) {
  var file = data.get(good.drive.nav.folders.ViewControl.ViewControlType.FILES);
  var folder = data.get(
      good.drive.nav.folders.ViewControl.ViewControlType.FOLDERS);
  for (var i = 0; i < folder.length(); i++) {
    var data = folder.get(i);
    this.insertCell(data, true);
  }
  for (var i = 0; i < file.length(); i++) {
    var data = file.get(i);
    this.insertCell(data, false);
  }
};

/**
 * 对data添加监听事件
 * @param {Object} data
 */
good.drive.view.baseview.View.prototype.bindDataEvent = function(data) {
  var files = data.get(
      good.drive.nav.folders.ViewControl.ViewControlType.FILES);
  var folders = data.get(
      good.drive.nav.folders.ViewControl.ViewControlType.FOLDERS);
  var that = this;
  var addHandle = function(evt) {
    var vals = evt.getValues();
    for (var i in vals) {
      var val = vals[i];
      that.insertCell(val);
    }
  };
  folders.addValuesAddedListener(addHandle);
  files.addValuesAddedListener(addHandle);
  var removeHandle = function(evt) {
    var vals = evt.getValues();
    var idx = evt.getIndex();
    for (var i in vals) {
      var val = vals[i];
      that.removeCell(val);
      if (that.docid == undefined ||
          !(val instanceof good.realtime.CollaborativeMap)) {
        continue;
      }
      var cells = goog.object.get(
          good.drive.view.baseview.View.grids, that.docid);
      var id = val.getId();
      if (goog.object.containsKey(cells, id)) {
        var grid = goog.object.get(cells, id);
        grid.removeFromParent();
      }
    }
  };
  folders.addValuesRemovedListener(removeHandle);
  files.addValuesRemovedListener(removeHandle);
};

/**
 * 渲染文件导航路径
 */
good.drive.view.baseview.View.prototype.renderFolderPath = function() {
  var headElm = this.getHeadContainerElement();
  goog.style.showElement(headElm, 'none');
  var pathElm = this.getFolderPathElement();
  var child = goog.dom.getChildren(pathElm);
  if (!goog.array.isEmpty(child)) {
    return;
  }
  this.insertFolderPath();
};

/**
 * 新建或者插入导航路径
 */
good.drive.view.baseview.View.prototype.insertFolderPath = function() {
  var that = this;
  var pathElm = this.getFolderPathElement();
  goog.dom.removeChildren(pathElm);
  var path = good.drive.nav.folders.Path.getINSTANCE().path;
  var pathlist = path[good.drive.nav.folders.Path.NameType.CURRENTPATH];
  var model = goog.object.get(
      good.drive.nav.folders.AbstractControl.docs, this.docid);
  goog.array.forEach(pathlist, function(id, i) {
    var value = model.getObject(id);
    var label = value.get(that.getKeyType().LABEL[0]);
    if (i == (pathlist.length - 1)) {
      var cruuentElm = goog.dom.createDom('div',
          {'class': 'goog-inline-block folder-path-' +
          'folder folder-current-element'});
      goog.dom.setTextContent(cruuentElm, label);
      goog.dom.appendChild(pathElm, cruuentElm);
      return;
    }
    var contentElm = goog.dom.createDom('div',
        {'class': 'goog-inline-block folder-path-folder folder-path-element'});
    var separatorElm = goog.dom.createDom('div',
        {'class': 'goog-inline-block folder-path-separator-icon'});
    goog.dom.setTextContent(contentElm, label);
    goog.dom.appendChild(pathElm, contentElm);
    goog.dom.appendChild(pathElm, separatorElm);
    that.pathHandle(contentElm, pathlist, id);
  });
};

/**
 * 设置传入的Cell为选中状态
 * @param {good.drive.view.baseview.Cell} cell
 */
good.drive.view.baseview.View.prototype.setSelectedItem =
  function(cell) {
  this._selectedItem = cell;
  if (cell.isSelected()) {
    return;
  }
  cell.setSelectedInternal(true);
  goog.array.insert(this.checkList, cell);
  cell.select();
  if (this.allCheck != undefined) {
    this.allCheck.setChecked(this.checkList.length == this.getChildCount() ?
        goog.ui.Checkbox.State.CHECKED :
          goog.ui.Checkbox.State.UNDETERMINED);
  }
  this.dispatchEvent(goog.events.EventType.CHANGE);
};

/**
 * 设置传入的Cell取消选中状态
 * @param {good.drive.view.baseview.Cell} cell
 */
good.drive.view.baseview.View.prototype.setDeSelectedItem = function(cell) {
  if (!cell.isSelected()) {
    return;
  }
  this._selectedItem = undefined;
  cell.setSelectedInternal(false);
  goog.array.remove(this.checkList, cell);
  cell.deSelect();
  if (this.allCheck != undefined) {
    this.allCheck.setChecked(this.hasSeleted() ?
        goog.ui.Checkbox.State.UNCHECKED :
          goog.ui.Checkbox.State.UNDETERMINED);
  }
};

/**
 * 选中所有
 */
good.drive.view.baseview.View.prototype.selectAll = function() {
  for (var i = 0; i < this.getChildCount(); i++) {
    var cell = this.getChildAt(i);
    cell.select();
  }
};

/**
 * 取消选中所有
 */
good.drive.view.baseview.View.prototype.deSelectAll = function() {
  for (var i = 0; i < this.getChildCount(); i++) {
    var cell = this.getChildAt(i);
    cell.deSelect();
  }
};

/**
 * @param {good.drive.view.baseview.Cell} cell
 */
good.drive.view.baseview.View.prototype.getCheckBox = function(cell) {
  if (this.selected == undefined) {
    this._selectedItem = cell;
  }
};

/**
 * 返回最后一个选中的的Cell
 * @return {good.drive.view.baseview.Cell}
 */
good.drive.view.baseview.View.prototype.getSelectedItem = function() {
  return this._selectedItem;
};

/**
 * 给导航添加路径
 * @param {Element} elm
 * @param {good.realtime.CollaborativeList} pathlist
 * @param {string} currentid
 */
good.drive.view.baseview.View.prototype.pathHandle =
  function(elm, pathlist, currentid) {
  var docid = good.drive.nav.folders.Path.getINSTANCE().getCurrentDocid();
  var idx = goog.array.indexOf(pathlist, currentid);
  var newArray = goog.array.slice(pathlist, 0, idx + 1);
  goog.events.listen(elm, goog.events.EventType.CLICK, function(e) {
    good.drive.nav.folders.Path.getINSTANCE().
    putDocidAndPathList(docid, newArray);
  });
};

/**
 * 将当前的Grid从他的父亲中删除
 */
good.drive.view.baseview.View.prototype.removeFromParent = function() {
  goog.dom.removeNode(this.getElement());
};

/**
 * 插入一个Cell根据data
 * @param {good.realtime.CollaborativeMap} data
 * @param {boolean} isFolder
 */
good.drive.view.baseview.View.prototype.insertCell = function(data, isFolder) {
  var cell = this.createCell(data);
  this.add(cell);
  cell.renderCell();
  cell.setIsFolder(isFolder);
};


/**
 * 根据data删除一个Cell
 * @param {good.realtime.CollaborativeMap} data
 */
good.drive.view.baseview.View.prototype.removeCell = function(data) {
  for (var i = 0; i < this.getChildCount(); i++) {
    var cell = this.getChildAt(i);
    if (data instanceof good.realtime.CollaborativeMap) {
      if (cell.data.getId() == data.getId()) {
        this.removeChildAt(i);
        return;
      }
    } else {
      if (cell.data.id == data.id) {
        this.removeChildAt(i);
        return;
      }
    }
  }
};

/**
 * 删除当前选中的Cell
 */
good.drive.view.baseview.View.prototype.removeCurrentData = function() {
  var that = this;
  var bakListClick = goog.array.clone(this.checkList);
  goog.array.forEach(bakListClick, function(item) {
    var data = item.data;
    if (data.get('isfile') == undefined) {
      var folders = that.data.get('folders');
      folders.removeValue(data);
    } else {
      var files = that.data.get('files');
      files.removeValue(data);
    }
    item.deSelect();
  });
};

/**
 * 获取当前选中的Cell的Title
 * @return {string}
 */
good.drive.view.baseview.View.prototype.getCurrentTitle = function() {
  var item = good.drive.view.baseview.View.currentGrid.getSelectedItem();
  var data = item.data;
  if (data instanceof good.realtime.CollaborativeMap) {
    return data.get('label');
  } else {
    return data.filename;
  }
};

/**
 * 修改Cell的标题
 * @param {string} title
 */
good.drive.view.baseview.View.prototype.renameChildData =
  function(title) {
  var item = good.drive.view.baseview.View.currentGrid.
  getSelectedItem();
  var data = item.data;
  if (data instanceof good.realtime.CollaborativeMap) {
    data.set('label', title);
  } else {
    return;
  }
};

/**
 * @override
 */
good.drive.view.baseview.View.prototype.removeChild =
    function(childNode, opt_unrender) {
  var child = /** @type {good.drive.view.baseview.Cell} */ (childNode);

  good.drive.view.baseview.View.superClass_.removeChild.call(this, child);

  var contentElm = this.getGridContainerElement();
  contentElm.removeChild(childNode.getElement());

};

/** @override */
good.drive.view.baseview.View.prototype.createDom = function() {
  var sb = new goog.string.StringBuffer();
  this.toHtml(sb);
  var element = this.getDomHelper().htmlToDocumentFragment(sb.toString());
  this.setElementInternal(/** @type {Element} */ (element));
};


/**
 * @param {goog.string.StringBuffer} sb
 */
good.drive.view.baseview.View.prototype.toHtml = function(sb) {
  sb.append('<div>',
      this.getInnerHtml(),
      '</div>');
};


/**
 * @return {Element}
 */
good.drive.view.baseview.View.prototype.getChildrenElement = function() {
  var el = this.getElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};


/** @override */
good.drive.view.baseview.View.prototype.enterDocument = function() {
  good.drive.view.baseview.View.superClass_.enterDocument.call(this);
  var el = this.getElement();
  el.className = this.getConfig().cssRoot;
  var pageHeight = window.innerHeight;
  if (goog.userAgent.IE) {
    if (typeof pageWidth != 'number') {
      if (document.compatMode == 'number') {
        pageHeight = document.documentElement.clientHeight;
      } else {
        pageHeight = document.body.clientHeight;
      }
    }
//    el.style.height = pageHeight - 278;
    el.style.height = pageHeight - 210;
  } else {
    goog.style.setHeight(el, pageHeight - 224 + 'px');
  }
};


/**
 * @param {good.realtime.CollaborativeMap} data
 * @return {good.drive.view.baseview.Cell}
 */
good.drive.view.baseview.View.prototype.createCell = function(data) {
  return new good.drive.view.baseview.Cell(data,
      this.getKeyType(), this.getConfig());
};


/**
 * @param {good.drive.view.baseview.Cell} child
 * @param {good.drive.view.baseview.Cell=} opt_before
 * @return {good.drive.view.baseview.Cell} The added child.
 */
good.drive.view.baseview.View.prototype.add = function(child, opt_before) {
  goog.asserts.assert(!opt_before || opt_before.getParent() == this,
      'Can only add nodes before siblings');
  if (child.getParent()) {
    child.getParent().removeChild(child);
  }
  this.addChildAt(child,
      opt_before ? this.indexOfChild(opt_before) : this.getChildCount());
  return child;
};

/**
 * @return {Element}
 * @override
 */
good.drive.view.baseview.View.prototype.getElement = function() {
  var el = good.drive.view.baseview.View.superClass_.getElement.call(this);
  if (!el) {
    el = this.getDomHelper().getElement(this.getId());
    this.setElementInternal(el);
  }
  return el;
};


/**
 * @return {Element}
 */
good.drive.view.baseview.View.prototype.getInnerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="', this.getInnerClassName(), '">',
      this.getHeadContainerHtml(),
      this.getScrollContainerHtml(),
      '</div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.view.baseview.View.prototype.getInnerElement = function() {
  var el = this.getElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};


/**
 * @return {string}
 */
good.drive.view.baseview.View.prototype.getInnerClassName = function() {
  return this.getConfig().cssRoot + '-' + this.getConfig().cssInnerClass;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.baseview.View.prototype.getHeadContainerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="', this.getHeadContainerClassName(),
      '" style="display: none;">',
      this.getFolderPathHtml(),
      '<div class="',
      this.getConfig().cssEdge,
      '"></div></div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.view.baseview.View.prototype.getHeadContainerElement = function() {
  var el = this.getInnerElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};


/**
 * @return {string}
 */
good.drive.view.baseview.View.prototype.getHeadContainerClassName = function() {
  return this.getConfig().cssRoot + '-' +
      this.getConfig().cssHeadContainerHtml;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.baseview.View.prototype.getFolderPathHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getFolderPathClassName(),
      '" style="-webkit-user-select: none;"></div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.view.baseview.View.prototype.getFolderPathElement = function() {
  var el = this.getHeadContainerElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};


/**
 * @return {string}
 */
good.drive.view.baseview.View.prototype.getFolderPathClassName = function() {
  return this.getConfig().cssPathContainer;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.baseview.View.prototype.getScrollContainerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getScrollContainerClassName(),
      '">',
      '<div class="',
      this.getConfig().cssSidePanel,
      '"></div>',
      '<div class="',
      this.getConfig().cssEmptyView,
      '"></div>',
      this.getGridViewHtml(),
      '</div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.view.baseview.View.prototype.getScrollContainerElement = function() {
  var el = this.getInnerElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};


/**
 * @return {string}
 */
good.drive.view.baseview.View.prototype.getScrollContainerClassName =
  function() {
  return this.getConfig().cssRoot + '-' + this.
  getConfig().cssScrollContainerHtml;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.baseview.View.prototype.getGridViewHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getGridViewClassName(),
      '" tabindex="0">',
      this.getGridContainerHtml(),
      '</div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.view.baseview.View.prototype.getGridViewElement = function() {
  var el = this.getScrollContainerElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};

/**
 * @param {boolean} isRemote
 */
good.drive.view.baseview.View.prototype.setRemote = function(isRemote) {
  if (!this.isRemote) {
    var that = this;
    this.getHandler().
      listen(this.getElement(), goog.events.EventType.SCROLL, function(e) {
        var el = that.getElement();
        if (el == undefined) {
          return;
        }
        var hght = el.scrollHeight;
        var clientHeight = el.clientHeight;
        var top = el.scrollTop;
        if (top >= (parseInt(hght) - clientHeight)) {
          if (that.isEnd) {
            return;
          }
          that.scrollToEnd();
        }
    });
  }
  this.isRemote = isRemote;
};

/**
 */
good.drive.view.baseview.View.prototype.scrollToEnd = function() {
};

/**
 * @return {string}
 */
good.drive.view.baseview.View.prototype.getGridViewClassName = function() {
  return this.getConfig().cssGridView;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.baseview.View.prototype.getGridContainerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getGridContainerClassName(),
      '"></div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.view.baseview.View.prototype.getGridContainerElement = function() {
  var el = this.getGridViewElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};


/**
 * @return {string}
 */
good.drive.view.baseview.View.prototype.getGridContainerClassName = function() {
  return this.getConfig().cssGridContainer;
};

/**
 * @return {Object}
 */
good.drive.view.baseview.View.prototype.getKeyType = function() {
  return {LABEL: ['label', 'string']};
};

/**
 * @return {Object.<string, string>}
 */
good.drive.view.baseview.View.prototype.getConfig = function() {
  return good.drive.view.baseview.View.defaultConfig;
};

/**
 */
good.drive.view.baseview.View.defaultConfig = {
  cssRoot: goog.getCssName('doclistview'),
  cssInnerClass: goog.getCssName('inner'),
  cssEdge: goog.getCssName('doclist-scroll-edge'),
  cssPathContainer: goog.getCssName('folder-path-container') + ' ' +
      goog.getCssName('goog-container'),
  cssHeadContainerHtml: goog.getCssName('fixed-container'),
  cssScrollContainerHtml: goog.getCssName('scroll-container'),
  cssSidePanel: goog.getCssName('doclistview-side-panel'),
  cssEmptyView: goog.getCssName('doclistview-empty-view'),
  cssGridView: goog.getCssName('gridview-grid') + ' ' +
      goog.getCssName('doclistview-transitions') + ' ' +
      goog.getCssName('density-tiny'),
  cssGridContainer: goog.getCssName('gv-grid-inner') + ' ' +
      goog.getCssName('doclist-container'),
  cssCellRoot: goog.getCssName('goog-inline-block') + ' ' +
      goog.getCssName('gv-doc'),
  cssCellImage: goog.getCssName('gv-image') + ' ' +
      goog.getCssName('gv-no-border'),
  cssCellLabel: goog.getCssName('doclist-gv-name-container'),
  cssCellImageContainer: goog.getCssName('gv-image-container'),
  cssCellHover: goog.getCssName('gv-doc-hovered'),
  cssTableContainer: goog.getCssName('doclist-container'),
  cssTableView: goog.getCssName('doclistview-list') + ' ' +
  goog.getCssName('doclistview-transitions') + ' ' +
  goog.getCssName('density-tiny'),
  cssTableRoot: goog.getCssName('doclist-table'),
  cssTableHead: goog.getCssName('doclist-table-thead'),
  cssTableHeadtr: goog.getCssName('doclist-header'),
  cssTableBody: goog.getCssName('doclist-tbody'),
  cssTableCellRoot: goog.getCssName('doclist-tr') + ' ' +
    goog.getCssName('doclist-tr-active') + ' ' +
    goog.getCssName('doclist-tr-underlined'),
  cssTablehover: goog.getCssName('doclist-tr-hover')
};
