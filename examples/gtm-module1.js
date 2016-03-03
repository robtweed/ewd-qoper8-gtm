/*

 ----------------------------------------------------------------------------
 | ewd-qoper8: Node.js Queue and Multi-process Manager                      |
 |                                                                          |
 | Copyright (c) 2016 M/Gateway Developments Ltd,                           |
 | Reigate, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  1 March 2016

*/

module.exports = function() {

  this.on('dbOpened', function(status) {
    console.log('GT.M was opened by worker ' + process.pid + ': status = ' + JSON.stringify(status));
  });

  this.on('start', function(isFirst) {
    var connectGTMTo = require('ewd-qoper8-gtm');
    var config = require('ewd-qoper8-gtm/lib/config');
    config();
    connectGTMTo(this);
  });

  this.on('message', function(messageObj, send, finished) {
    
    var results = {
      youSent: messageObj,
      workerSent: 'hello from worker ' + process.pid,
      time: new Date().toString()
    };
    var log = new this.globalStore.GlobalNode('ewdTestLog');
    var ix = log._increment();
    log.$(ix)._setDocument(results);
    finished(results);
  });

  this.on('stop', function() {
    console.log('Connection to GT.M closed');
  });
  
};
