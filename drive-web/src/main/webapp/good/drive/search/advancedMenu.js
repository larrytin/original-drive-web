'use strict';
goog.provide('good.drive.search');

goog.require('good.constants');
goog.require('good.drive.nav.grid');
goog.require('good.drive.search.rigthmenu');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.Popup');
goog.require('goog.ui.PopupMenu');

/**
 * @constructor
 */
good.drive.search.AdvancedMenu = function() {

  var search_input = goog.dom.getElement('search_input');

  var input_text = goog.dom.getElement('gbqfq');

  var search_btn = goog.dom.getElement('gbqfb');

  var popupElt = goog.dom.getElement('search_menu');

  var pop = new goog.ui.PopupMenu();
  popupElt.style.minWidth = '509px';

  var grid = good.drive.search.AdvancedMenu.SEARCHGRID;
  if (grid == undefined) {
    grid = new good.drive.nav.grid.View();
    grid.render(goog.dom.getElement('viewmanager'));
    good.drive.search.AdvancedMenu.SEARCHGRID = grid;
    good.drive.nav.grid.View.visiable(grid);
  }  
  this._typeArray = good.constants.TYPEARRAY;
  this._fieldArray = good.constants.FIELDARRAY;
  this._gradeArray = good.constants.GRADEARRAY;
  this._pop = pop;
  this._search_input = search_input;
  this._input_text = input_text;
  this._search_btn = search_btn;
};

/** @type {good.drive.nav.grid} */
good.drive.search.AdvancedMenu.SEARCHGRID = undefined;

/**
 *
 */
good.drive.search.AdvancedMenu.prototype.init = function() {
  this.createPopMenu();
  this.popaction();
  this.clearAction();
  this.inputAction();
  this.searchbtncick();
};


/**
 *
 */
good.drive.search.AdvancedMenu.prototype.createPopMenu = function() {
  var btn = goog.dom.getElement('advanced-search-button-container');
  var popupElt = goog.dom.getElement('search_menu');

  popupElt.style.minWidth = '509px';
  this._pop.decorateContent = function(element) {
    var renderer = this.getRenderer();
    var contentElements = this.getDomHelper().
    getElementsByTagNameAndClass('div',
        goog.getCssName(renderer.getCssClass(), 'vertical'), element);

    // Some versions of IE do not like it when you access this nodeList
    // with invalid indices. See
    // http://code.google.com/p/closure-library/issues/detail?id=373
    var length = contentElements.length;
    for (var i = 0; i < length; i++) {
      renderer.decorateChildren(this, contentElements[i]);
    }
  };

  this._pop.setToggleMode(true);
  this._pop.decorate(popupElt);

  this._pop.attach(
      btn,
      goog.positioning.Corner.BOTTOM_RIGHT,
      goog.positioning.Corner.TOP_RIGHT);
};

/**
 *
 */
good.drive.search.AdvancedMenu.prototype.popaction = function() {
  var that = this;
  goog.events.listen(this._pop, 'action', function(e) {
    var title = e.target.element_.innerText;
    title = that.trim(title);
    that.createCondition(title);
    that.inputstyle();
    that.search();
  });
};


/**
 * @param {string} title
 */
good.drive.search.AdvancedMenu.prototype.createCondition = function(title) {
  var that = this;
  if (title != null && title != '') {
    if (title != '类型' && title != '领域' && title != '年级') {
      var div = goog.dom.createDom('div',
          {'class': 'goog-inline-block filter-chip',
            'title': '在' +
            title +
            '过滤器。使用退格或 Delete 键可以删除'},null);
      var span_title = goog.dom.createDom('span',
          {'class': 'goog-inline-block filter-chip-label'},
          title);
      var span_clean = goog.dom.createDom('span',
          {'class': 'goog-inline-block filter-chip-x'},'×');
      div.appendChild(span_title);
      div.appendChild(span_clean);

      var array = that.getArray(title);
      var index = that.ishave(array);

      if (index == -1) {
        that._search_input.appendChild(div);
      } else {
        var oldNode = that._search_input.children[index];
        goog.dom.replaceNode(div, oldNode);
      }
      goog.events.listen(span_clean,
          goog.events.EventType.CLICK, function(e) {
        goog.dom.removeNode(e.target.parentElement);
        that.inputstyle();
        that.search();
      });
    }
  }
};

/**
 *
 */
good.drive.search.AdvancedMenu.prototype.clearAction = function() {
  var that = this;
  var clear_container = goog.dom.
  getElement('search-input-clear-container');
  goog.events.listen(clear_container,
      goog.events.EventType.CLICK, function(e) {
    goog.dom.removeChildren(that._search_input);
    that._input_text.value = '';
    that.inputstyle();
  });
};

/**
 * @param {Array} array
 * @return {number}
 */
good.drive.search.AdvancedMenu.prototype.ishave = function(array) {
  if (this._search_input.children.length != 0) {
    for (var i = 0; i < this._search_input.children.length; i++) {
      var child = this._search_input.children[i];
      var spantext = child.children[0].innerText;
      if (goog.array.contains(array, spantext)) {
        return i;
      }
    }
  }
  return -1;
};

