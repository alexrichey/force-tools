function BaseQuery(args) {
  this.statuses = {new: 'new', running: 'running', done: 'done', failed: 'failed'};
  this.status = this.statuses.new;
  this.results = [];
  this.errors = [];
  this.timeOut = 1000; //ms

  this.finish = function () {
    this.status = this.statuses.done;
    this.onFinish(this.results);
  };

  this.onFinish = function(data) {}; // override by user;

  this.run = function(args) { // override in inheriting objects
    this.finish();
  };

  return this;
}

function ClassQuery(args) {
  this.__proto__ = BaseQuery();
  this.classSymbolTable = args.classSymbolTable;
  this.className = args.className;
  this.outputFormat = args.output;

  this.run = function() {
    var that = this;
    if (that.className === '') {
      that.results = that.classSymbolTable.records;
    } else {
      that.results = that.classSymbolTable.records.reduce(function(acc, classTable) {
        if (classTable.Name.indexOf(that.className) === 0) {
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

var getClassNamesFromTables = function(tables) {
  return tables.map(function(table) {
    return table.Name;
  }).sort();
};

var filterClassMembers = function(classTable, filters) {
  console.log(classTable);
  classTable.SymbolTable.reduce(function(acc, classTable) {
    if (classTable.Name.indexOf(filters.memberName) === 0) {
      return acc.concat(classTable);
    } else {
      return acc;
    }
  }, []);
};

function ClassMemberQuery(args) {
  this.__proto__ = BaseQuery();
  this.classSymbolTable = args.classSymbolTable;
  this.className = args.className;
  this.memberName = args.memberName;

  this.run = function() {
    var that = this,
        classNames,
        classQueryArgs = {className: that.className, classSymbolTable: that.classSymbolTable},
        classQuery = new ClassQuery(classQueryArgs);

    classQuery.onFinish = function(data) {
      // TODO multiple classes?
      that.results = filterClassMembers(data[0], args);
      if (args.namesOnly) {console.log('getting object names!');}
      if (args.sorted) {console.log('sorting!');}
    };

    classQuery.run();


    that.finish();
  };

  return this;
}

module.exports = function(args) {
  if (args.className && args.memberName) {
    console.log('making a classMember query');
    return new ClassMemberQuery(args);
  } else if (args.className !== null && args.className !== undefined){
    console.log('making a class query');
    return new ClassQuery(args);
  }
};
