var Query = require('./query'),
    _ = require('underscore');

function CompletionEngine(args, fn) {
  this.objectsSymbolTable = args.objectsSymbolTable;
  this.classSymbolTable = args.classSymbolTable;

  this.searchTerm = args.searchTerm;
  this.sorted = args.sorted;
  this.namesOnly = args.namesOnly;
  this.memberAttr = args.memberAttr;
  this.onFinish = fn ? fn : function(data) {};
  this.finished = false;
  this.queries = [];

  this.matchingRules = [
    {'name' : 'object',
     'regex' : /^[\w]*$/,
     'description' : 'Looking up an object',
     'matchingQueries' : ['object']
    },
    {'name' : 'class',
     'regex' : /^[\w]*$/,
     'description' : 'Looking up a class',
     'matchingQueries' : ['class']
    },
    {'name' : 'class/obj->member',
     'regex' : /^[\w]*\.[\w]*/,
     'description' : 'Looking up an object, then the member',
     'matchingQueries' : ['object', 'class']
    }
  ];
};

CompletionEngine.prototype.finish = function() {
  this.onFinish(this.queries);
};

CompletionEngine.prototype.run = function() {
  var that = this;
  that.findMatchingRules(that.searchTerm, function(err, matchingRules) {
    that.resolveMatchingRulesToQueries(matchingRules, function(err, queries) {
      that.runQueries(queries, function(err, stats) {
        that.queries = that.queries.map(function(query) {
          return query.results;
        });
        that.queries = _.flatten(that.queries);
        that.finish();
      });
    });
  });
};

CompletionEngine.prototype.findMatchingRules = function(searchTerm, fn) {
  var error,
      matches = [],
      that = this;
  try {
    for(var i = 0; i < this.matchingRules.length; i++) {
      var rule = this.matchingRules[i];
      if (searchTerm.match(rule.regex)) {
        console.log('matched %s with %s', searchTerm, rule.name);
        matches.push(rule);
      }
    }
  } catch(errors) {
    console.log('errors =', errors);
    error = 'error';
  }
  fn(error, matches);
};

CompletionEngine.prototype.resolveMatchingRulesToQueries = function(matchingRules, fn) {
  var queryArgs = {classSymbolTable: this.classSymbolTable, searchTerm: this.searchTerm,
                   sorted: this.sorted, namesOnly: this.namesOnly};

  for(var i = 0; i < matchingRules.length; i++) {
    var rule = matchingRules[i];
    if (rule.name === 'class') {
      queryArgs.className = this.searchTerm;
      this.queries.push(Query(queryArgs));
    } else if (rule.name === 'class/obj->member') {
      queryArgs.className = this.searchTerm.split('.')[0];
      queryArgs.memberName = this.searchTerm.split('.')[1];
      queryArgs.memberAttr = this.memberAttr;
      console.log("this.memberAttr = ", this.memberAttr);
      this.queries.push(Query(queryArgs));
    }
  }
  fn(null, this.queries);
};

CompletionEngine.prototype.runQueries = function(queries, fn) {
  for(var i = 0; i < queries.length; i++) {
    var query = queries[i];
    if (query.status === query.statuses.new) {query.run();}
  }

  var unresolvedCount = queries.filter(function(query) {
    return query.status === query.statuses.new || query.status === query.statuses.running ;
  }).length;

  if (unresolvedCount > 0) {
    this.runQueries(queries);
  } else {
    fn(null, this.queries);
  }
};

module.exports = function(args, fn) {
  return new CompletionEngine(args, fn);
};
