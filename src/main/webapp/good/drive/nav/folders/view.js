'use strict';
goog.provide('good.drive.nav.folders');

goog.require('good.drive.nav.folders.ViewControl');
goog.require('goog.events.KeyHandler');
goog.require('goog.fx.DragDropGroup');
goog.require('goog.fx.DragDropItem');
goog.require('goog.string.StringBuffer');
goog.require('goog.ui.tree.BaseNode');
goog.require('goog.ui.tree.TreeControl');

/**
 * Tree结构的封装
 * @constructor
 * @param {string} title
 * @param {string} docid
 * @param {Element} targetElm
 * @param {good.drive.nav.folders.ViewControl} control
 */
good.drive.nav.folders.Tree = function(title, docid, targetElm, control) {
  var that = this;
  if (control == undefined) {
    control = new good.drive.nav.folders.ViewControl(docid);
  }
  this.control_ = control;
  this.control_.setView(this);
  this.control_.setTitle(title);
  var root = new goog.ui.tree.TreeControl('',
      good.drive.nav.folders.Tree.defaultConfig);
  root.render(targetElm);
  root.setShowRootLines(false);
  root.setShowRootNode(false);
  root.setShowLines(false);
  var tree_ = root.getTree().createNode(
      '<span class="treedoclistview-root-node-name">' +
      title + '&nbsp;</span>');
  root.add(tree_);
  tree_.setExpanded(false);
  this.roottree = root;
  this.tree = tree_;
  var dragDropGroup = new goog.fx.DragDropGroup();
  this.dragDropGroup = dragDropGroup;
//  this.customNode(tree_);
  this.currentItem_ = undefined;
};


/**
 * 插入一个节点
 * @param {goog.ui.tree.TreeControl} parent
 * @param {good.realtime.CollaborativeMap} data
 * @param {string} title
 * @return {goog.ui.tree.TreeNode}
 */
good.drive.nav.folders.Tree.prototype.insertNode =
    function(parent, data, title) {
  var childNode = parent.getTree().createNode('');
  parent.addChild(childNode);
  if (goog.dom.classes.has(parent.getExpandIconElement(),
      'treedoclistview-expand-icon-hidden')) {
    goog.dom.classes.remove(parent.getExpandIconElement(),
    'treedoclistview-expand-icon-hidden');
  }
  this.setNodeTitle(childNode, data, title);
  if (parent.getExpanded()) {
    this.customNode(childNode, data);
  }
  return childNode;
};

/**
 * 用于便捷添加tree change事件
 * @param {Function} handle
 */
good.drive.nav.folders.Tree.prototype.changeHandle = function(handle) {
  this.roottree.getHandler().
      listen(this.roottree, goog.events.EventType.CHANGE, handle);
};

/**
 * 判断一个节点是否处于展开状态
 * @param {goog.ui.tree.TreeControl} node
 * @return {boolean}
 */
good.drive.nav.folders.Tree.prototype.hasExtended = function(node) {
  return node.getExpanded();
};

/** 展开一个节点 */
good.drive.nav.folders.Tree.prototype.extended =
    function() {
  var selected = this.getCurrentItem();
  if (this.hasExtended(selected)) {
    return;
  }
  selected.setExpanded(true);
};

/**
 * 设置此选项可以让View受path的控制
 * @param {good.realtime.CollaborativeList} pathlist
 * @param {good.realtime.CollaborativeMap} pathroot
 * @param {Function} callback
 */
good.drive.nav.folders.Tree.prototype.initPath =
  function(pathlist, pathroot, callback) {
  var that = this;
  this.changeHandle(function(e) {
    if (that.getCurrentItem() != null) {
      callback(that.control().model().docId());
    }
    that.control().buildPath(pathlist, pathroot);
  });
};

/**
 * 取消Tree 让其处于无选中状态
 */
good.drive.nav.folders.Tree.prototype.recovery = function() {
  this.roottree.setSelectedItem(null);
};

/**
 * 通过pahtlist定位到一个具体的节点上
 * @param {good.realtime.CollaborativeList} pathlist
 */
good.drive.nav.folders.Tree.prototype.location = function(pathlist) {
  this.control().locationNode(this.roottree, pathlist);
};

/**
 * 获取当前选中的Item
 * @return {goog.ui.tree.TreeControl}
 */
good.drive.nav.folders.Tree.prototype.getCurrentItem = function() {
  return this.roottree.getSelectedItem();
};

/**
 * 设置节点的Title
 * @param {goog.ui.tree.TreeControl} node
 * @param {good.realtime.CollaborativeMap} data
 * @param {string} title
 */
