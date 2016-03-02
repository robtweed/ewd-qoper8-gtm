# ewd-qoper8-gtm: Integrates ewd-qoper8 worker modules with the GT.M database
 
Rob Tweed <rtweed@mgateway.com>  
3 March 2016, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)


## ewd-qoper8-gtm

This module may be used to simplifiy the integration of the GT.M database with ewd-qoper8 worker process modules

## Installing

       npm install ewd-qoper8-gtm
	   
## Using ewd-qoper8-gtm

This module should be used with the start event handler of your ewd-qoper8 worker module, eg:

    this.on('start', function(isFirst) {
      var connectGTMTo = require('ewd-qoper8-gtm');
      connectGTMTo(this);
    });

This will open an in-process connection to a local GT.M database.

ewd-qoper8-gtm will load and initialise the ewd-globals module, creating a globalStore object within your worker.

ewd-qoper8-gtm takes responsibility for handling the worker's 'stop' event, but provides you with 3 new events that you may handle:

- dbOpened: fires after the connection to GT.M is opened within a worker process
- dbClosed: fires after the connection to GT.M is closed within a worker process.  The worker exits immediately after this event
- globalStoreStarted: fires after the globalStore object has been instantiated.  This is a good place to handle globalStore events, 
 for example to maintain global indices

The dbOpened event provides you with a single status object argument, allowing you to determine the success (or not) of
opening the connection to GT.M, so you could add the following handler in your worker module, for example:

    worker.on('dbOpened', function(status) {
      console.log('GT.M was opened by worker ' + process.pid + ': status = ' + JSON.stringify(status));
    });


The dbClosed and globalStoreStarted events provide no arguments.


## License

 Copyright (c) 2016 M/Gateway Developments Ltd,                           
 Reigate, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
