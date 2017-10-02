var getQueries = require('./query'),
    _ = require('underscore');

function CompletionEngine(queryResources) {
  this.queryResources = queryResources;
  this.finished = false;
  this.queries = [];
}

CompletionEngine.prototype.run = function(queryParams, cbFn) {
  this.getQueriesForMatchingRules(queryParams, function(err, queries) {
    if (err) { console.log('Error constructing queries for matching rules: ', err); return;}
    runQueries(queries, function(err, completedQueries) {
      if (err) { console.log('Error running queries: ', err); return;}
      var results = [];
      for (var i = 0; i < completedQueries.length; i++) {
        results = results.concat(completedQueries[i].results);
      }
      cbFn(null, results);
    });
  });
};

CompletionEngine.prototype.getQueriesForMatchingRules = function(queryParams, fn) {
  var queryArgs = {queryResources: this.queryResources, queryParams: queryParams},
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
  // TODO: add time limit
  var that = this;
  for(var i = 0; i < queries.length; i++) {
    var query = queries[i];
    if (query.status === query.statuses.NEW) {query.run();}
  }

  var unresolvedCount = queries.filter(function(query) {
    return query.status === query.statuses.NEW || query.status === query.statuses.RUNNING ;
  }).length;

  if (unresolvedCount > 0) {
    setTimeout(function () {
      that.runQueries(queries);
    }, 100);
  } else {
    fn(null, queries);
  }
};

module.exports = function(args, fn) {
  return new CompletionEngine(args, fn);
};
