'use strict';
goog.provide('good.drive.creation.fileupload');


goog.require('good.drive.nav.folders.Model');
goog.require('goog.dom');
goog.require('goog.events');

/**
 * @constructor
 */
good.drive.creation.Fileupload = function() {
  var filepath = goog.dom.getElement('file');
  var upload_div = goog.dom.getElementByClass('doclistmole');
  var uploadtable = goog.dom.getElementByClass('upload-uploader-table');
  var close_upload = goog.dom.getElement('close_upload');
  this._file = filepath;
  this._upload_div = upload_div;
  this._uploadtable = uploadtable;
  this._close_upload = close_upload;
  this.closeuploadAction();
};


/**
 *
 */
good.drive.creation.Fileupload.prototype.fileClick = function() {
  this._file.click();
};


/**
 * @param {good.drive.nav.folders.Tree} tree
 */
good.drive.creation.Fileupload.prototype.fileChange = function(tree) {
  var that = this;
  goog.events.listen(that._file,
      goog.events.EventType.CHANGE,
      function(e) {
        var files = that._file.files;
        if (!files.length) {
          alert('请选择文件。');
          return false;
        }
        //显示上传信息div
        that._upload_div.style.display = 'block';

        var selected = tree.getCurrentItem();
        var mod = new good.drive.nav.folders.Model();
        var filelst = selected.file;
        for (var i = 0; i < files.length; i++) {
          var filename = files[i].name;

          var size = '';
          var filesize = files[i].size / (1024);
          if (filesize < 1) {
            filesize = Math.round(filesize * 100) / 100;
            size = filesize + 'B';
          } else {
            filesize = files[i].size / (1024 * 1024);
            filesize = filesize * 100;
            filesize = Math.round(filesize);
            filesize = filesize / 100;
            if (filesize < 1){
              size = filesize*1024 + 'KB';
            } else {
              size = filesize + 'M';
            } 
          }         
          var json = {'name': filename,'size': size};
          that.createTable(json);
//          var map = mod.getLeaf(filename);
//          filelst.push(map);
        }
        
        that.geturl(files);       
        
      });
};

/**
 * 
 * @param json
 */
good.drive.creation.Fileupload.prototype.createTable = function(json) {   
   var  tr = this._uploadtable.insertRow();
   tr.setAttribute('class','upload-file upload-state-complete');
   
   //文件状态<td>
   var status_td = goog.dom.createElement('td');
   status_td.setAttribute('class','upload-file-col upload-file-status');
   
   var status_div = goog.dom.createDom('div',{'class':'upload-file-status apps-upload-sprite goog-control'});
   status_td.appendChild(status_div);
   tr.appendChild(status_td);
   
   //文件名称<td>
   var name_td = goog.dom.createElement('td');
   name_td.setAttribute('class','upload-file-col upload-file-name');
   
   //var name_div = goog.dom.createDom('div',{'class':'upload-file-status apps-upload-sprite goog-control'});
   
   var name_span = goog.dom.createDom('span',{'class':'goog-control fileitem-linked'}, json.name);
   //name_div.appendChild(name_span);
   name_td.appendChild(name_span);
   tr.appendChild(name_td);
   
   //文件大小<td>
   var size_td = goog.dom.createElement('td');
   size_td.setAttribute('class','upload-file-col upload-file-size');
   
   //name_div = goog.dom.createDom('div',{'class':'upload-file-status apps-upload-sprite goog-control'});   
   var size_span = goog.dom.createDom('span',{'class':'goog-control'}, json.size);
   size_td.appendChild(size_span);
   tr.appendChild(size_td);
   
   //文件progress<td>
   var progress_td = goog.dom.createElement('td');
   progress_td.setAttribute('class','upload-file-col upload-file-progress');
   
   //name_div = goog.dom.createDom('div',{'class':'upload-file-status apps-upload-sprite goog-control'});   
   var progress_span = goog.dom.createDom('span',{'id':json.name, 'class':'progresstext'}, '正在上传');
   progress_td.appendChild(progress_span);
   tr.appendChild(progress_td);
   
 /*//文件action<td>
   var action_td = goog.dom.createElement('td');
   action_td.setAttribute('class','upload-file-col upload-file-actions');
   
   var retry_div = goog.dom.createDom('div',{'class':'upload-file-retry goog-inline-block goog-flat-button',
     'style':'display: none;'}, '重试');
   
   var remove_div = goog.dom.createDom('div',{'class':'upload-file-remove goog-inline-block goog-flat-button',
     'style':'display: none;'}, '删除');
   
   var cancel_div = goog.dom.createDom('div',{'class':'upload-file-cancel goog-inline-block goog-flat-button',
     'style':'display: none;'}, '取消');
   
  
   action_td.appendChild(retry_div);
   action_td.appendChild(remove_div);
   action_td.appendChild(cancel_div);
   
   tr.appendChild(action_td);*/
  
};

/**
 * @param {string} url
 * @param {FileList} files
 * @param {Function} handler
 */
good.drive.creation.Fileupload.prototype.uploadFiles = function(url, files, handler) {
  var formData = new FormData();

  for (var i = 0, file; file = files[i]; ++i) {
    formData.append(file.name, file);
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.onload = function(e) {
    var responseText = this.responseText;
    if (responseText.length == 0) {
      onLoad(null);
      return;
    }
    handler(goog.json.parse(responseText));
  };
//  xhr.upload.onprogress = function(e) {
//    if (e.lengthComputable) {
//      console.log('progressBar.value: ' + (e.loaded / e.total) * 100);
//    }
//  };
  xhr.send(formData);  // multipart/form-data
};

/**
 *
 */
good.drive.creation.Fileupload.prototype.closeuploadAction = function() {
  var that = this;
  goog.events.listen(that._close_upload,
     goog.events.EventType.CLICK, function(e) {
  //隐藏上传信息div               
    that._upload_div.style.display = 'none';
    goog.dom.removeChildren(that._uploadtable);
  });
};

/**
 * @param {Array.<Object>} files
 */
good.drive.creation.Fileupload.prototype.geturl = function(files) {
  var that = this;
  var rpc = new good.net.CrossDomainRpc('GET', 'http://192.168.1.15:8880/_ah/api/attachment',
      good.config.VERSION, 'boxedstring');
  rpc.send(function(json){
    if (json && !json['error']){
      var url = json['value'].replace('localhost','192.168.1.15');
      that.uploadFiles(url, files, function(json) {
        alert('ddd');
        for(var i = 0; i < files.length; i++){
          var filename = files[0].name;
          fileId = json[filename];
        }
      });
    }
  });
};