# ewd-qoper8-gtm: Integrates ewd-qoper8 worker modules with the GT.M database

[![Build Status](https://travis-ci.org/robtweed/ewd-qoper8-gtm.svg?branch=master)](https://travis-ci.org/robtweed/ewd-qoper8-gtm) [![Coverage Status](https://coveralls.io/repos/github/robtweed/ewd-qoper8-gtm/badge.svg?branch=master)](https://coveralls.io/github/robtweed/ewd-qoper8-gtm?branch=master) [![Dependency Status](https://gemnasium.com/badges/github.com/robtweed/ewd-qoper8-gtm.svg)](https://gemnasium.com/github.com/robtweed/ewd-qoper8-gtm)

Rob Tweed <rtweed@mgateway.com>  
3 March 2016, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: [@rtweed](https://twitter.com/rtweed)

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)


## ewd-qoper8-gtm

This module may be used to simplifiy the integration of the Open Source GT.M database with ewd-qoper8 worker process modules. It additionally loads the ewd-document-store module to provide a very powerful and natural JavaScript interface to the underlying. Global Storage database engine within GT.M.


## Installing

       npm install ewd-qoper8-gtm

You also MUST install the Node.js connection interface [module](https://github.com/dlwicksell/nodem) for GT.M:

       npm install nodem


## Using ewd-qoper8-gtm

This module should be used with the start event handler of your ewd-qoper8 worker module, eg:

```js
this.on('start', function(isFirst) {
  var connectGTMTo = require('ewd-qoper8-gtm');
  connectGTMTo(this);
});
```

This will open an in-process connection to a local GT.M database.

### Setting the correct environment for GT.M

You'll need to ensure that the correct environment variables have been created for GT.M.  Typically this is done
automatically through the .profile file or similar.  If this is the case, simply establish the connection to GT.M
as follows:

```js
connectGTMTo(this);
```

However, you can optionally establish the appropriate environment variables by using a built-in function within 
ewd-qoper8-gtm which you can find within the repository.  Look for the module file /lib/setEnvironment.js

You'll see that this will set up a default environment, based on the assumption that you used apt-get install fis-gtm 
to install GT.M. If this is how you installed GT.M, then there's a good chance that the default environment settings
that the setEnvironment module will work for you. You can choose to use and apply these default settings by
establishing the connection to GT.M as follows:

```js
connectGTMTo(this, true);
```

If you need to modify any of the settings, you can do so by providing them within an object that you can pass to
the _connectGTMTo()_ function.  You can specify any or all of the following GT.M-specific environment variables:

- **gtmdir**
- **gtmver**
- **gtmdist**
- **gtmgbldir**
- **gtmroutines**
- **GTMCI**
- **GTM_REPLICATION**  (defaults to 'off')

Any variables that you don't explicity specify will have default values calculated for you.  Inspect the code in
/lib/setEnvironment.js to see the rules and logic it applies to create these defaults.

So, for example, you could do this:

```js
var env = {
  gtmdir: '/usr/lib/fis-gtm/V6.0-003_x86_64'
};
connectGTMTo(this, env);
```

### What else does ewd-qoper8-gtm do?

ewd-qoper8-gtm will load and initialise the _ewd-document-store_ module, creating a DocumentStore object within your worker.

### Events emitted by ewd-qoper8-gtm

ewd-qoper8-gtm uses the worker's 'stop' event to ensure that the connection to GT.M is removed before the worker stops.

ewd-qoper8-gtm also emits 3 new events that you may handle:

- **dbOpened**: fires after the connection to GT.M is opened within a worker process
- **dbClosed**: fires after the connection to GT.M is closed within a worker process.  The worker exits immediately after this event
- **DocumentStoreStarted**: fires after the DocumentStore object has been instantiated.  This is a good place to handle DocumentStore events, 
 for example to maintain document indices.

The dbOpened event provides you with a single status object argument, allowing you to determine the success (or not) of
opening the connection to GT.M, so you could add the following handler in your worker module, for example:

```js
worker.on('dbOpened', function(status) {
  console.log('GT.M was opened by worker ' + process.pid + ': status = ' + JSON.stringify(status));
});
```

The _dbClosed_ and _DocumentStoreStarted_ events provide no arguments.


## Example

See in the /examples directory.

gtm-express.js is an example Express / ewd-qoper8 master process scripts. gtm-module1.js is
the associated worker module which connects to and uses GT.M, using the default environment settings.

Use these as a starting point for your own system.


## Development

### Requirements

  - [RVM](https://rvm.io/)  
  - [Vagrant](https://www.vagrantup.com/)  
  - [Bundler](http://bundler.io/)  
  - [Vagrant Omnibus](https://github.com/chef/vagrant-omnibus) 

There is a Vagrantfile and set of Chef cookbooks to use with Vagrant for easy testing on a Linux VM. It configures and install all dependencies.

```
$ bundle install
$ librarian-chef install
$ vagrant up
```

## Testing

### Unit tests

```
$ vagrant ssh
$ cd /vagrant
$ npm run test:unit
```

### Integration tests

```
$ vagrant ssh
$ cd /vagrant
$ npm run test:integration
```


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
