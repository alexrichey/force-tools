var express = require('express');
var lightning = require('./resources/lightning.json');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use('/completions', function (req, res, next) {
  console.log(lightning.ui);
  res.send({"objects":[
    {'Name': 'Tester'},
    {'Name': 'Other'}]});
});

app.get('/completions', function (req, res) {
  res.send(res);
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
