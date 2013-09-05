'use strict';
goog.provide('good.constants');

/**@type {string} */
good.constants.DRIVE_SERVER = 'http://192.168.11.39:8880';
//good.constants.DRIVE_SERVER = 'http://server.drive.goodow.com';

/**@type {string} */
good.constants.SERVERADRESS =
              good.constants.DRIVE_SERVER + '/_ah/api/';

/**@type {string} */
good.constants.NAME = 'attachment';

/**@type {string} */
good.constants.DEVICE = 'device';

/**@type {string} */
good.constants.PRESENCE = 'presence';

/** @type {string} */
good.constants.VERSION = 'v0.0.1';


/** @type {string} */
good.constants.MYCLASSRESDOCID = 'lesson07';
/** @type {string} */
good.constants.MYRESDOCID = 'favorites07';
/** @type {string} */
good.constants.PUBLICRESDOCID = '@tmp/publicRes07';
/** @type {string} */
good.constants.PATHDOCID = 'remotecontrol07';
/** @type {string} */
good.constants.OTHERDOCID = 'other01';


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
good.constants.TYPEARRAY = new Array('动画', '视频', '音频', '图片', '文本', '手偶', '电子书');

/** @type {Array.<string>} */
good.constants.FIELDARRAY = new Array('语言', '数学', '科学', '社会', '健康', '艺术', '默认');

/** @type {Array.<string>} */
good.constants.GRADEARRAY = new Array('大班', '中班', '小班');

/** @type {JSON} */
good.constants.TYPE = {'动画': 'application/x-shockwave-flash',
    '视频': 'video/mpeg',
    '音频': 'audio/mp3',
    '图片': 'image/',
    '文本': 'text/plain',
    '手偶': 'application/x-print',
    '电子书': 'text/plain'};

/** @type {JSON} */
good.constants.REVERSETYPE = {'application/x-shockwave-flash': '动画',
    'video/mpeg': '视频',
    'audio/mp3': '音频',
    'image/': '图片',
    'text/plain': '文本',
    'application/x-print': '手偶',
    'text/html': '电子书'};

/** @type {string} */
good.constants.ADMIN = 'admin';
