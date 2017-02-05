function completionEngine(args) {
  this.objectsSymbolTable = args.objectsSymbolTable;
  this.classSymbolTable = args.classSymbolTable;

  this.lookupRules = [
    {'name' : 'class/obj->attr',
      'path': [['class', 'attr'], ['object', 'attr']],
      'regex' : /^[\w]*\.[\w]*/,
      'description' : 'Looking up an object, then the attributes'},
    {'name' : 'class/obj',
      'path' : [['class'], ['object']],
      'regex' : /^[\w]*$/,
      'description' : 'Looking up just an object or class'}
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
      fields = fields.filter(function(field) {
        return field.lastIndexOf(fieldAbbrev) === 0;
      });
    }

    return fields;

  } catch (e) {
    return [];
  }
};

completionEngine.prototype.complete = function(request) {
  var filter = request.filter ? request.filter : '',
      filterType;
  try {
    if (filter === '') {
      return this.classSymbolTable.records.map(function(classTable) {
        return classTable.Name;
      });

    } else {
      filterType = this.findMatchingRules(filter);

      if (true) {
        return this.classSymbolTable.records.reduce(function(acc, classTable) {
          if (classTable.Name.indexOf(filter) === 0) {
            return acc.concat(classTable.Name);
          } else {
            return acc;
          }
        }, []);

      } else {
        return [];
      }

    }
  } catch (e) {
    console.log(e);
    return [];
  }
};

completionEngine.prototype.findMatchingRules = function(filter) {
  var lookupRules = [];
  try {
    for(var i = 0; i < this.lookupRules.length; i++) {
      var lookupRule = this.lookupRules[i];
      if (filter.match(lookupRule.regex)) {
        console.log(filter + ' matched ' + lookupRule.name);
        lookupRules.push(lookupRule);
      }
    }
  } catch(e) {
    console.log(e);
  }
  return lookupRules;
};

completionEngine.prototype.runFilter = function(filterPaths) {

};

module.exports = completionEngine;
