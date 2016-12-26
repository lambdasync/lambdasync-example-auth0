const MongoClient = require('mongodb').MongoClient;

const note = require('./note');
const util = require('./util');

const respondAndClose = util.respondAndClose;

function app(event, context, callback) {
  if (!event || !event.context) {
    callback({
      error: 'Not a valid event object'
    });
  }

  const MONGO_URL = process.env.MONGO_URL || null;
  const noteId = util.getIdFromPath(event.params.path.proxy);

  MongoClient.connect(MONGO_URL, function (err, db) {
    if (err) {
      return callback(err);
    }

    switch (event.context.httpMethod) {
      case 'POST':
        return note.addNote(db, event.bodyJson)
          .then(res => respondAndClose(db, callback, null, res))
          .catch(err => respondAndClose(db, callback, err, null));
        break;
      case 'PUT':
        if (!noteId) {
          return respondAndClose(db, callback, 'Missing id parameter', null);
        }
        return note.updateNote(db, noteId, event.bodyJson)
          .then(res => respondAndClose(db, callback, null, res))
          .catch(err => respondAndClose(db, callback, err, null));
        break;
      case 'DELETE':
        if (!noteId) {
          return respondAndClose(db, callback, 'Missing id parameter', null);
        }
        return note.deleteNote(db, noteId)
          .then(res => respondAndClose(db, callback, null, res))
          .catch(err => respondAndClose(db, callback, err, null));
        break;
      case 'GET':
        return note.getNotes(db)
          .then(res => respondAndClose(db, callback, null, res))
          .catch(err => respondAndClose(db, callback, err, null));
      default:
        respondAndClose(db, callback, null, {
          result: 'unhandled request'
        });
    }
  });
}

module.exports = app;
