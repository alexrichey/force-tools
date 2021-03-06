var express = require('express'),
    fs = require('fs'),
    jsforceWrapper = require('./app/jsforce-wrapper.js'),
    classSymbolTable = require('./resources/symbol_table.json'),
    TestRunner = require('./app/test_runner/test-runner.js'),
    Engine = require('./app/completion.js'),
    config =    JSON.parse(fs.readFileSync('./config.json')),
    lightning = JSON.parse(fs.readFileSync('./resources/lightning.json', 'utf8')),
    vf =        JSON.parse(fs.readFileSync('./resources/visualforce.json', 'utf8'));

app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', { title: 'Force Tools', message: 'Use the force, Luke!', username: config.username });
});

app.use('/test-runner', function (req, res, next) {
  var runner = TestRunner(config);
  runner.run(function(errors, data) {
    res.render('test', {data: data});
  });
});

app.use('/refresh-symbol-table', function (req, res, next) {
  jsforceWrapper(config.username, config.password, config.securityToken, console.log);
  res.send('refreshing');
});

app.use('/complete', function (req, res, next) {
  console.log('completing for ' + req.query.filter);
  console.log('query is', req.query);
  var queryParams = {searchTerm: req.query.filter, classSymbolTable: classSymbolTable,
                     sorted: true, namesOnly: true, memberAttr: 'name'},
      engine = Engine(queryParams, function(errors, data) {
        if (errors) {
          console.log('errors! ', data);
          res.send("errors!");
        }
        else if (req.query.api) {
          console.log('api only!', data);
          res.send(data);
        } else {
          res.render('completions', {title: "Completions", completions: data});
        }
      });
  engine.run();
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});


// sample symbol table query
// /services/data/v37.0/tooling/query/?q=Select+Id,Name,SymbolTable+From+ApexClass
