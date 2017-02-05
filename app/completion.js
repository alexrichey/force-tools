function completionEngine(args) {
  this.objectsSymbolTable = args.objectsSymbolTable;
  this.classSymbolTable = args.classSymbolTable;

  this.lookupRules = {
    'class/obj->attr' : {
      'path': [['class', 'attr'], ['object', 'attr']],
      'regex' : /[\w]*\.[\w]*/,
      'description' : 'Looking up an object, then the attributes'
    },
    'class/obj' : {
      'path' : [['class'], ['object']],
      'regex' : /[\w]*$/,
      'description' : 'Looking up just an object or class'
    }
  };
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
  console.log('filter is: ', filter);
  try {
    if (filter === '') {
      return this.classSymbolTable.records.map(function(classTable) {
        return classTable.Name;
      });

    } else {
      filterType = this.processFilter(filter);
      console.log(filterType);

      if (filterType.length > 0) {
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

completionEngine.prototype.processFilter = function(filter) {
  try {
    var container_attr_regex = /[\w]*\.[\w]*/,
        class_obj_regex =      /[\w]*$/;
    if (filter.match(container_attr_regex)) {
      return [['class', 'attr'], ['object', 'attr']];
    } else if (filter.match(class_obj_regex))  {
      return [['class'], ['object']];
    }
    return [];
  } catch(e) {
    console.log(e);
  }
};

completionEngine.prototype.runFilter = function(filterPaths) {

};

module.exports = completionEngine;
