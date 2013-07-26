'use strict';
goog.provide('good.drive.creation.fileupload');

goog.require('good.constants');
goog.require('good.drive.nav.folders.Model');
goog.require('good.net.CrossDomainRpc');
goog.require('goog.Uri');
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

/**@type {string} */
good.drive.creation.Fileupload.NEWORUPDATE = 'new';

/**@type {string} */
good.drive.creation.Fileupload.FILEID = undefined;


/**
 * @param {string} str
 * @param {string} fileId
 */
good.drive.creation.Fileupload.prototype.fileClick = function(str, fileId) {
  good.drive.creation.Fileupload.TYPE = str;
  good.drive.creation.Fileupload.FILEID = fileId;
  this._file.click();
};


/**
 *
 */
good.drive.creation.Fileupload.prototype.fileChange = function() {
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
            if (filesize < 1) {
              size = filesize * 1024 + 'KB';
            } else {
              size = filesize + 'M';
            }
          }
          var json = {'name': filename, 'size': size};
          that.createTable(json);
        }
        that.geturl(files);
      });
};

/**
 * @param {JSON} json
 */
good.drive.creation.Fileupload.prototype.createTable = function(json) {
   var tr = this._uploadtable.insertRow();
   tr.setAttribute('class', 'upload-file upload-state-complete');

   //文件状态<td>
   var status_td = goog.dom.createElement('td');
   status_td.setAttribute('class', 'upload-file-col upload-file-status');

   var status_div = goog.dom.createDom('div',
       {'class': 'upload-file-status apps-upload-sprite goog-control'});
   status_td.appendChild(status_div);
   tr.appendChild(status_td);

   //文件名称<td>
   var name_td = goog.dom.createElement('td');
   name_td.setAttribute('class', 'upload-file-col upload-file-name');

   //var name_div = goog.dom.createDom('div',
   //{'class':'upload-file-status apps-upload-sprite goog-control'});

   var name_span = goog.dom.createDom('span',
       {'class': 'goog-control fileitem-linked'}, json.name);
   //name_div.appendChild(name_span);
   name_td.appendChild(name_span);
   tr.appendChild(name_td);

   //文件大小<td>
   var size_td = goog.dom.createElement('td');
   size_td.setAttribute('class', 'upload-file-col upload-file-size');

   //name_div = goog.dom.createDom('div',
   //{'class':'upload-file-status apps-upload-sprite goog-control'});
   var size_span = goog.dom.createDom('span',
       {'class': 'goog-control'}, json.size);
   size_td.appendChild(size_span);
   tr.appendChild(size_td);

   //文件progress<td>
   var progress_td = goog.dom.createElement('td');
   progress_td.setAttribute('class', 'upload-file-col upload-file-progress');

   //name_div = goog.dom.createDom('div',
   //{'class':'upload-file-status apps-upload-sprite goog-control'});
   var progress_span = goog.dom.createDom('span',
       {'id': json.name, 'class': 'progresstext'}, '正在上传');
   progress_td.appendChild(progress_span);
   tr.appendChild(progress_td);

 /*//文件action<td>
   var action_td = goog.dom.createElement('td');
   action_td.setAttribute('class','upload-file-col upload-file-actions');

   var retry_div = goog.dom.createDom('div',
   {'class':'upload-file-retry goog-inline-block goog-flat-button',
     'style':'display: none;'}, '重试');

   var remove_div = goog.dom.createDom('div',
   {'class':'upload-file-remove goog-inline-block goog-flat-button',
     'style':'display: none;'}, '删除');

   var cancel_div = goog.dom.createDom('div',
   {'class':'upload-file-cancel goog-inline-block goog-flat-button',
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
good.drive.creation.Fileupload.prototype.uploadFiles =
  function(url, files, handler) {
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
  //xhr.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
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
  var rpc = new good.net.CrossDomainRpc('GET',
      good.constants.NAME,
      good.constants.VERSION, 'boxedstring',
      good.constants.SERVERADRESS);
  rpc.send(function(json) {
    if (json && !json['error']) {
      var url = new goog.Uri(json['value']);
      url.setDomain(good.constants.SERVERDOMAIN);
      //url.setScheme();
      that.uploadFiles(url, files, function(json) {
        if (json && !json['error']) {
          for (var i = 0; i < files.length; i++) {
            var filename = files[i].name;
            var insertJson = json[filename]['members'];
            delete insertJson.size;
            delete insertJson.md5Hash;
            if (good.drive.creation.Fileupload.TYPE == 'new') {
              var tags = that.getTags();
              insertJson['tags'] = tags;
              that.insertfile(insertJson, function() {
                goog.dom.getElement(filename).innerText = '上传结束';
              });
            } else {
              that.updateAgain(good.drive.creation.Fileupload.FILEID,
                  insertJson, function() {
                goog.dom.getElement(filename).innerText = '更新成功';
                  });
            }
          }
        }
      });
    }
  });
};

/**
 * @param {JSON} json
 * @param {Function} fn
 */
good.drive.creation.Fileupload.prototype.insertfile = function(json, fn) {
  var rpc = new good.net.CrossDomainRpc('POST',
      good.constants.NAME,
      good.constants.VERSION, 'attachment',
      good.constants.SERVERADRESS);
  rpc.body = json;
  rpc.send(function(json) {
   if (json && !json['error']) {
     fn();
   }
  });
};

/**
 * @param {string} fileId
 * @param {JSON} updatejson
 * @param {Function} fn
 */
good.drive.creation.Fileupload.prototype.updateAgain =
  function(fileId, updatejson, fn) {
  var rpc = new good.net.CrossDomainRpc('GET',
      good.constants.NAME,
      good.constants.VERSION, 'attachment/' + fileId,
      good.constants.SERVERADRESS);
  rpc.send(function(json) {
     if (json && !json['error']) {
       updatejson['tags'] = json['tags'];
       updatejson['id'] = json['id'];
       var rpc = new good.net.CrossDomainRpc('POST',
           good.constants.NAME,
           good.constants.VERSION, 'update',
           good.constants.SERVERADRESS);
       rpc.body = updatejson;
       rpc.send(function(json) {
         fn();
      });
       }
     });
};


/**
 * @param {string} fileId
 * @param {Array.<string>} tags
 * @param {string} content_Type
 * @param {Function} handler
 */
good.drive.creation.Fileupload.prototype.updatefile = function(fileId,
    tags, content_Type, handler) {
  if ((tags != null && tags.length > 0) ||
      (content_Type != null && content_Type != '')) {
    var rpc = new good.net.CrossDomainRpc('GET',
        good.constants.NAME,
        good.constants.VERSION, 'attachment/' + fileId,
        good.constants.SERVERADRESS);
    rpc.send(function(json) {
       if (json && !json['error']) {
         if (tags != null && tags.length > 0) {
           if (json['tags'] != undefined &&
               !goog.array.isEmpty(json['tags'])) {
             goog.array.forEach(tags, function(e) {
              if (!goog.array.contains(json['tags'], e)) {
                goog.array.insert(json['tags'], e);
              }
            });
           }else {
             json['tags'] = tags;
           }
         }
         if (content_Type != null && content_Type != '') {
           json['contentType'] = content_Type;
         }
         var rpc = new good.net.CrossDomainRpc('POST',
             good.constants.NAME,
             good.constants.VERSION, 'update',
             good.constants.SERVERADRESS);
         rpc.body = json;
         rpc.send(function(json) {
           handler();
        });
       }
    });
  } else {
    handler();
  }
};

/**
 * @return {Array.<string>}
 */
good.drive.creation.Fileupload.prototype.getTags = function() {
  var path = good.drive.nav.folders.Path.getINSTANCE();
  var docId = path.path.get('docid');
  if (docId == good.constants.PUBLICRESDOCID) {
    var map = path.getCurrentData();
    var query = map.get('query');
    var tags = query.get('tags');
    return tags;
  } else {
    var publicTree = goog.object.get(
        good.drive.nav.folders.AbstractControl.docs,
        good.constants.PUBLICRESDOCID);
    var map = publicTree.getData();
    return new Array('数学', '图片');
  }
  };
