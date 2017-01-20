/*

 ----------------------------------------------------------------------------
 | ewd-qoper8-gtm: Integrates the GT.M database with ewd-qoper8             |
 |                    worker modules                                        |
 |                                                                          |
 | Copyright (c) 2016-17 M/Gateway Developments Ltd,                        |
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
  var interface = require(nodemPath);
  worker.db = new interface.Gtm();

  var status = worker.db.open();

  worker.on('stop', function() {
    this.db.close();
    worker.emit('dbClosed');
  });

  worker.on('unexpectedError', function() {
    if (worker.db) {
      try {
        worker.db.close();
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

