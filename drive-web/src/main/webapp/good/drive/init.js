'use strict';
goog.provide('good.drive.init');

goog.require('good.auth');
goog.require('good.config');
goog.require('good.drive.nav.button');
goog.require('good.drive.nav.dialog');
goog.require('good.drive.nav.folders');
goog.require('good.drive.nav.menu');
goog.require('good.drive.nav.userinfo');
goog.require('goog.dom');
goog.require('good.drive.nav.button.Renderer');


/** */
good.drive.init.start = function() {
  good.auth.check();
  window.gdrOnLoad = function() {
    var createInput;
    var modifeInput;
    var contentcreationpane = goog.dom.getElement('contentcreationpane');
    var viewpanetoolbar = goog.dom.getElement('viewpane-toolbar');

    good.config.start();
    var auth = good.auth.Auth.current;
    good.realtime.authorize(auth.userId, auth.access_token);

    var tree = new good.drive.nav.folders.Tree();

    var label = goog.dom.createDom('div', {
      'class' : 'goog-inline-block jfk-button-caption'
    }, '创建');
    var empty = goog.dom.createDom('div', {
      'class' : 'goog-inline-block jfk-button-caption'
    }, ' ');
    var leftCreateBtn = new good.drive.nav.button.View([label, empty], contentcreationpane, [
      'jfk-button-primary', 'goog-toolbar-item-new']);

    var icon = goog.dom.createDom('div', {
      'class' : 'goog-inline-block jfk-button-caption'
    }, goog.dom.createDom('span', {
      'class' : 'drive-sprite-' +
          'core-upload upload-icon-position goog-inline-block'
    }));
    var leftUpdateBtn = new good.drive.nav.button.View([icon, empty], contentcreationpane, [
      'jfk-button-primary', 'jfk-button-narrow', 'goog-toolbar-item-upload']);
    
    var reander = good.drive.nav.button.Renderer.getInstance();
    reander.createDom = function(control) {
      var button = /** @type {goog.ui.Button} */ (control);
      var classNames = this.getClassNames(button);
      var attributes = {
        'class': goog.ui.INLINE_BLOCK_CLASSNAME + ' ' + classNames.join(' ')
      };
      var buttonElement = button.getDomHelper().createDom('div', attributes, button.getContent());
      this.setTooltip(
          buttonElement, /** @type {!string}*/ (button.getTooltip()));
      this.setAriaStates(button, buttonElement);

      return buttonElement;
    };
    
    icon = goog.dom.createDom('div', {'class': 'viewpane-toolbar-share-icon drive-sprite-core-share'})
    var toolbarCreateBtn = new  good.drive.nav.button.View(icon, viewpanetoolbar.firstElementChild, ['jfk-button-standard', 'goog-toolbar-item-share-button'], reander)

    icon = goog.dom.createDom('div', {'class': 'viewpane-toolbar-trash-icon drive-sprite-core-trash'})
    var toolbarDeleteBtn = new  good.drive.nav.button.View(icon, viewpanetoolbar.firstElementChild, ['jfk-button-standard', 'jfk-button-collapse-left', 'goog-toolbar-item-trash-button'], reander)
    
    icon = goog.dom.createDom('div', {'class': 'viewpane-toolbar-trash-icon drive-sprite-core-trash'})
    var toolbarMoreBtn = new  good.drive.nav.button.View(icon, viewpanetoolbar.firstElementChild, ['jfk-button-standard', 'jfk-button-collapse-left', 'goog-toolbar-item-trash-button'], reander)
    
    var dialog = new good.drive.nav.dialog.View();
    var createdialog = dialog.createFolderDialog(function(evt) {
      if (createInput == undefined) {
        createInput = goog.dom.getElement('crateFolder');
      }
      switch (evt.key) {
        case 'cr':
          tree.addLeaf(createInput.value);
          break;
        case 'c':
          break;
        default:
          break;
      }
    });

    var modifydialog = dialog.modifyFolderDialog(function(evt) {
      switch (evt.key) {
        case 'cr':
          tree.renameLeaf(modifeInput.value);
          break;
        case 'c':
          break;
        default:
          break;
      }
    });

    var menu = new good.drive.nav.menu.View();
    menu.createPopup(leftCreateBtn.getElement(), function(e) {
      switch (e.target.getId()) {
        case ':2':
          createdialog.setVisible(true);
          break;
        default:
          break;
      }
    });

    var leftSubmenuChildIds = undefined;
    var leftSubenu = menu.leftSubMenu(tree.tree.getElement(), function(e) {
      if (leftSubmenuChildIds == undefined) {
        leftSubmenuChildIds = leftSubenu.getChildIds();
      }
      switch (leftSubmenuChildIds.indexOf(e.target.getId())) {
        case 0:
          tree.extended();
          break;
        case 2:
          createdialog.setVisible(true);
          break;
        case 3:
          modifydialog.setVisible(true);
          if (modifeInput == undefined) {
            modifeInput = goog.dom.getElement('modifyFolder');
          }
          modifeInput.value = tree.getCurrentItem().title;
          break;
        case 4:
          tree.removeLeaf();
          break;
        default:
          break;
      }
    });

    var headuserinfo = new good.drive.nav.userinfo.Headuserinfo();
    headuserinfo.init();
    headuserinfo.nameClick();
  };
};

goog.exportSymbol('good.drive.init.start', good.drive.init.start);
