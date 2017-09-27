'use strict';

var fork = require('child_process').fork;

module.exports = {
  fork: function (modulePath, callback) {
    var cp = fork(modulePath);

    cp.on('message', function (message) {
      if (message.type === 'express-started') {
        callback();
      }
    });

    return cp;
  },

  exit: function (cp, callback) {
    cp.on('exit', function () {
      callback();
    });
    cp.kill();
  }
};
