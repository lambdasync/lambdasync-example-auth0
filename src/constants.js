'use strict';
const COLLECTION_NOTES = 'personalNotes';
const SUCCESS_RESPONSE = {
  result: 'success'
};

const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  COLLECTION_NOTES,
  SUCCESS_RESPONSE,
  STATUS_CODES
};
