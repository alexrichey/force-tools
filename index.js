var express = require('express'),
    setSymbolTable = require('./test.js'),
    app = express(),
    symbolTable = {},
    lightning = require('./resources/lightning.json');


function getComponents () {
  var components = lightning.components;
  var keys = Object.keys(components);
  var completions = [];
  
  for(var i = 0; i < keys.length; i++) {
    var child = components[keys[i]];
    if (typeof(child) === 'object') {
      Object.keys(child).map(function (k) {
        completions.push(keys[i] + ":" + k);
      });
    }
  }
  return completions;
};

app.use('/complete/me', function (req, res, next) {
  res.send(getComponents());
});

app.use('/gen-symboltable', function (req, res, next) {
  setSymbolTable(res.send);
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});


// sample symbol table query
// /services/data/v37.0/tooling/query/?q=Select+Id,Name,SymbolTable+From+ApexClass
