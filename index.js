var express = require('express'),
    jsforceWrapper = require('./jsforce-wrapper.js'),
    lightning = require('./resources/lightning.json'),
    vf = require('./resources/visualforce.json'),
    symbolTableHelper = require('./symbol-table-helper.js');

app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));

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

app.get('/', function (req, res) {
  res.render('index', { title: 'Force Tools', message: 'Use the force, Luke!' });
});

app.use('/complete/me', function (req, res, next) {
  res.send(getComponents());
});

app.use('/refresh-symbol-table', function (req, res, next) {
  jsforceWrapper(console.log);
  res.send('hi there');
});

app.use('/api/complete', function (req, res, next) {
  var methodName = req.query.name;
  var methods = symbolTableHelper.getClassMethods(methodName);
  res.send(methods);
});

app.use('/complete', function (req, res, next) {
  console.log('request to: ' + JSON.stringify(req.query));
  var type = req.query.type;

  if (type === 'vf') {
    res.send(vf.components);
  } else if (type === 'classes') {
    console.log(req.query);
    var className = req.query.className;
    if (className) {
      console.log('searching for class methods on ' + className);
      var symbols = symbolTableHelper.getClassMethods(className);
      res.send(symbols);
    } else {
      res.send(symbolTableHelper.getClasses());
    }
  } else if (type === 'ui'){
    res.send(getComponents());
  }
  else {
    // var methodName = req.query.name;
    // var methods = symbolTableHelper.getClassMethods(methodName);
    // res.render('methods', { title: 'Class Methods', methods: methods});
  }
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});


// sample symbol table query
// /services/data/v37.0/tooling/query/?q=Select+Id,Name,SymbolTable+From+ApexClass
