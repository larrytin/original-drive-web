'use strict';
goog.provide('good.drive.flashcontrol');

goog.require('goog.dom');
goog.require('goog.events');

/**
 * Flash播放控制类
 * @constructor
 */
good.drive.flashcontrol.Control = function() {
  var PlayFlash = goog.dom.getElement('PlayFlash');
  var StopFlash = goog.dom.getElement('StopFlash');
  var RewindFlash = goog.dom.getElement('RewindFlash');
  var NextFrameFlash = goog.dom.getElement('NextFrameFlash');
  var ZoominFlash = goog.dom.getElement('ZoominFlash');
  var ZoomoutFlash = goog.dom.getElement('ZoomoutFlash');
  this._PlayFlash = PlayFlash;
  this._StopFlash = StopFlash;
  this._RewindFlash = RewindFlash;
  this._NextFrameFlash = NextFrameFlash;
  this._ZoominFlash = ZoominFlash;
  this._ZoomoutFlash = ZoomoutFlash;
  this.NextFrameFlashMovie();
  this.PlayFlashMovie();
  this.StopFlashMovie();
  this.RewindFlashMovie();
  this.ZoominFlashMovie();
  this.ZoomoutFlashMovie();
};

/**
 * 取得Flash对象方法
 * @param {string} movieName
 * @return {Element}
 */
good.drive.flashcontrol.Control.prototype.
  getFlashMovieObject = function(movieName)  
{
  if (window.document[movieName]) {
      return window.document[movieName];
  }
  if (!goog.userAgent.IE) {
    if (document.embeds && document.embeds[movieName])
      return document.embeds[movieName];
  } else {
    return document.getElementById(movieName);
  }
};

/**
 * 绑定暂停按钮Action
 */
good.drive.flashcontrol.Control.prototype.StopFlashMovie = function() {
  var that = this;
  goog.events.listen(that._StopFlash, goog.events.EventType.CLICK,
     function(e) {
    var flashMovie = that.getFlashMovieObject('Myflash');
    flashMovie.StopPlay();
    });
};

/**
 * 绑定播放按钮Action
 */
good.drive.flashcontrol.Control.prototype.PlayFlashMovie = function() {
  var that = this;
  goog.events.listen(that._PlayFlash, goog.events.EventType.CLICK,
     function(e) {
    var flashMovie = that.getFlashMovieObject('Myflash');
    flashMovie.Play();
    });
};

/**
* 绑定停止按钮Action
*/
good.drive.flashcontrol.Control.prototype.RewindFlashMovie = function() {
 var that = this;
 goog.events.listen(that._RewindFlash, goog.events.EventType.CLICK,
    function(e) {
   var flashMovie = that.getFlashMovieObject('Myflash');
   flashMovie.Rewind();
   });
};

/**
* 绑定下一帧按钮Action
*/
good.drive.flashcontrol.Control.prototype.NextFrameFlashMovie = function() {
 var that = this;
 goog.events.listen(that._NextFrameFlash, goog.events.EventType.CLICK,
    function(e) {
   var flashMovie = that.getFlashMovieObject('Myflash');
   var currentFrame = flashMovie.TGetProperty('/', 4);
   var nextFrame = parseInt(currentFrame);
   if (nextFrame >= 9)
     nextFrame = 0;
     flashMovie.GotoFrame(nextFrame);
   });
};

/**
* 绑定放大按钮Action
*/
good.drive.flashcontrol.Control.prototype.ZoominFlashMovie = function() {
 var that = this;
 goog.events.listen(that._ZoominFlash, goog.events.EventType.CLICK,
    function(e) {
   var flashMovie = that.getFlashMovieObject('Myflash');
   flashMovie.Zoom(90);
   });
};

/**
* 绑定缩小按钮Action
*/
good.drive.flashcontrol.Control.prototype.ZoomoutFlashMovie = function() {
 var that = this;
 goog.events.listen(that._ZoomoutFlash, goog.events.EventType.CLICK,
    function(e) {
   var flashMovie = that.getFlashMovieObject('Myflash');
   flashMovie.Zoom(110);
   });
};

/*
function SendDataToFlashMovie()
{
 var flashMovie=getFlashMovieObject("Myflash");
 flashMovie.SetVariable("/:mytext", document.getElementById("data").value);
}

function ReceiveDataFromFlashMovie()
{
 var flashMovie=getFlashMovieObject("Myflash");
 document.getElementById("data").value=flashMovie.GetVariable("/:mytext");
 //document.controller.Data.value=message;
}*/
