/*

 ----------------------------------------------------------------------------
 | ewd-qoper8-gtm: Integrates the GT.M database with ewd-qoper8             |
 |                    worker modules                                        |
 |                                                                          |
 | Copyright (c) 2016-18 M/Gateway Developments Ltd,                        |
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

 6 April 2018

*/

module.exports = function(worker, environment) {

  // establish the connection to GT.M database

  var nodemPath = 'nodem';

  // override nodem path using environment = {nodem: '/path/to/nodem'}

  if (environment) {

    if (environment.nodem) {
      nodemPath = environment.nodem;
    }
    else {
      var setEnvironment = require('./setEnvironment');
      if (environment === true) {
        setEnvironment();
      }
      else {
        setEnvironment(environment);
      }
    }
  }
  var DocumentStore = require('ewd-document-store');
  var Gtm = require(nodemPath).Gtm;
  worker.db = new Gtm();

  var status = worker.db.open({mode: 'strict'});

  worker.on('stop', function() {
    this.db.close({resetTerminal: true});
    worker.emit('dbClosed');
  });

  worker.on('unexpectedError', function() {
    if (worker.db) {
      try {
        worker.db.close({resetTerminal: true});
      }
      catch(err) {
        // ignore - process will shut down anyway
      }
    }
  });

  worker.emit('dbOpened', status);
  worker.documentStore = new DocumentStore(worker.db);
  worker.emit('DocumentStoreStarted');
};

