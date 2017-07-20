const express    = require('express');
const app        = express();

const http = require('http').Server(app);


app.get('/*', redirectToHTTPS);
app.get('/', redirectToHTTPS);

function redirectToHTTPS(req, res) {
  // res.redirect(307, 'https://futureboard.olin.build');
  res.redirect(307, 'https://localhost/');
}


module.exports.listen = function(port) {
  http.listen(port);
  console.log('http listening on', port);
};
