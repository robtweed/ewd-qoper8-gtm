'use strict';

var events = require('events');
var mockery = require('mockery');
var gtm = require('../../lib/gtm');
var gtmMock = require('./mocks/gtm');
var documentStoreMock = require('./mocks/documentStore');

describe('unit/gtm:', function () {
  var Worker;
  var worker;
  var setEnvironment;
  var Gtm;
  var DocumentStore;
  var documentStore;
  var db;

  beforeAll(function () {
    Worker = function () {
      events.EventEmitter.call(this);
    };

    Worker.prototype = Object.create(events.EventEmitter.prototype);
    Worker.prototype.constructor = Worker;

    mockery.enable();
  });

  afterAll(function () {
    mockery.disable();
  });

  beforeEach(function () {
    setEnvironment = jasmine.createSpy();
    mockery.registerMock('./setEnvironment', setEnvironment);

    db = gtmMock.mock();
    Gtm = jasmine.createSpy().and.returnValue(db);
    mockery.registerMock('nodem', {
      Gtm: Gtm
    });

    documentStore = documentStoreMock.mock();
    DocumentStore = jasmine.createSpy().and.returnValue(documentStore);
    mockery.registerMock('ewd-document-store', DocumentStore);

    worker = new Worker();
  });

  afterEach(function () {
    mockery.deregisterAll();
  });

  it('worker.db', function () {
    gtm(worker);

    expect(Gtm).toHaveBeenCalled();
    expect(worker.db).toBe(db);
  });

  it('worker.documentStore', function () {
    gtm(worker);

    expect(DocumentStore).toHaveBeenCalledWith(db);
    expect(worker.documentStore).toBe(documentStore);
  });

  describe('stop event', function () {
    it('should add event handler', function () {
      spyOn(worker, 'on');

      gtm(worker);

      expect(worker.on).toHaveBeenCalledTimes(2);
      expect(worker.on.calls.argsFor(0)).toEqual(['stop', jasmine.any(Function)]);
    });

    it('handle stop', function () {
      var spy = jasmine.createSpy();
      worker.on('dbClosed', spy);

      gtm(worker);

      worker.emit('stop');

      expect(db.close).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('unexpectedError event', function () {
    it('should add event handler', function () {
      spyOn(worker, 'on');

      gtm(worker);

      expect(worker.on).toHaveBeenCalledTimes(2);
      expect(worker.on.calls.argsFor(1)).toEqual(['unexpectedError', jasmine.any(Function)]);
    });

    it('handle unexpected error', function () {
      gtm(worker);

      worker.emit('unexpectedError');

      expect(db.close).toHaveBeenCalled();
    });

    it('handle unexpected error when db is not initialized', function () {
      gtm(worker);

      delete worker.db;

      worker.emit('unexpectedError');

      expect(db.close).not.toHaveBeenCalled();
    });
  });

  it('should emit dbOpened', function () {
    var spy = jasmine.createSpy();
    worker.on('dbOpened', spy);

    db.open.and.returnValue('status');

    gtm(worker);

    expect(spy).toHaveBeenCalledWith('status');
  });

  it('should emit dbOpened', function () {
    var spy = jasmine.createSpy();
    worker.on('DocumentStoreStarted', spy);

    gtm(worker);

    expect(spy).toHaveBeenCalled();
  });

  describe('environment', function () {
    it('environment.nodem', function () {
      var customDb = gtmMock.mock();
      var CustomGtm = jasmine.createSpy().and.returnValue(customDb);
      mockery.registerMock('/path/to/nodem', {
        Gtm: CustomGtm
      });

      var environment = {
        nodem: '/path/to/nodem'
      };

      gtm(worker, environment);

      expect(worker.db).toBe(customDb);
    });

    it('should set environment', function () {
      var environment = true;

      gtm(worker, environment);

      expect(setEnvironment).toHaveBeenCalled();
    });

    it('should set environment with env params', function () {
      var environment = {
        foo: 'bar'
      };

      gtm(worker, environment);

      expect(setEnvironment).toHaveBeenCalledWith({
        foo: 'bar'
      });
    });
  });
});
