#!/usr/bin/env node

var follow = require('follow')
  , nano = require('nano')
  , npm = nano('http://isaacs.iriscouch.com/registry')
  , wac = nano('http://nick-thompson.cloudant.com/registry');

/**
 * Fetch a package at a particular revision from NPM and
 * write it to the WAC registry.
 *
 * @param {string} id
 * @param {string} rev
 * @param {function} callback (err, response)
 */

function push (id, rev, callback) {
  npm.get(id, { revs: true, rev: rev, attachments: true }, function (err, doc) {
    if (err) return callback.call(null, err);
    var latest = doc['dist-tags']['latest']
      , pkg = doc['versions'][latest];

    if (doc._id === '_design/app' || pkg.hasOwnProperty('web-audio')) {
      wac.bulk({
        docs: [doc],
        new_edits: false
      }, callback);
    }
  });
}

// Open and follow a continuous changes stream from NPM
// and update our registry every time a change registers.
follow({
  db: 'http://isaacs.iriscouch.com/registry',
  since: 'now',
  include_docs: true
}, function (err, change) {
  if (err) return console.log(err);
  if (change.deleted) return false;
  change.changes.forEach(function (o) {
    push(change.id, o.rev, function (err, res) {
      if (err) return console.log('Error: ' + JSON.stringify(err));
      console.log(res);
    });
  });
});

