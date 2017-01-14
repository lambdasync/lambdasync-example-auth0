'use strict';
const uuid = require('node-uuid').v4;

const CONSTANTS = require('./constants');

function getNote(db, id, userId) {
  const filter = {id};
  return new Promise((resolve, reject) => {
    db.collection(CONSTANTS.COLLECTION_NOTES).findOne(filter, (err, data) => {
      if (err) {
        return reject(err);
      }
      // If a usedId is supplied check ownership
      if (typeof userId !== 'undefined' && data.userId !== userId) {
        return reject('Not authorized');
      }
      return resolve(data);
    });
  });
}

function getNotes(db, userId) {
  const filter = {userId};
  return new Promise((resolve, reject) => {
    db.collection(CONSTANTS.COLLECTION_NOTES).find(filter).toArray((err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function deleteNote(db, userId, noteId) {
  if (!noteId) {
    return Promise.reject('Missing note id');
  }

  // Make sure we have access to the note we are trying to delete
  return getNote(db, noteId, userId)
    .then(() => new Promise((resolve, reject) => {
      db
        .collection(CONSTANTS.COLLECTION_NOTES)
        .deleteOne({id: noteId}, err => {
          if (err) {
            return reject(err);
          }
          return resolve(JSON.stringify(CONSTANTS.SUCCESS_RESPONSE));
        });
    }));
}

function updateNote(db, userId, noteId, note) {
  if (!note || !noteId) {
    return Promise.reject();
  }

  return getNote(db, noteId, userId)
    .then(currentNote => new Promise((resolve, reject) => {
      db
        .collection(CONSTANTS.COLLECTION_NOTES)
        .updateOne({id: noteId}, Object.assign({}, currentNote, note), err => {
          if (err) {
            return reject(err);
          }
          return resolve(CONSTANTS.SUCCESS_RESPONSE);
        });
    }));
}

function addNote(db, userId, note) {
  if (!userId || !note) {
    return Promise.reject('No userId or note to add.');
  }
  return new Promise((resolve, reject) => {
    db
      .collection(CONSTANTS.COLLECTION_NOTES)
      .insertOne(
        Object.assign({}, note, {
          id: uuid(),
          userId,
          pinned: false
        }),
        err => {
          if (err) {
            reject(err);
          }
          resolve(CONSTANTS.SUCCESS_RESPONSE);
        }
      );
  });
}

module.exports = {
  getNotes,
  deleteNote,
  updateNote,
  addNote
};
