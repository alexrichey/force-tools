function completionEngine(args) {
  this.objectsSymbolTable = args.objectsSymbolTable;
  this.classSymbolTable = args.classSymbolTable;

  this.matchingRules = [
    {'name' : 'class/obj',
     'path' : [['class'], ['object']],
     'regex' : /^[\w]*$/,
     'description' : 'Looking up just an object or class',
     'fn' : this.findClasses
    },
    {'name' : 'class/obj->member',
     'path': [['class', 'member'], ['object', 'member']],
     'regex' : /^[\w]*\.[\w]*/,
     'description' : 'Looking up an object, then the member',
     'fn' : this.findClasses,
     'cb' : this.findMethods
    }
  ];
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

completionEngine.prototype.complete = function(request, fn) {
  var query = request.query ? request.query : '',
      rules = [],
      errors,
      that = this;
      returnData = [];
    if (query === '') {
      returnData = this.getUnfilteredClassesOrObjects();
      fn(null, returnData);
    } else {
      // We've got a query!
      returnData = that.findMatchingRules(query, function(errors, data) {
        that.executeSearchRule(data, function(errors, data) {
          fn(null, data);
        });
      });
    }
};

completionEngine.prototype.getUnfilteredClassesOrObjects = function() {
  return this.classSymbolTable.records.map(function(classTable) {
    return classTable.Name;
  });
};

completionEngine.prototype.findMatchingRules = function(query, fn) {
  console.log('matching rules for query', query);
  var matchingRules = [],
      error,
      returnData = {query : query, matchingRules : []};
  try {
    for(var i = 0; i < this.matchingRules.length; i++) {
      var rule = this.matchingRules[i];
      if (query.match(rule.regex)) {
        matchingRules.push(rule);
      }
    }
    returnData['matchingRules'] = matchingRules;
  } catch(errors) {
    console.log('errors =', errors);
    error = 'error';
  }
  return fn(error, returnData);
};

completionEngine.prototype.executeSearchRule = function(data, fn) {
  var searchRules = data.matchingRules,
      errors,
      returnData = [];

  if (searchRules[0].name == 'class/obj') {
    returnData = this.findClasses(data.query);
  } else if (searchRules[0].name == 'class/obj->member') {
    returnData = this.findClasses(data.query);
  } else {
    console.log('no matching execution for', searchRules[0]);
    return [];
  }
  fn(null, returnData);
};

completionEngine.prototype.findClasses = function(query) {
  return this.classSymbolTable.records.reduce(function(acc, classTable) {
    if (classTable.Name.indexOf(query) === 0) {
      return acc.concat(classTable.Name);
    } else {
      return acc;
    }
  }, []);
};

module.exports = completionEngine;
