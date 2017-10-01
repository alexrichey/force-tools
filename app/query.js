var matchingRules = {
  object: {
    'name': 'object',
    'regex': /^[\w]*$/,
    'regexPartsFn': (x) => {return {objectName: x};},
    'description': 'Looking up an object',
  },
  class: {
    'name': 'class',
    'regex': /^[\w]*$/,
    'regexPartsFn': (x) => {return {className: x};},
    'description': 'Looking up a class',
  },
  classMember: {
    'name': 'classMember',
    'regex': /^[\w]*\.[\w]*/,
    'regexPartsFn': (x) => {return {className: x.split('.')[0],
                                    memberName: x.split('.')[1]};},
    'description': 'Looking up a class, then the class member',
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
    this.classQuery(parts.className, this.queryResources.classSymbolTable, false);
  } else if (this.matchingRule.name === matchingRules.object.name) {
    this.status = this.statuses.DONE;
  }
},

Query.prototype.classQuery = function (className, symbolTable, exactMatchOnly) {
  var that = this;
  if (className === '') {
    that.results = symbolTable.records;
  } else {
    that.results = symbolTable.records.reduce(function(acc, classTable) {
      if (exactMatchOnly && classTable.Name === that.className) {
        return acc.concat(classTable);
      }
      else if (!exactMatchOnly && classTable.Name.indexOf(className) === 0) {
        return acc.concat(classTable);
      } else {
        return acc;
      }
    }, []);
  }
  this.status = this.statuses.DONE;
},

function ClassMemberQuery(args) {
  this.__proto__ = BaseQuery();
  this.classSymbolTable = args.classSymbolTable;
  this.className = args.className;
  this.memberName = args.memberName;

  this.run = function() {
    var that = this,
        classNames,
        classQueryArgs = {className: that.className, classSymbolTable: that.classSymbolTable,
                          exactMatch: true},
        classQuery = new ClassQuery(classQueryArgs);

    classQuery.onFinish = function(data) {
      // TODO multiple classes?
      that.results = filterClassMembers(data[0], args);
      if (args.memberAttr) {
        that.results = that.results.map(function(member) {
          return member[args.memberAttr];
        });
      }
      that.finish();
    };

    classQuery.run();
  };

  return this;
}

var getClassNamesFromTables = function(tables) {
  return tables.map(function(table) {
    return table.Name;
  }).sort();
};

var filterClassMembers = function(classTable, filters) {
  var results = [],
      st = classTable.SymbolTable,
      searchables = [];

  searchables =
    [].concat(st.properties)
    .concat(st.variables)
    .concat(st.constructors);

  results = searchables.filter(function(member) {
    return member.name.indexOf(filters.memberName) === 0;
  });
  return results;
};

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
