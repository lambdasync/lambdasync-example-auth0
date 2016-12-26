const uuid = require('node-uuid').v4;

const CONSTANTS = require('./constants');

function getNotes(db, filter) {
  filter = filter || {};
  return new Promise((resolve, reject) => {
    db.collection(CONSTANTS.COLLECTION_NOTES).find(filter).toArray((err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function deleteNote(db, id) {
  if (!id) {
    return Promise.reject();
  }
  return new Promise((resolve, reject) => {
    db
      .collection(CONSTANTS.COLLECTION_NOTES)
      .deleteOne({id}, err => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.stringify(SUCCESS));
      });
  });
}

function updateNote(db, noteId, note) {
  if (!note || !noteId) {
    return Promise.reject();
  }
  return new Promise((resolve, reject) => {
    db
      .collection(CONSTANTS.COLLECTION_NOTES)
      .updateOne({id: noteId}, Object.assign({}, note), err => {
        if (err) {
          return reject(err);
        }
        return resolve(JSON.stringify(SUCCESS));
      });
  });
}

function addNote(db, note) {
  return new Promise((resolve, reject) => {
    db
      .collection(CONSTANTS.COLLECTION_NOTES)
      .insertOne(
        Object.assign({}, note, {
          id: uuid(),
          pinned: false
        }),
        err => {
          if (err) {
            reject(err);
          }
          resolve(JSON.stringify(SUCCESS));
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
