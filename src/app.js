'use strict';
const note = require('./note');
const util = require('./util');
const auth = require('./auth');
const connect = require('./db');
const CONSTANTS = require('./constants');

const STATUS_CODES = CONSTANTS.STATUS_CODES;
const respondAndClose = util.respondAndClose;

function app(event, context, callback) {
  if (!event || !event.headers) {
    callback({
      error: 'Not a valid event object'
    });
  }

  let userId;

  return auth(event.headers.Authorization)
    .then(id => userId = id)
    .then(connect)
    .then(db => handleRequest(db, userId, event, callback))
    .catch(err => callback(null, util.formatResponse(500, err.message)));
}

function handleRequest(db, userId, event, callback) {
  const noteId = util.getIdFromPath(event.path);

  switch (event.httpMethod) {
    case 'POST':
      return note.addNote(db, userId, event.body)
        .then(res => respondAndClose(db, callback, res))
        .catch(err => respondAndClose(db, callback, err.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
      break;
    case 'PUT':
      if (!noteId) {
        return respondAndClose(db, callback, 'Missing id parameter', STATUS_CODES.BAD_REQUEST);
      }
      return note.updateNote(db, userId, noteId, event.body)
        .then(res => respondAndClose(db, callback, res))
        .catch(err => respondAndClose(db, callback, err.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
      break;
    case 'DELETE':
      if (!noteId) {
        return respondAndClose(db, callback, 'Missing id parameter', STATUS_CODES.BAD_REQUEST);
      }
      return note.deleteNote(db, userId, noteId)
        .then(res => respondAndClose(db, callback, res))
        .catch(err => respondAndClose(db, callback, err.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
      break;
    case 'GET':
    console.log('GET!');
      return note.getNotes(db, userId)
        .then(res => respondAndClose(db, callback, res))
        .catch(err => respondAndClose(db, callback, err.message, STATUS_CODES.INTERNAL_SERVER_ERROR));
    default:
      respondAndClose(db, callback, 'unhandled request', STATUS_CODES.BAD_REQUEST);
  }
}

module.exports = app;
