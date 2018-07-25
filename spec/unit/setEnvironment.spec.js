'use strict';

var os = require('os');
var setEnvironment = require('../../lib/setEnvironment');

describe('unit/setEnvironment:', function () {
  var HOME = process.env.TRAVIS ?
    '/home/travis' :
    '/home/vagrant';
  var DIR = process.env.TRAVIS_BUILD_DIR || '/vagrant';

  afterEach(function () {
    [
      'GTM_REPLICATION',
      'gtmdir',
      'gtmver',
      'gtm_dist',
      'GTMCI',
      'gtmgbldir',
      'gtmroutines',
    ].forEach(function (varName) {
      delete process.env[varName];
    });
  });

  it('should set default environment variables', function () {
    setEnvironment();

    /*jshint sub: true */
    expect(process.env['GTM_REPLICATION']).toBe('off');
    expect(process.env['gtmdir']).toBe(HOME + '/.fis-gtm');
    expect(process.env['gtmver']).toBe('V6.3-002_x86_64');
    expect(process.env['gtm_dist']).toBe('/usr/lib/fis-gtm/V6.3-002_x86_64');
    expect(process.env['GTMCI']).toBe(DIR + '/node_modules/nodem/resources/nodem.ci');
    expect(process.env['gtmgbldir']).toBe(HOME + '/.fis-gtm/V6.3-002_x86_64/g/gtm.gld');
    expect(process.env['gtmroutines']).toBe(HOME + '/.fis-gtm/V6.3-002_x86_64/o(' + HOME + '/.fis-gtm/V6.3-002_x86_64/r ' + HOME + '/.fis-gtm/r) /usr/lib/fis-gtm/V6.3-002_x86_64/libgtmutil.so /usr/lib/fis-gtm/V6.3-002_x86_64 ' + DIR + '/node_modules/nodem/src');
    /*jshint sub: false */
  });

  it('os.arch is ia32', function () {
    spyOn(os, 'arch').and.returnValue('ia32');

    setEnvironment();

    /*jshint sub: true */
    expect(process.env['gtmroutines']).toBe(HOME + '/.fis-gtm/V6.3-002_x86_64/o(' + HOME + '/.fis-gtm/V6.3-002_x86_64/r ' + HOME + '/.fis-gtm/r) /usr/lib/fis-gtm/V6.3-002_x86_64 ' + DIR + '/node_modules/nodem/src');
    /*jshint sub: false */
  });

  it('should set environment variables from parameters', function () {
    var params = {
      gtmdir: '/tmp/gtmdir',
      gtmgbldir: '/tmp/gtmdir/V6.3-002_x86/g/gtm.gld',
      gtmver: 'V6.3-001_x86',
      gtmdist: '/usr/local/lib/fis-gtm/V6.3-001_x86',
      gtmroutines: '/tmp/gtmdir/V6.3-002_x86/o(/tmp/gtmdir/V6.3-002_x86/r /tmp/gtmdir/r) /usr/local/lib/fis-gtm/V6.3-002 ' + DIR + '/node_modules/nodem/src',
      GTM_REPLICATION: 'on',
      GTMCI: '/usr/local/lib/node_modules/nodem/resources/nodem.ci'
    };

    setEnvironment(params);

    /*jshint sub: true */
    expect(process.env['GTM_REPLICATION']).toBe('on');
    expect(process.env['gtmdir']).toBe('/tmp/gtmdir');
    expect(process.env['gtmver']).toBe('V6.3-001_x86');
    expect(process.env['gtm_dist']).toBe('/usr/local/lib/fis-gtm/V6.3-001_x86');
    expect(process.env['GTMCI']).toBe('/usr/local/lib/node_modules/nodem/resources/nodem.ci');
    expect(process.env['gtmgbldir']).toBe('/tmp/gtmdir/V6.3-002_x86/g/gtm.gld');
    expect(process.env['gtmroutines']).toBe('/tmp/gtmdir/V6.3-002_x86/o(/tmp/gtmdir/V6.3-002_x86/r /tmp/gtmdir/r) /usr/local/lib/fis-gtm/V6.3-002 ' + DIR + '/node_modules/nodem/src');
    /*jshint sub: false */
  });

  it('should set environment variables from params.ydb_env', function () {
    /*jshint camelcase: false */
    var params = {
      ydb_env: {
        ydb_retention: 42,
        ydb_log: '/tmp/yottadb/r1.22_x86_64'
      }
    };
    /*jshint camelcase: true */

    setEnvironment(params);

     /*jshint sub: true */
    expect(process.env['ydb_retention']).toBe('42');
    expect(process.env['ydb_log']).toBe('/tmp/yottadb/r1.22_x86_64');
    /*jshint sub: false */
  });
});
