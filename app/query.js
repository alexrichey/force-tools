var matchingRules = {
  object: {
    'name': 'object',
    'regex': /^[\w]*$/,
    'regexPartsFn': (x) => {return {objectName: x};},
    'description': 'Looking up an object'
  },
  class: {
    'name': 'class',
    'regex': /^[\w]*$/,
    'regexPartsFn': (x) => {return {className: x};},
    'description': 'Looking up a class'
  },
  classMember: {
    'name': 'classMember',
    'regex': /^[\w]*\.[\w]*/,
    'regexPartsFn': (x) => {return {className: x.split('.')[0],
                                    memberName: x.split('.')[1]};},
    'description': 'Looking up a class, then the class member'
  }
};

function Query(args, matchingRule) {
  this.queryParams = args.queryParams;
  this.queryResources = args.queryResources;
  this.matchingRule = matchingRule;
  this.statuses = {NEW: 'new', RUNNING: 'running', DONE: 'done', FAILED: 'failed'};
  this.status = this.statuses.NEW;

  this.results = [];
  this.errors = [];
  this.timeOut = 1000; //ms

  return this;
}

Query.prototype.run = function () {
  console.log('query started: ', this.matchingRule.description);
  this.status = this.statuses.RUNNING;

  var parts = this.matchingRule.regexPartsFn(this.queryParams.searchTerm);

  if (this.matchingRule.name === matchingRules.class.name) {
    if (typeof this.queryResources.classSymbolTable === 'undefined') {
      throw new Error('No class symbol table was provided for class query');
    }
    this.results = this.queryClasses(parts.className, false);
    this.status = this.statuses.DONE;
  } else if (this.matchingRule.name === matchingRules.classMember.name) {
    if (typeof this.queryResources.classSymbolTable === 'undefined') {
      throw new Error('No class symbol table was provided for classMember query');
    }
    this.results = this.queryClassMembers(parts.className, parts.memberName, false);
    this.status = this.statuses.DONE;
  } else if (this.matchingRule.name === matchingRules.object.name) {
    this.status = this.statuses.DONE;
  }
},

Query.prototype.queryClasses = function (className, exactMatchOnly) {
  var that = this,
      symbolTable = that.queryResources.classSymbolTable;
      results = [];
  if (className === '') {
    results = symbolTable.records;
  } else {
    results = symbolTable.records.reduce(function(acc, classTable) {
      if (exactMatchOnly && classTable.Name === className) {
        return acc.concat(classTable);
      }
      else if (!exactMatchOnly && classTable.Name.indexOf(className) === 0) {
        return acc.concat(classTable);
      } else {
        return acc;
      }
    }, []);
  }
  return results;
},

Query.prototype.queryClassMembers = function(className, memberName, exactMatchOnly) {
  var symbolTable = this.queryResources.classSymbolTable;
      results = [];

  var classes = this.queryClasses(className, true);
  if (classes.length === 0) {
    return [];
  } else {
    results = this.filterClassMembers(classes[0], memberName);
  }
  return results;
},

Query.prototype.filterClassMembers = function(classTable, memberName) {
  var results = [];

  searchables = [].concat(classTable.SymbolTable.properties)
                  .concat(classTable.SymbolTable.variables)
                  .concat(classTable.SymbolTable.constructors);

  results = searchables.filter(function(member) {
    return member.name.indexOf(memberName) === 0;
  });
  return results;
}

function makeQueries(args) {
  var error,
      matches = [],
      that = this;
  try {
    for(var key in matchingRules) {
      var rule = matchingRules[key];
      if (args.queryParams.searchTerm.match(rule.regex)) {
        matches.push(new Query(args, rule));
      }
    }
  } catch(errors) {
    error = errors;}
  return matches;
}

module.exports = makeQueries;
