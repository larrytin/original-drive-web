'use strict';
goog.provide('good.drive.role');

goog.require('good.net.CrossDomainRpc');

/**
 * @constructor
 * @param {string} userId
 */
good.drive.role.Role = function(userId) {
  var rpc = new good.net.CrossDomainRpc('GET', good.config.ACCOUNT,
      good.config.VERSION, 'accountinfo/' + userId,
      good.config.SERVERADRESS);
  rpc.send(function(json) {
    if (json && json['token']) {
      good.drive.role.Role.USERNAME = json['name'];
    }
  });
};

/** @type {string} */
good.drive.role.Role.USERNAME = undefined;