/**
 * @param {string} str
 * @return {Array.<string>}
 */
good.drive.search.AdvancedMenu.prototype.getArray = function(str) {
  if (goog.array.contains(this._typeArray, str)) {
    return this._typeArray;
  } else if (goog.array.contains(this._fieldArray, str)) {
    return this._fieldArray;
  } else {
    return this._gradeArray;
  }
};

/**
 *
 */
good.drive.search.AdvancedMenu.prototype.inputstyle = function() {
  var input_div = goog.dom.getElement('gbqfqwb');
  var input = this.trim(this._input_text.value);
  var clear_container = goog.dom.
  getElement('search-input-clear-container').children[0];

  if (this._search_input.children.length === 0) {
      input_div.style.left = '1px';
      input_div.style.width = '471px';
      if (input == null || input == '') {
        clear_container.style.display = 'none';
      } else {
        clear_container.style.display = 'block';
      }
   } else {
       if (this._search_input.children.length === 1) {
         input_div.style.left = '51px';
         input_div.style.width = '401px';
       } else if (this._search_input.children.length === 2) {
         input_div.style.left = '101px';
         input_div.style.width = '351px';
       } else if (this._search_input.children.length === 3) {
         input_div.style.left = '151px';
         input_div.style.width = '301px';
       }
      clear_container.style.display = 'block';
  }
};

/**
 *
 */
good.drive.search.AdvancedMenu.prototype.inputAction = function() {
  var that = this;
  var DOM_EVENTS = ['keydown', 'keyup', 'keypress', 'change', 'cut', 'paste',
                    'drop', 'input'];
  goog.events.listen(that._input_text, DOM_EVENTS, function(e) {
    that.inputstyle();
  });
};

/**
 * @param {string} str
 * @return {string}
 */
good.drive.search.AdvancedMenu.prototype.trim = function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
};


/**
 * @param {string} search_type
 */
good.drive.search.AdvancedMenu.prototype.search = function(search_type) {
  var that = this;
  
  var contentType = undefined;
  var tags = new Array();
  if (that._search_input.children.length != 0) {
    for (var i = 0; i < this._search_input.children.length; i++) {
      var child = that._search_input.children[i];
      var spantext = child.children[0].innerText;
      if (goog.array.contains(this._typeArray, spantext)) {
        contentType = good.constants.TYPE[spantext];
      } else if (goog.array.contains(this._fieldArray, spantext) ||
          goog.array.contains(this._gradeArray, spantext)) {
        goog.array.insert(tags, spantext);
      }
    }
  }

    var inputval = that._input_text.value;

    //组织查询条件
    var path = 'search';
    var flag = false;
    if (contentType != undefined) {
      path = path + '?contentType=' + contentType;
      flag = true;
    }
    if (!goog.array.isEmpty(tags)) {
      goog.array.forEach(tags, function(e) {
        if (flag) {
          path = path + '&tags=' + encodeURIComponent(e);
          flag = true;
        } else {
          path = path + '?tags=' + encodeURIComponent(e);
          flag = true;
        }
      });
    }

    if (inputval != null && inputval != '') {
      if (flag) {
        path = path + '&filename=' + encodeURIComponent(inputval);
        flag = true;
      } else {
        path = path + '?filename=' + encodeURIComponent(inputval);
        flag = true;
      }
    }

    if (flag) {
      path = path + '&limit=10';
    } else {
      path = path + '?limit=10';
    }

    var grid = good.drive.search.AdvancedMenu.SEARCHGRID;
    grid.clear();
    if (search_type == undefined && path == 'search?limit=10') {
      return;
    } else {
    //连接服务器查询
      var rpc = new good.net.CrossDomainRpc('GET',
          good.constants.NAME,
          good.constants.VERSION, path,
          good.constants.SERVERADRESS);
      rpc.send(function(json) {
        //填充网格数据
        if (json && !json['error']) {
          if (json['items'] != undefined) {
            goog.array.forEach(json['items'], function(item) {
              
              if (item['thumbnail'] != undefined) {
                if(good.constants.DRIVE_SERVER.indexOf('.googow.com') == -1){                  
                  var uri_server = new goog.Uri(good.constants.DRIVE_SERVER);
                  var uri = new goog.Uri(item['thumbnail']);
                  uri.setDomain(uri_server.getDomain());        
                  uri.setScheme(uri_server.getScheme());
                  uri.setScheme(uri_server.getScheme());
                  uri.setPort(uri_server.getPort());
                  item['thumbnail'] = uri.toString() + '=s100'; 
                }
              }            
              var cell = grid.createCell(item);
              cell.getLabelData = function(data) {
                return data.filename;
              };
              /*cell.getImageData = function(data) {
                return data.thumbnail;
              };*/
              grid.add(cell);
              cell.renderCell();
            });
            good.drive.nav.grid.View.visiable(grid);
          }
        }
      });
    }
};


/**
 *
 */
good.drive.search.AdvancedMenu.prototype.searchbtncick = function() {
  var that = this;
  goog.events.listen(that._search_btn,
      goog.events.EventType.CLICK, function(e) {
    that.search('click');
  });
};
