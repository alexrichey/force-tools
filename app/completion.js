var getQueries = require('./query'),
    _ = require('underscore');

function CompletionEngine(args, fn) {
  this.objectsSymbolTable = args.objectsSymbolTable;
  this.classSymbolTable = args.classSymbolTable;

  this.queryResources = [
    this.objectsSymbolTable,
    this.classSymbolTable
  ];

  this.finished = false;
  this.queries = [];
}

CompletionEngine.prototype.run = function(queryParams, cbFn) {
  this.getQueriesForMatchingRules(queryParams, function(err, queries) {
    if (err) { console.log('Error constructing queries for matching rules: ', err); return;}
    runQueries(queries, function(err, completedQueries) {
      if (err) { console.log('Error running queries: ', err); return;}
      cbFn(err, completedQueries);
    });
  });
};

CompletionEngine.prototype.getQueriesForMatchingRules = function(queryParams, fn) {
  var queryArgs = {classSymbolTable: this.classSymbolTable, queryParams: queryParams},
      queries = [],
      errors;
  try {
    queries = getQueries(queryArgs);
  } catch (err) {
    errors = err;
  }
  fn(errors, queries);
};

runQueries = function(queries, fn) {
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