good.drive.nav.folders.Tree.prototype.setNodeTitle =
    function(node, data, title) {
  var sb = new goog.string.StringBuffer();
  var folderclass = this.getFolderIcon(data);
  sb.append(goog.dom.createDom('span',
      {'class': 'goog-inline-block treedoclistview-init-spacing'},
      ' ').outerHTML);
  sb.append(goog.dom.createDom('span',
      {'class': 'goog-inline-block treedoclistview-node-icon' +
      ' drive-sprite-folder-list-icon ' +
      folderclass}, ' ').outerHTML);
  sb.append(goog.dom.createDom('span',
      {'class': 'goog-inline-block treedoclistview-spacing'},
      ' ').outerHTML);
  var titleElm = goog.dom.createDom('span',
      {'class': 'treedoclistview-node-name'},
      goog.dom.createDom('span', {'dir': 'ltr', 'title': title}, title));
  node.setHtml(sb.toString() + titleElm.outerHTML);
  node.title = title;
};

/**
 * 生产节点的图标
 * @param {good.realtime.CollaborativeMap} data
 * @return {string}
 */
good.drive.nav.folders.Tree.prototype.getFolderIcon =
  function(data) {
  var isclass = data.get('isclass');
  if (isclass == undefined) {
    return 'icon-color-1';
  }
  return isclass ? 'icon-color-6' : 'icon-color-1';
};

/**
 * 设置tree的数据 会自动解析 然后加载
 * @param {good.realtime.CollaborativeMap} data
 */
good.drive.nav.folders.Tree.prototype.setData = function(data) {
  this.control().mappingView(this, data);
};

/**
 * 自定义一个节点
 * @param {goog.ui.tree.TreeControl} tree
 * @param {Object} data
 */
good.drive.nav.folders.Tree.prototype.customNode =
    function(tree, data) {
  tree.setAfterLabelHtml('<div class="selection-highlighter"></div>');
  tree.addChildAt = function(child, index,
      opt_render) {
    goog.asserts.assert(!child.getParent());
    var prevNode = this.getChildAt(index - 1);
    var nextNode = this.getChildAt(index);
    goog.ui.tree.BaseNode.superClass_.addChildAt.call(this, child, index);
    child.previousSibling_ = prevNode;
    child.nextSibling_ = nextNode;
    if (prevNode) {
      prevNode.nextSibling_ = child;
    } else {
      this.firstChild_ = child;
    }
    if (nextNode) {
      nextNode.previousSibling_ = child;
    } else {
      this.lastChild_ = child;
    }
    var tree = this.getTree();
    if (tree) {
      child.setTreeInternal(tree);
    }
    child.setDepth_(this.getDepth() + 1);
    if (this.getElement()) {
      this.updateExpandIcon();
      if (this.getExpanded()) {
        var el = this.getChildrenElement();
        if (!child.getElement()) {
          child.createDom();
        }
        var childElement = child.getElement();
        var nextElement = nextNode && nextNode.getElement();
        el.insertBefore(childElement, nextElement);

        if (this.isInDocument()) {
          child.enterDocument();
        }
        if (!nextNode) {
          if (prevNode) {
          } else {
            goog.style.setElementShown(el, true);
            this.setExpanded(this.getExpanded());
          }
        }
      }
    }
  };
  tree.removeChild =
      function(childNode, opt_unrender) {
    var child = /** @type {goog.ui.tree.BaseNode} */ (childNode);
    var tree = this.getTree();
    var selectedNode = tree ? tree.getSelectedItem() : null;
    if (selectedNode == child || child.contains(selectedNode)) {
      if (tree.hasFocus()) {
        this.select();
        goog.Timer.callOnce(this.onTimeoutSelect_, 10, this);
      } else {
        this.select();
      }
    }
    goog.ui.tree.BaseNode.superClass_.removeChild.call(this, child);
    if (this.lastChild_ == child) {
      this.lastChild_ = child.previousSibling_;
    }
    if (this.firstChild_ == child) {
      this.firstChild_ = child.nextSibling_;
    }
    if (child.previousSibling_) {
      child.previousSibling_.nextSibling_ = child.nextSibling_;
    }
    if (child.nextSibling_) {
      child.nextSibling_.previousSibling_ = child.previousSibling_;
    }
    var wasLast = child.isLastSibling();
    child.tree_ = null;
    child.depth_ = -1;
    if (tree) {
      // Tell the tree control that this node is now removed.
      tree.removeNode(this);
      if (this.isInDocument()) {
        var el = this.getChildrenElement();
        if (child.isInDocument()) {
          var childEl = child.getElement();
          el.removeChild(childEl);
          child.exitDocument();
        }
        if (wasLast) {
          var newLast = this.getLastChild();
        }
        if (!this.hasChildren()) {
          el.style.display = 'none';
          this.updateExpandIcon();
          this.updateIcon_();
        }
      }
    }
    return child;
  };
  tree.onMouseDown = function(e) {
    var el = e.target;
    // expand icon
    var type = el.getAttribute('type');
    if (type == 'expand') {
      if (this.isUserCollapsible_) {
        this.toggle();
      }
      return;
    }

    this.select();
    this.updateRow();
  };
  var rowElement = tree.getRowElement();
  var expandIconElement = tree.getExpandIconElement();
  if (data.get('folders').length() > 0) {
    goog.dom.classes.remove(expandIconElement,
        'treedoclistview-expand-icon-hidden');
  }
  var that = this;
  var item = new goog.fx.DragDropItem(rowElement,
      data != undefined ? data : undefined);
  this.dragDropGroup.addDragDropItem(item);
  goog.events.
      listen(rowElement, goog.events.EventType.MOUSEOVER, function(e) {
    if (!goog.dom.classes.has(rowElement,
        good.drive.nav.folders.Tree.defaultConfig.cssHoverRow)) {
      goog.dom.classes.add(rowElement,
          good.drive.nav.folders.Tree.defaultConfig.cssHoverRow,
          good.drive.nav.folders.Tree.defaultConfig.cssAccessible);
    }
  });
  goog.events.
      listen(rowElement, goog.events.EventType.MOUSEOUT, function(e) {
    if (goog.dom.classes.has(rowElement,
        good.drive.nav.folders.Tree.defaultConfig.cssHoverRow)) {
      goog.dom.classes.remove(rowElement,
          good.drive.nav.folders.Tree.defaultConfig.cssHoverRow,
          good.drive.nav.folders.Tree.defaultConfig.cssAccessible);
    }
  });
  tree.getRowClassName = function() {
    var selectedClass;
    if (this.isSelected()) {
      selectedClass = ' ' + this.config_.cssSelectedRow + ' ' +
          good.drive.nav.folders.Tree.defaultConfig.cssHoverRow + ' ' +
          good.drive.nav.folders.Tree.defaultConfig.cssAccessible;
    } else {
      selectedClass = '';
    }
    return this.config_.cssTreeRow + selectedClass;
  };
};

