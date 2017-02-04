function completionEngine(args) {
  this.objectsSymbolTable = args.objectsSymbolTable;
  this.classSymbolTable = args.classSymbolTable;
}

completionEngine.prototype.completeObjects = function(request) {
  try {
    var objectSplit = request.context.split(/\./),
        objectName = objectSplit[0],
        fieldAbbrev = objectSplit[1] ? objectSplit[1] : '',
        fieldData = this.symbolTable['objects'][objectName]['fields'];

    fields = Object.keys(fieldData);
    if (fieldAbbrev !== '') {
      fields = fields.filter(function(field) {
        return field.lastIndexOf(fieldAbbrev) === 0;
      });
    }

    return fields;

  } catch (e) {
    return [];
  }
};

completionEngine.prototype.completeClasses = function(request) {
  var filter = request.filter ? request.filter : '';
  console.log('filter is: ', filter);
  try {
    if (filter === '') {
      return this.classSymbolTable.records.map(function(classTable) {
        return classTable.Name;
      });

    } else {
      return this.classSymbolTable.records.reduce(function(acc, classTable) {
        if (classTable.Name.indexOf(filter) === 0) {
          return acc.concat(classTable.Name);
        } else {
          return acc;
        }
      }, []);
    }
  } catch (e) {
    console.log(e);
    return [];
  }
};

module.exports = completionEngine;
