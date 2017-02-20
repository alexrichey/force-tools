function Query(args) {
  this.init(args);
}

Query.prototype.init = function(args) {
  this.classSymbolTable = args.classSymbolTable;
};

Query.prototype.findClassNames = function(className, fn) {
  var data = [];
  data = this.classSymbolTable.records.reduce(function(acc, classTable) {
    if (classTable.Name.indexOf(className) === 0) {
      return acc.concat(classTable.Name);
    } else {
      return acc;
    }
  }, []);
  fn(null, data);
};

Query.prototype.getClassTables = function(className, fn) {
  var data = [];
  data = this.classSymbolTable.records.reduce(function(acc, classTable) {
    if (classTable.Name === className) {
      return acc.concat(classTable);
    } else {
      return acc;
    }
  }, []);
  fn(null, data);
};

Query.prototype.findClassesMembers = function(args, fn) {
  var className = args.className,
      memberFilter = args.memberFilter,
      that = this;
  that.getClassTables(className, function(error, classTables) {
    // TODO: filter multiple
    that.filterClassTable(classTables[0], memberFilter, function(errors, members) {
      fn(null, members);
    });
  });
};

Query.prototype.filterClassTable = function(classTable, memberFilter, fn) {
  var results = [],
      st = classTable.SymbolTable,
      searchables = [];

  searchables =
    [].concat(st.properties)
    .concat(st.variables)
    .concat(st.constructors);

  results = searchables.filter(function(member) {
    return member.name.indexOf(memberFilter.name) === 0;
  });

  fn(null, results);
};

module.exports = Query;
