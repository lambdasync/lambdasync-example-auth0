'use strict';
const MongoClient = require('mongodb').MongoClient;

function connect() {
  const MONGO_URL = process.env.MONGO_URL || null;

  return new Promise((resolve, reject) => {
    MongoClient.connect(MONGO_URL, function (err, db) {
      if (err) {
        return reject(err);
      }
      return resolve(db);
    });
  });
}

module.exports = connect;
