'use strict';
goog.provide('good.drive.view.grid.GridCell');

goog.require('good.drive.view.baseview.Cell');

/**
 * @param {good.realtime.CollaborativeMap} data
 * @param {Object} keytype
 * @param {Object} defaultConfig
 * @param {goog.dom.DomHelper=} opt_domHelper
 * @constructor
 * @extends {good.drive.view.baseview.Cell}
 */
good.drive.view.grid.GridCell =
  function(data, keytype, defaultConfig, opt_domHelper) {
  good.drive.view.baseview.Cell.call(this,
      data, keytype, defaultConfig, opt_domHelper);
  this.bindHandle(data);
  var createImage = undefined;
};
goog.inherits(good.drive.view.grid.GridCell, good.drive.view.baseview.Cell);


/** @override */
good.drive.view.grid.GridCell.prototype.renderCell = function() {
  var label = this.getLabelData(this.data);
  var labelElm = goog.dom.createDom('div',
      {'class': 'gv-view-name  dir=ltr'},
      goog.dom.createDom('div', {'dir': 'ltr'}, label));
  this.setLabel(labelElm);
  if(!this.createImage) {
    var imageData = this.getImageData(this.data);
    goog.dom.appendChild(this.getImageCheckElement(), imageData);
    this.createImage = true;
  }
  
};

/**
 * @param {Object} data
 * @return {Element}
 */
good.drive.view.grid.GridCell.prototype.getImageData =
  function(data) {
  var imageFolder = null;
  if (data instanceof good.realtime.CollaborativeMap) {
    if (data.get('isfile') != undefined) {
      if (data.get('thumbnail') != null) {
        return goog.dom.createDom('img', {
          'class' : 'gv-image-el',
          'src' : data.get('thumbnail')
        });
      } else if (data.get('type') == 'audio/mp3') {
        return goog.dom.createDom('img', {
          'class' : 'gv-image-el',
          'src' : './good/images/icon_10_audio_xl128.png'
        });
      } else {
        return goog.dom.createDom('img', {
          'class' : 'gv-image-el',
          'src' : './good/images/icon_10_generic_xl128.png'
        });
      }
    }
  } else {
    if (data['thumbnail'] != undefined) {
      return goog.dom.createDom('img', {
        'class' : 'gv-image-el',
        'src' : data['thumbnail'] + '=s218'
      });
    } else if (data.contentType == 'audio/mp3') {
      return goog.dom.createDom('img', {
        'class' : 'gv-image-el',
        'src' : './good/images/icon_10_audio_xl128.png'
      });
    } else {
      return goog.dom.createDom('img', {
        'class' : 'gv-image-el',
        'src' : './good/images/icon_10_generic_xl128.png'
      });
    }

  }
  if (data.get('isclass') == true) {
     imageFolder = goog.dom.createDom('div',
         {'class': 'gv-image-el drive-sprite-folder-grid-shared-icon'});
  } else {
     imageFolder = goog.dom.createDom('div',
         {'class': 'gv-image-el drive-sprite-folder-grid-icon'});
  }
  return goog.dom.createDom('div',
      {'class': 'doclist-gv-thumb-container' +
  ' doclist-gv-thumb-folder'}, imageFolder);
};

/**
 * @param {Object} data
 * @return {string}
 */
good.drive.view.grid.GridCell.prototype.getLabelData = function(data) {
  if (data instanceof good.realtime.CollaborativeMap) {
    return data.get(this.keytype.LABEL[0]);
  }
  return data.filename;
};


/**
 * @param {Object} data
 */
good.drive.view.grid.GridCell.prototype.bindHandle = function(data) {
  var that = this;
  if (data instanceof good.realtime.CollaborativeMap) {
    data.addValueChangedListener(function(evt) {
      var property = evt.getProperty();
      if (property != 'label') {
        return;
      }
      var newValue = evt.getNewValue();
      var oldValue = evt.getOldValue();
      if (oldValue == null) {
        return;
      }
      that.renderCell();
    });
  }
};

/**
 * @return {Element}
 */
good.drive.view.grid.GridCell.prototype.getCheckbox = function() {
  return this.getCheckBoxElement();
};

/**
 * @override
 */
good.drive.view.grid.GridCell.prototype.getCheckStyle = function() {
  good.drive.view.grid.GridCell.superClass_.getCheckStyle.call(this);
  var rootElement = this.getElement();
  if (!goog.dom.classes.has(rootElement, 'gv-active')) {
    goog.dom.classes.remove(rootElement, 'gv-doc');
    goog.dom.classes.add(rootElement, 'gv-active');
    goog.dom.classes.add(rootElement, 'gv-doc-selected');
  } else {
    goog.dom.classes.remove(rootElement, 'gv-doc-selected');
    goog.dom.classes.remove(rootElement, 'gv-active');
    goog.dom.classes.add(rootElement, 'gv-doc');
  }
};
/** @override */
good.drive.view.grid.GridCell.prototype.toHtml = function(sb) {
  sb.append('<div class="',
      this.defaultConfig.cssCellRoot, '" id="', this.getId(), '">',
      '<div><div class="gv-dynamic-thumbnail"',
      ' style="width: 230px; height: 237px">',
      this.getImageHtml(), this.getLabelHtml(), '</div></div></div>');
};

