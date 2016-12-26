function respondAndClose(db, callback, error, response) {
  db.close();
  callback(error, response);
}

const idRegex = /^api\/(.*?)(\/|$)/;
function getIdFromPath(path) {
  const match = idRegex.exec(path);
  return match && match[1];
}

module.exports = {
  respondAndClose,
  getIdFromPath
};
