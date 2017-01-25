var fs = require('fs'),
    resourcesFile = './resources/symbol_table.json',
    symbolTable = JSON.parse(fs.readFileSync(resourcesFile, 'utf8'));

function getSymbolsForClass (className) {
  return symbolTable.records.filter(function (symbolTableEntry) {
    return symbolTableEntry['Name'] === className;
  })[0];
};

function getClasses (className) {
  return symbolTable.records.map(function (symbolTableEntry) {
    return symbolTableEntry['Name'];
  });
};

function getClassMethods (className) {
  var symbols = getSymbolsForClass(className);
  if (symbols) {
    return symbols['SymbolTable']['methods'].map(JSON.stringify);
  } else {
    return [];
  }
};

function formatClassMethod (method) {
}

module.exports = {getClassMethods: getClassMethods,
                  getClasses: getClasses,
                  formatClassMethod: formatClassMethod};
