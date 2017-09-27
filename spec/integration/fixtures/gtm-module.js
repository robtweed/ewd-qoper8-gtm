'use strict';

var connectGTMTo = require('../../../');

module.exports = function() {

  this.on('dbOpened', function(status) {
    console.log('GT.M was opened by worker ' + process.pid + ': status = ' + JSON.stringify(status));
  });

  this.on('start', function() {
    connectGTMTo(this, true);
  });

  this.on('message', function(messageObj, send, finished) {

    var results = {
      youSent: messageObj,
      workerSent: 'hello from worker ' + process.pid,
      time: new Date().toString()
    };
    var log = new this.documentStore.DocumentNode('ewdTestLog');
    log.$('results').setDocument(results);

    finished(results);
  });

  this.on('stop', function() {
    console.log('Connection to GT.M closed');
  });

};
