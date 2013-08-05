'use strict';
goog.provide('good.constants');

/**@type {string} */
//good.constants.DRIVE_SERVER = 'http://192.168.1.15:8880';
good.constants.DRIVE_SERVER = 'http://server.drive.goodow.com';

/**@type {string} */
good.constants.SERVERADRESS =
              good.constants.DRIVE_SERVER + '/ah/api/';

/**@type {string} */
good.constants.NAME = 'attachment';

/**@type {string} */
good.constants.DEVICE = 'device';

/**@type {string} */
good.constants.PRESENCE = 'presence';

/** @type {string} */
good.constants.VERSION = 'v0.0.1';


/** @type {string} */
good.constants.MYCLASSRESDOCID = 'lesson01';
/** @type {string} */
good.constants.MYRESDOCID = 'favorites01';
/** @type {string} */
good.constants.PUBLICRESDOCID = '@tmp/publicRes01';
/** @type {string} */
good.constants.PATHDOCID = 'remotecontrol01';


/** @type {string} */
good.constants.LABEL = 'label';

/** @type {string} */
good.constants.FOLDERS = 'folders';

/** @type {string} */
good.constants.TAGS = 'tags';

/** @type {string} */
good.constants.CONTENTTYPE = 'contentType';

/** @type {string} */
good.constants.QUERY = 'query';

/** @type {Array.<string>} */
good.constants.TYPEARRAY = new Array('动画', '视频', '音频', '图片', '文本', '电子书');

/** @type {Array.<string>} */
good.constants.FIELDARRAY = new Array('语言', '数学', '科学', '社会', '健康', '艺术');

/** @type {Array.<string>} */
good.constants.GRADEARRAY = new Array('大班', '中班', '小班');

/** @type {JSON} */
good.constants.TYPE = {'动画': 'application/x-shockwave-flash',
    '视频': 'video/mpeg',
    '音频': 'audio/mp3',
    '图片': 'image/',
    '文本': 'text/plain'};

/** @type {string} */
good.constants.ADMIN = 'admin';
