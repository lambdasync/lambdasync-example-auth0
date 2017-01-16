'use strict';
const CONSTANTS = require('./constants');

function isResponseObject(subject) {
  return typeof response === 'object' && response.statusCode && response.headers && response.body;
}

function formatResponse(statusCode, response) {
  // Check if we have a valid response object, and if so, return it
  if (isResponseObject(response)) {
    return response;
  }

  let body = '';
  try {
    if (response) {
      body = JSON.stringify(response);
    } else {
      body = JSON.stringify('');
    }
  } catch(err) {
    body = JSON.stringify(response.toString())
  }

  return {
    statusCode: statusCode || CONSTANTS.STATUS_CODES.OK,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body
  };
}

function respondAndClose(db, callback, response, statusCode) {
  db.close();
  return callback(null, formatResponse(statusCode, response));
}

const idRegex = /^\/(.*?)(\/|$)/;
function getIdFromPath(path) {
  const match = idRegex.exec(path);
  return match && match[1];
}

module.exports = {
  respondAndClose,
  getIdFromPath,
  formatResponse
};
