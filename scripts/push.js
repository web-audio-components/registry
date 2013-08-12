#!/usr/bin/env node

var ddoc = require('../registry')
  , db = require('nano')('http://nick-thompson.cloudant.com/registry');

db.get('_design/app', function (err, res) {
  if (err) {
    if (!(err.status_code && err.status_code == 404)) {
      return console.log(err);
    }
  } else {
    ddoc._rev = res._rev;
  }
  db.insert(ddoc, function (err, res) {
    if (err) console.log (err);
    console.log('Success: ', res);
  });
});