/**
 * 根据一个索引删除一个节点
 * @param {goog.ui.tree.TreeControl} parent
 * @param {number} idx
 * @return {goog.ui.tree.TreeControl}
 */
good.drive.nav.folders.Tree.prototype.removeNode = function(parent, idx) {
  return parent.removeChildAt(idx);
};

/**
 * @param {Object} data
 */
good.drive.nav.folders.Tree.prototype.moveToNode = function(data) {
  var item = this.getCurrentItem();
  this.control().moveToNode(item.map, data);
};

/**
 * 根据一个Object对象读取该对象中的字段添加到这棵树中
 * @param {Object} param
 */
good.drive.nav.folders.Tree.prototype.addLeaf = function(param) {
  var selected = this.getCurrentItem();
  selected.setExpanded(true);
  this.control().addLeaf(selected, param);
};

/**
 * 根据str修改当前选中节点中的title
 * @param {Object} str
 */
good.drive.nav.folders.Tree.prototype.renameLeaf = function(str) {
  var selected = this.getCurrentItem();
  this.control().renameLeaf(selected.getParent(),
      this.getIndexByChild(selected), str);
};

/** 删除节点 */
good.drive.nav.folders.Tree.prototype.removeLeaf = function() {
  var selected = this.getCurrentItem();
  this.control().removeLeaf(selected.getParent(),
      this.getIndexByChild(selected));
};

/**
 * 根据节点获取该节点的索引
 * @param {goog.ui.tree.TreeControl} node
 * @return {integer}
 */
good.drive.nav.folders.Tree.prototype.getIndexByChild = function(node) {
  var id = node.getId();
  var parent = node.getParent();
  var childIds = parent.getChildIds();
  var index = goog.array.indexOf(childIds, id);
  return index;
};

/**
 * 获取Control
 * @return {good.drive.nav.folders.ViewControl}
 */
good.drive.nav.folders.Tree.prototype.control = function() {
  return this.control_;
};

/**
 * 设置是否支持拖拽
 */
