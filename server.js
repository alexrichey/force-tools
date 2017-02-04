var express = require('express'),
    fs = require('fs'),
    jsforceWrapper = require('./app/jsforce-wrapper.js'),
    classSymbolTable = require('./resources/symbol_table.json'),
    completionEngine = require('./app/completion.js'),
    config =    JSON.parse(fs.readFileSync('./config.json')),
    lightning = JSON.parse(fs.readFileSync('./resources/lightning.json', 'utf8')),
    vf =        JSON.parse(fs.readFileSync('./resources/visualforce.json', 'utf8'));

app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));

function initEngine(st) {
  try {
    engine = new completionEngine({classSymbolTable: st});
    console.log('engine successfully created');
  } catch(e) {
    console.log('Error loading symbol table!');
  }
};
initEngine(classSymbolTable);

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
  res.render('index', { title: 'Force Tools', message: 'Use the force, Luke!', username: config.username });
});

app.use('/complete/me', function (req, res, next) {
  res.send(getComponents());
});

app.use('/refresh-symbol-table', function (req, res, next) {
  console.log(config.username, config.password, config.securityToken);
  jsforceWrapper(config.username, config.password, config.securityToken, console.log);
  res.send('refreshing');
});

app.use('/api/complete', function (req, res, next) {
  var methodName = req.query.name;
  var methods = symbolTableHelper.getClassMethods(methodName);
  res.send(methods);
});

app.use('/complete', function (req, res, next) {
  console.log('completing for ' + req.query.filter);
  var completions;
  if (engine) {
    completions = engine.completeClasses({filter : req.query.filter});
    res.render('completions', {title: "Completions", completions: completions}) ;
  } else {
    console.log('no engine');
    res.render('completions', {title: "Completions", completions: []}) ;
  }
});

app.use('/old/complete', function (req, res, next) {
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
