'use strict';
goog.provide('good.drive.creation.mouserevent');

goog.require('goog.dom');
goog.require('goog.events');


/**
 * @constructor
 * @param {Element} dom
 */
good.drive.creation.Mouserevent = function(dom){  
  goog.events.listen(dom, 
      goog.events.EventType.MOUSEOVER,function(e){   
    var upload_div = goog.dom.getElement('upload_mouseover');
    if(!upload_div){
      var body = goog.dom.getElementsByTagNameAndClass('body')[0];
      var rootdiv = goog.dom.createDom('div',
          {'id':'upload_mouseover', 'class':'jfk-tooltip',
        'style':'left: 84px; top: 151px;'},null);
      var childdiv = goog.dom.createDom('div',
          {'class':'jfk-tooltip-contentId'},'上传');
      
      var childdiv2 = goog.dom.createDom('div',
          {'class':'jfk-tooltip-arrow jfk-tooltip-arrowup',
        'style':'left: 23px;'},null);
      
      var div4 = goog.dom.createDom('div',
          {'class':'jfk-tooltip-arrowimplbefore'},null);
      
      var div5 = goog.dom.createDom('div',
          {'class':'jfk-tooltip-arrowimplafter'},null);
      
      childdiv2.appendChild(div4);
      childdiv2.appendChild(div5);
      rootdiv.appendChild(childdiv);
      rootdiv.appendChild(childdiv2);
      body.appendChild(rootdiv);
    }else{
      upload_div.removeAttribute('class');
      upload_div.setAttribute('class','jfk-tooltip');
    }
  });
  
  goog.events.listen(dom,
      goog.events.EventType.MOUSEOUT,function(e){   
    var upload_div = goog.dom.getElement('upload_mouseover');
    upload_div.removeAttribute('class');
    upload_div.setAttribute('class',
        'jfk-tooltip jfk-tooltip-hide');
  });
};
