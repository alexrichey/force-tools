var Query = require('./query');


function CompletionEngine(args) {
  this.objectsSymbolTable = args.objectsSymbolTable;
  this.classSymbolTable = args.classSymbolTable;

  this.matchingRules = [
    {'name' : 'object',
     'path' : [['object']],
     'regex' : /^[\w]*$/,
     'description' : 'Looking up an object'
    },
    {'name' : 'class',
     'path' : [['class']],
     'regex' : /^[\w]*$/,
     'description' : 'Looking up a class'
    },
    {'name' : 'class/obj->member',
     'path': [['class', 'member'], ['object', 'member']],
     'regex' : /^[\w]*\.[\w]*/,
     'description' : 'Looking up an object, then the member'
    }
  ];
};

CompletionEngine.prototype.complete = function(request, fn) {
  var errors,
      that = this,
      query;

  query = {
    searchTerm : request.query ? request.query : '',
    matchingRules : [],
    results : [],
    errors : []
  };

  that.findMatchingRules(query, function(errors, query) {
    console.log('found %s matching rules', query.matchingRules.length);
    that.executeAllMatchingRules(query, function(errors, query) {
      console.log('finished query. Got %s result sets', query.results.length);
      fn(null, query);
    });
  });
};

CompletionEngine.prototype.findMatchingRules = function(query, fn) {
  var error;
  console.log('matching rules for query', query);
  try {
    for(var i = 0; i < this.matchingRules.length; i++) {
      var rule = this.matchingRules[i];
      if (query.searchTerm.match(rule.regex)) {query.matchingRules.push(rule);}}
  } catch(errors) {
    console.log('errors =', errors);
    error = 'error';
  }
  fn(error, query);
};

CompletionEngine.prototype.executeAllMatchingRules = function(query, fn) {
  var queries = [];
  for(var i = 0; i < query.matchingRules.length; i++) {
    queries.push(new Query(query.matchingRules[i]));
  }


  console.log('executing search rules');
  var that = this,
      errors;
  that.executeNextMatchingRule(query, function (errors, query) {
    query.matchingRules.shift();
    if (query.matchingRules.length > 0) {
      that.executeAllMatchingRules(query, fn);
    } else {
      console.log('-- done with all search rules');
      fn(errors, query);
    }
  });
};

CompletionEngine.prototype.executeNextMatchingRule = function(query, fn) {
  var nextRule = query.matchingRules[0],
      that = this;
  console.log('executing query for Matching Rule:', nextRule.name);

  switch (nextRule.name) {
  case 'object':
    that.findObjects(query, function(errors, query) {
      fn(null, query);
    });
    break;

  case 'class':
    console.log('completing classes for:', query.searchTerm);
    that.findClasses(query, function(errors, query) {
      fn(null, query);
    });
    break;

  case 'class/obj->member':
    console.log('completing classes/objects for:', query.searchTerm);
    that.findClasses(query, function(errors, query) {
      that.findClassMembers(query, function(errors, query) {
        console.log('found class members');
        fn(null, query);
      });
    });
    break;
  }
};

CompletionEngine.prototype.findClasses = function(query, fn) {
  var result = {};

  if (query.searchTerm === '') {
    console.log('wildcard class search!');
    this.getUnfilteredClasses(query, function (error, query) {
      fn(error, query);
    });
  } else {
    console.log('querying for', query.searchTerm);
    result.records = this.classSymbolTable.records.reduce(function(acc, classTable) {
      if (classTable.Name.indexOf(query.searchTerm) === 0) {
        return acc.concat(classTable.Name);
      } else {
        return acc;
      }
    }, []);
    query.results.push(result);
    console.log('done finding classes', query.results);
    fn(null, query);
  }
};

CompletionEngine.prototype.findObjects = function(query, fn) {
  fn(null, query);
};

CompletionEngine.prototype.getUnfilteredClasses = function(query, fn) {
  console.log('getting unfiltered classes');
  var result = {
    records : this.classSymbolTable.records.map(function(classTable) {
      return classTable.Name;
    })
  };
  query.results.push(result);
  fn(null, query);
};

CompletionEngine.prototype.findClassMembers = function(query, fn) {
  var results = [],
      className = query.results[0],
      memberPart = query.memberPart;
  console.log(query);

  console.log('Finding class members for ', className);
  results = this.classSymbolTable.records.reduce(function(acc, classTable) {
    if (classTable.Name.indexOf(query) === 0) {
      return acc.concat(classTable.Name);
    } else {
      return acc;
    }
  }, []);
  console.log('done finding classes', results);

  fn(null, results);
};

CompletionEngine.prototype.getOrderedFormattedQueryResults = function(query, fn) {
  console.log('ordering and formatting results');
  var results = [],
      result;
  for(var resultsIndex = 0; resultsIndex < query.results.length; resultsIndex++) {
    result = query.results[resultsIndex];
    for(var i = 0; i < result.records.length; i++) {
      results.push(result.records[i]);
    }
  }
  results.sort();
  console.log('returning sorted results', results);
  fn(null, results);
};

module.exports = CompletionEngine;
