'use strict';

// delete existing env varaible to load a needed one from .env
// https://github.com/motdotla/dotenv#what-happens-to-environment-variables-that-were-already-set
delete process.env.gtmroutines;

require('dotenv').config();

var request = require('supertest')('http://localhost:8080');
var utils = require('./utils');
var Gtm = require('nodem').Gtm;
var DocumentStore = require('ewd-document-store');

describe('integration/gtm: ', function () {
  var cp;
  var db;
  var documentStore;

  beforeAll(function (done) {
    db = new Gtm();
    db.open();

    documentStore = new DocumentStore(db);
    cp = utils.fork(require.resolve('./fixtures/gtm-express'), done);
  });

  afterAll(function (done) {
    db.close();
    utils.exit(cp, done);
  });

  afterEach(function () {
    var documentNode = new documentStore.DocumentNode('ewdTestLog');
    documentNode.delete();
  });

  it('should be able to communicate with GT.M' , function (done) {
    request.
      post('/qoper8').
      expect(200).
      expect(function (res) {
        var body = res.body;

        expect(body.finished).toBeTruthy();
        expect(body.message.youSent).toEqual(jasmine.any(Object));
        expect(body.message.workerSent).toMatch(/^hello from worker \d{4,5}$/);
        expect(body.message.time).toMatch(/(\w{3}) (\w{3}) (\d{2}) (\d{4}) ((\d{2}):(\d{2}):(\d{2})) GMT\+\d{4} \(UTC\)/);

        var node = new documentStore.DocumentNode('ewdTestLog');
        var results = node.$('results').getDocument();
        expect(results).toEqual(
          jasmine.objectContaining({
            time: body.message.time,
            workerSent: body.message.workerSent
          })
        );

      }).
      end(function (err) {
        return err ? done.fail(err) : done();
      });
  });
});

