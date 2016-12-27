const note = require('./note');
const util = require('./util');
const auth = require('./auth');
const connect = require('./db');

const respondAndClose = util.respondAndClose;

function app(event, context, callback) {
  if (!event || !event.context) {
    callback({
      error: 'Not a valid event object'
    });
  }

  let userId;

  return auth(event.params.header.Authorization)
    .then(id => userId = id)
    .then(connect)
    .then(db => handleRequest(db, userId, event, callback))
    .catch(err => callback(err));
}

function handleRequest(db, userId, event, callback) {
  const noteId = util.getIdFromPath(event.params.path.proxy);

  switch (event.context.httpMethod) {
    case 'POST':
      return note.addNote(db, userId, event.bodyJson)
        .then(res => respondAndClose(db, callback, null, res))
        .catch(err => respondAndClose(db, callback, err, null));
      break;
    case 'PUT':
      if (!noteId) {
        return respondAndClose(db, callback, 'Missing id parameter', null);
      }
      return note.updateNote(db, userId, noteId, event.bodyJson)
        .then(res => respondAndClose(db, callback, null, res))
        .catch(err => respondAndClose(db, callback, err, null));
      break;
    case 'DELETE':
      if (!noteId) {
        return respondAndClose(db, callback, 'Missing id parameter', null);
      }
      return note.deleteNote(db, userId, noteId)
        .then(res => respondAndClose(db, callback, null, res))
        .catch(err => respondAndClose(db, callback, err, null));
      break;
    case 'GET':
      return note.getNotes(db, userId)
        .then(res => respondAndClose(db, callback, null, res))
        .catch(err => respondAndClose(db, callback, err, null));
    default:
      respondAndClose(db, callback, null, {
        result: 'unhandled request'
      });
  }
}

module.exports = app;
