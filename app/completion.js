function completionEngine(args) {
  this.symbolTable = args.symbolTable;
}

completionEngine.prototype.complete = function(request) {
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
};

module.exports = completionEngine;
