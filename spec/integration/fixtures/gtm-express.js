var express = require('express');
var bodyParser = require('body-parser');
var qoper8 = require('ewd-qoper8');
var app = express();
app.use(bodyParser.json());

var q = new qoper8.masterProcess();

app.post('/qoper8', function (req, res) {
  q.handleMessage(req.body, function(response) {
    res.send(response);
  });
});

q.on('start', function () {
  this.worker.loaderFilePath = process.cwd() +  '/node_modules/ewd-qoper8-worker.js';
  this.worker.module = process.cwd() +  '/spec/integration/fixtures/gtm-module';
  this.log = false;
});

q.on('started', function () {
  app.listen(8080, function () {
    process.send({
      type: 'express-started'
    });
  });
});

q.start();
