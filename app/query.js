var matchingRules = [
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
    {'name' : 'classmember',
     'regex' : /^[\w]*\.[\w]*/,
     'description' : 'Looking up an object, then the member',
     'matchingQueries' : ['object', 'class']
    }
  ];

function Query(args) {
  this.statuses = {NEW: 'new', RUNNING: 'running', DONE: 'done', FAILED: 'failed'};
  this.status = this.statuses.NEW;
  this.results = [];
  this.errors = [];
  this.timeOut = 1000; //ms

  return this;
}

function ClassQuery(args) {

  this.baseQuery = new baseQuery(args);

  this.classSymbolTable = args.classSymbolTable;
  this.className = args.className;
  this.outputFormat = args.output;

  this.run = function() {
    var that = this;
    if (that.className === '') {
      that.results = that.classSymbolTable.records;
    } else {
      that.results = that.classSymbolTable.records.reduce(function(acc, classTable) {
        if (args.exactMatch && classTable.Name === that.className) {
          return acc.concat(classTable);
        }
        else if (!args.exactMatch && classTable.Name.indexOf(that.className) === 0) {
          return acc.concat(classTable);
        } else {
          return acc;
        }
      }, []);
    }
    if (args.sorted) {this.results = this.results.sort();}
    if (args.namesOnly) {this.results = getClassNamesFromTables(this.results);}

    this.finish();
  };

  return this;
}

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

function makeQuery(args) {
  return [];
}

module.exports = makeQuery;


  // if (args.matchingRule.name === 'class') {
  //   console.log('new class query');
  //   return new ClassQuery(args);
  // } else if (args.matchingRule.name === 'classmember') {
  //   console.log('new class query');
  //   return new ClassMemberQuery(args);
  // } else {
  //
  // }

// CompletionEngine.prototype.findMatchingRules = function(searchTerm, fn) {
//   var error,
//       matches = [],
//       that = this;
//   try {
//     for(var i = 0; i < this.matchingRules.length; i++) {
//       var rule = this.matchingRules[i];
//       if (searchTerm.match(rule.regex)) {
//         matches.push(rule);
//       }
//     }
//   } catch(errors) {error = errors;}
//   fn(error, matches);
// };
