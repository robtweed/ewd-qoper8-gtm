/*

 ----------------------------------------------------------------------------
 | ewd-qoper8-gtm: Integrates the GT.M database with ewd-qoper8             |
 |                    worker modules                                        |
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

  This optional module allows you to define the correct environment
  settings for your GT.M system.  If you've already created this via
  your profile, then you can ignore this module.

  Override the default settings by using the params object argument.
  You can define your own values for any or all of the following
  GT.M environment variables:

   gtmdir,
   gtmver,
   gtmdist,
   gtmgbldir,
   gtmroutines,
   GTMCI,
   GTM_REPLICATION

*/

var fs = require('fs');
var os = require('os');

module.exports = function(params) {

  params = params || {};

  var home = process.env.HOME;
  var gtmdir = params.gtmdir || home + '/.fis-gtm';
  var gtmver = params.gtmver || fs.readdirSync(gtmdir)[0];
  var gtmroot = gtmdir + '/' + gtmver;
  var gtmver2 = fs.readdirSync('/usr/lib/fis-gtm')[0];
  var gtmdist = params.gtmdist || '/usr/lib/fis-gtm/' + gtmver2;
  var gtmrep = params['GTM_REPLICATION'] || 'off';

  process.env['GTM_REPLICATION'] = gtmrep;
  process.env['gtmdir'] = gtmdir;
  process.env['gtmver'] = gtmver;
  process.env['gtm_dist'] = gtmdist;
  process.env['GTMCI'] = params.GTMCI || process.cwd() + '/node_modules/nodem/resources/nodem.ci';
  process.env['gtmgbldir'] = params.gtmgbldir || gtmroot + '/g/gtm.gld';
  if (params.gtmroutines) {
    process.env['gtmroutines'] = params.gtmroutines;
  }
  else {
    var gr = gtmroot + '/o(' + gtmroot + '/r ' + gtmdir + '/r)';
    if (os.arch() !== 'ia32') gr = gr + ' ' + gtmdist + '/libgtmutil.so'
    process.env['gtmroutines'] = gr + ' ' + gtmdist + ' ' + process.cwd() + '/node_modules/nodem/src';
  }
};