good.drive.nav.folders.Tree.prototype.setDraggable = function() {
  var dragDropGroup = this.dragDropGroup;
  dragDropGroup.createDragElement =
    function(sourceEl) {
    var data = this.dragItem_.data;
    return goog.dom.createDom('div',
        {'class': 'doclist-dragdrop-drag doclist-drag-unmodified'},
        goog.dom.createDom('div',
            {'class': 'goog-inline-block doclist-name doclist-drag-move'},
            data.get('label')),
            goog.dom.createDom('div',
                {'class': 'goog-inline-block doclist-name doclist-drag-add'},
                data.get('label')));
  };
  this.dragDropGroup.init();
  this.dragDropGroup.addTarget(this.dragDropGroup);
  var that = this;
  var dragdropHandle = function(event) {
    goog.style.setOpacity(event.dragSourceItem.element, 1);
    var item = that.getCurrentItem();
    if (item.getId() == that.tree.getId()) {
      return;
    }
    var path = good.drive.nav.folders.Path.getINSTANCE();
    var dragdrop = path.root.get(path.pathNameType().DRAGDROP);
    if (event.dropTargetItem == undefined) {
      var dragData = event.dragSourceItem.data;
      dragdrop.set(path.pathNameType().DRAGDATA, dragData.getId());
      dragdrop.set(path.pathNameType().DRAGTARGET,
          item.getParent().map.get('folders').getId());
      dragdrop.set(path.pathNameType().DRAGDOCID,
          that.control().model().docId());
    } else {
      var dropData = event.dropTargetItem.data;
      if (dropData == undefined) {
        dropData = that.tree.map;
      }
      if ((event.dragSourceItem.data.get('isclass') &&
          dropData.get('isclass')) ||
          (!event.dragSourceItem.data.get('isclass') &&
              dropData.get('isclass'))) {
        return;
      }
      dragdrop.set(path.pathNameType().DROPDATA,
          dropData.getId());
      dragdrop.set(path.pathNameType().DROPTARGET,
          dropData.get('folders').getId());
      dragdrop.set(path.pathNameType().DROPDOCID,
          that.control().model().docId());
      dragdrop.set(path.pathNameType().ISDRAGOVER,
          1);
      dragDropGroup.removeItem(
          event.dropTargetItem.getDraggableElements());
    }
  };
  goog.events.listen(this.dragDropGroup, 'drop', dragdropHandle);
  goog.events.listen(this.dragDropGroup, 'dragstart', dragdropHandle);
};

/** */
good.drive.nav.folders.Tree.defaultConfig = {
  indentWidth: 19,
  cssRoot: goog.getCssName('goog-tree-root') + ' ' +
      goog.getCssName('goog-tree-item'),
  cssHideRoot: goog.getCssName('goog-tree-hide-root'),
  cssItem: goog.getCssName('goog-tree-item'),
  cssChildren: goog.getCssName('goog-tree-children'),
  cssChildrenNoLines: goog.getCssName('goog-tree-children-nolines'),
  cssTreeRow: goog.getCssName('goog-tree-row'),
  cssItemLabel: goog.getCssName('goog-tree-item-label'),
  cssTreeIcon: goog.getCssName(''),
  cssExpandTreeIcon: goog.getCssName(''),
  cssExpandTreeIconPlus: goog.getCssName('goog-inline-block') + ' ' +
      goog.getCssName('doclist-icon navpane-expand-icon') + ' ' +
      goog.getCssName('doclist-folder-triangle-collapsed'),
  cssExpandTreeIconMinus: goog.getCssName('goog-inline-block') + ' ' +
      goog.getCssName('doclist-icon navpane-expand-icon') + ' ' +
      goog.getCssName('doclist-folder-triangle-expanded'),
  cssExpandTreeIconTPlus: goog.getCssName(
      'goog-tree-expand-icon-tplus'),
  cssExpandTreeIconTMinus: goog.getCssName(
      'goog-tree-expand-icon-tminus'),
  cssExpandTreeIconLPlus: goog.getCssName('goog-tree-expand-icon-lplus'),
  cssExpandTreeIconLMinus: goog.getCssName('goog-tree-expand-icon-lminus'),
  cssExpandTreeIconT: goog.getCssName(
      'goog-tree-expand-icon-t'),
  cssExpandTreeIconL: goog.getCssName('goog-tree-expand-icon-l'),
  cssExpandTreeIconBlank: goog.getCssName(
      'goog-inline-block doclist-icon navpane-expand-icon') + ' ' +
      goog.getCssName('doclist-folder-triangle-collapsed') + ' ' +
      goog.getCssName('treedoclistview-expand-icon-hidden'),
  cssExpandedFolderIcon: goog.getCssName(
      'goog-tree-icon goog-tree-expanded-folder-icon'),
  cssCollapsedFolderIcon: goog.getCssName('goog-tree-icon') + ' ' +
      goog.getCssName('goog-tree-collapsed-folder-icon'),
  cssFileIcon: goog.getCssName(
      'goog-tree-icon goog-tree-collapsed-folder-icon'),
  cssExpandedRootIcon: goog.getCssName(
      'goog-tree-expanded-folder-icon'),
  cssCollapsedRootIcon: goog.getCssName(
      'goog-tree-collapsed-folder-icon'),
  cssSelectedRow: goog.getCssName('goog-tree-row-activated'),
  cssHoverRow: goog.getCssName('goog-tree-row-hover'),
  cssAccessible: goog.getCssName('goog-tree-row-accessible-selected')
};

