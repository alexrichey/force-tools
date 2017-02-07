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

completionEngine.prototype.complete = function(request) {
  var query = request.query ? request.query : '',
      rules = [];
  try {
    if (query === '') {
      return this.getUnfilteredClassesOrObjects();
    } else {
      // We've got a query!
      rules = this.findMatchingRules(query, this.executeSearchRules);
      if (rules.length > 0) {
        console.log('found %d matching rules', rules.length);
        return this.executeSearchRule(query, rules);
      }
      else {
        console.log('found no matching rules for ', query);
        return [];}
    }
  } catch (e) {
    return [];
  }
};

completionEngine.prototype.getUnfilteredClassesOrObjects = function() {
  return this.classSymbolTable.records.map(function(classTable) {
    return classTable.Name;
  });
};

completionEngine.prototype.findMatchingRules = function(query) {
  var matchingRules = [];
  try {
    for(var i = 0; i < this.matchingRules.length; i++) {
      var rule = this.matchingRules[i];
      if (query.match(rule.regex)) {
        matchingRules.push(rule);
      }
    }
  } catch(e) {
    console.log(e);
  }
  return matchingRules;
};

completionEngine.prototype.executeSearchRule = function(query, searchRules) {
  console.log('executing');
  if (searchRules[0].name == 'class/obj') {
    return this.findClasses(query);
  } else if (searchRules[0].name == 'class/obj->member') {
    var results = this.findClasses(query);
  } else {
    console.log('no matching execution for', searchRules[0]);
    return [];
  }
};

completionEngine.prototype.findClasses = function(query) {
  console.log('querying classes for', query);
  return this.classSymbolTable.records.reduce(function(acc, classTable) {
    if (classTable.Name.indexOf(query) === 0) {
      return acc.concat(classTable.Name);
    } else {
      return acc;
    }
  }, []);
};

module.exports = completionEngine;
