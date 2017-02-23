function completionEngine(args) {
  this.objectsSymbolTable = args.objectsSymbolTable;
  this.classSymbolTable = args.classSymbolTable;
  this.timeOut_ms = 100;
  this.pollingInterval = 1;

  this.matchingRules = [
    {'name' : 'class/obj',
     'path' : [['class'], ['object']],
     'regex' : /^[\w]*$/,
     'description' : 'Looking up just an object or class'
    },
    {'name' : 'class/obj->member',
     'path': [['class', 'member'], ['object', 'member']],
     'regex' : /^[\w]*\.[\w]*/,
     'description' : 'Looking up an object, then the member'
    }
  ];
};

completionEngine.prototype.complete = function(request, fn) {
  var query = request.query ? request.query : '',
      rules = [],
      errors,
      that = this,
      returnData = [];

  that.findMatchingRules(query, function(errors, data) {
    console.log('matching rules are', data);
    that.executeSearchRules(data, function(errors, data) {
      console.log('returned from executeSearchRules, data', data);
      fn(null, data);
    });
  });
};

completionEngine.prototype.completeObjects = function(request) {
  try {
    var objectSplit = request.context.split(/\./),
        objectName = objectSplit[0],
        fieldAbbrev = objectSplit[1] ? objectSplit[1] : '',
        fieldData = this.symbolTable['objects'][objectName]['fields'];

    fields = Object.keys(fieldData);
    if (fieldAbbrev !== '') {
      fields = fields.query(function(field) {
        return field.lastIndexOf(fieldAbbrev) === 0;
      });
    }

    return fields;

  } catch (e) {
    return [];
  }
};

completionEngine.prototype.getUnfilteredClassesOrObjects = function(error, data) {
  return this.classSymbolTable.records.map(function(classTable) {
    return classTable.Name;
  });
};

completionEngine.prototype.findMatchingRules = function(query, fn) {
  console.log('matching rules for query', query);
  var matchingRules = [],
      error,
      data = {query : query, matchingRules : []};
  try {
    for(var i = 0; i < this.matchingRules.length; i++) {
      var rule = this.matchingRules[i];
      if (query.match(rule.regex)) {matchingRules.push(rule);}}
    data['matchingRules'] = matchingRules;
  } catch(errors) {
    console.log('errors =', errors);
    error = 'error';
  }
  fn(error, data);
};

completionEngine.prototype.executeSearchRules = function(data, fn) {
  var searchRules = data.matchingRules,
      errors,
      completions = [];

  console.log('executing search rules');
  if (searchRules[0].name == 'class/obj') {
    console.log('completing for class/obj');
    this.findClasses(data.query, function(errors, data) {
      fn(null, data);
    });
  } else if (searchRules[0].name == 'class/obj->member') {
    completions = this.findClasses(data.query);
  } else {
    console.log('no matching execution for', searchRules[0]);
    return [];
  }
};

completionEngine.prototype.findClasses = function(query, fn) {
  var data = [];

  data = this.classSymbolTable.records.reduce(function(acc, classTable) {
    if (classTable.Name.indexOf(query) === 0) {
      return acc.concat(classTable.Name);
    } else {
      return acc;
    }
  }, []);
  console.log('done finding classes', data);

  fn(null, data);
};

completionEngine.prototype.runQueries = function(queries, timeElapsed_ms, fn) {
  var queriesAreFinished = false,
      that = this,
      finishedQueries = [];
  for(var i = 0; i < queries.length; i++) {
    if (queries[i].isComplete) {
      queriesAreFinished = true;
      break;
    }
  }

  if (timeElapsed_ms > this.timeOut_ms || queriesAreFinished) {
    finishedQueries = queries.filter(function(query) {
      return query.isComplete;
    });
    fn('', finishedQueries);
  } else {
    setTimeout(function() {
      console.log('timeing out');
      that.runQueries(queries, timeElapsed_ms + that.pollingInterval, fn);
    }, that.pollingInterval);
  }
};

module.exports = completionEngine;