/**
 * @return {Element}
 */
good.drive.view.grid.GridCell.prototype.getThumbnailElement = function() {
  var el = this.getElement();
  return el ? /** @type {Element} */ (el.firstChild.firstChild) : null;
};

/**
 * @return {Element}
 */
good.drive.view.grid.GridCell.prototype.getImageBottonElement = function() {
  var el = this.getImageElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.grid.GridCell.prototype.getImageHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="', this.getImageClassName(),
      '" style="width: 230px;height:213px;">',
      '<div class="gv-view-bottom" style="width:230px;">' +
      '<div class="gv-view-center">',
      '<div class="gv-selection">', this.getImageContainerHtml(),
      '</div></div></div></div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.view.grid.GridCell.prototype.getImageElement = function() {
  var el = this.getThumbnailElement();
  return el ? /** @type {Element} */ (el.firstChild) : null;
};
/**
 * @override
 */
good.drive.view.grid.GridCell.prototype.getCheckImageElement = function() {
  return this.getImageCheckElement();
};


/**
 * @return {string}
 */
good.drive.view.grid.GridCell.prototype.getImageClassName = function() {
  return this.defaultConfig.cssCellImage;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.grid.GridCell.prototype.getImageContainerHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getImageContainerClassName(),
      '">' + this.getImageCheckHtml() + '</div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.view.grid.GridCell.prototype.getImageContainerElement = function() {
  var el = this.getImageBottonElement();
  return el ?
      /** @type {Element} */ (el.firstChild.firstChild.firstChild) :
      null;
};

/**
 * @return {string}
 */
good.drive.view.grid.GridCell.prototype.getImageContainerClassName =
  function() {
  return this.defaultConfig.cssCellImageContainer;
};

/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.grid.GridCell.prototype.getImageCheckHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<a class="gridview-thumbnail-link" ' +
      'target="_blank" rel="noreferrer">' + this.getCheckBoxHtml(),
      '</a>');
  return sb.toString();
};

/**
 * @return {Element}
 */
good.drive.view.grid.GridCell.prototype.getImageCheckElement = function() {
  var el = this.getImageContainerElement();
  return el ?
      /** @type {Element} */ (el.firstChild) :
        null;
};


/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.grid.GridCell.prototype.getCheckBoxHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="gv-checkbox goog-inline-block"',
  'style="width: 18px; height: 19px;">' +
  this.getCheckBoxSpanHtml(),
  '</div>');
  return sb.toString();
};

/**
 * @return {Element}
 */
good.drive.view.grid.GridCell.prototype.getCheckBoxElement = function() {
  var el = this.getImageCheckElement();
  return el ?
      /** @type {Element} */ (el.firstChild) : null;
};
/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.grid.GridCell.prototype.getCheckBoxSpanHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<span class="jfk-checkbox goog-inline-block ' +
  'jfk-checkbox-unchecked" role="checkbox" aria-checked="false" ' +
  ' tabindex="0" dir="ltr">' + this.getCheckBoxDivHtml(),
  '</span>');
  return sb.toString();
};

/**
 * @return {Element}
 */
good.drive.view.grid.GridCell.prototype.getCheckBoxSpanElement = function() {
  var el = this.getCheckBoxElement();
  return el ?
      /** @type {Element} */ (el.firstChild) : null;
};

/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.grid.GridCell.prototype.getCheckBoxDivHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="jfk-checkbox-checkmark"></div>');
  return sb.toString();
};

/**
 * @return {goog.string.StringBuffer}
 */
good.drive.view.grid.GridCell.prototype.getLabelHtml = function() {
  var sb = new goog.string.StringBuffer();
  sb.append('<div class="',
      this.getLabelClassName(),
      '"></div>');
  return sb.toString();
};


/**
 * @return {Element}
 */
good.drive.view.grid.GridCell.prototype.getLabelElement = function() {
  var el = this.getThumbnailElement();
  return el ? /** @type {Element} */ (el.lastChild) : null;
};


/**
 * @return {string}
 */
good.drive.view.grid.GridCell.prototype.getLabelClassName = function() {
  return this.defaultConfig.cssCellLabel;
};


/**
 * @param {Element} dom
 */
good.drive.view.grid.GridCell.prototype.setLabel = function(dom) {
//  goog.dom.removeChildren(this.getImageCheckElement());
  goog.dom.removeChildren(this.getLabelElement());
  goog.dom.appendChild(this.getLabelElement(), dom);
};
