const path = require('path');
const express = require('express');

const app = express();

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3001, function () {
  console.log('Lambdasync example app listening on port 3001!');
});
