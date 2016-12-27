const jwt = require('jsonwebtoken');

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || null;
const AUTH0_CLIENT = process.env.AUTH0_CLIENT || null;
const AUTH0_SECRET = process.env.AUTH0_SECRET || null;

const credentials = {
  audience: AUTH0_CLIENT,
  issuer: `https://${AUTH0_DOMAIN}/`
};

function authenticate(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject('Authorization token missing.');
    }

    jwt.verify(
      token.replace('Bearer ', ''),
      AUTH0_SECRET,
      credentials,
      (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res.sub);
      }
    );
  });
}

module.exports = authenticate;
