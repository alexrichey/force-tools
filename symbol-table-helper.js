st = 'hi there';
var jsonfile = require('jsonfile'),
    file = './resources/symbol_table.json',
    st = require(file);


var classCache = {};
function setClassCache () {
  var file = './resources/symbol_table.json';
  var st = require(file);

  // set classCache
  this.classCache = st.records.map(function (symbol) {
    return {
      name: symbol['Name'],
      id: symbol['Id']
    };
  });
  
  return st;
};

function getSymbolsForClass (className) {
  return st.records.filter(function (symbolTableEntry) {
    return symbolTableEntry['Name'] === className;
  })[0];
};

function getClasses (className) {
  return st.records.map(function (symbolTableEntry) {
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

module.exports = {getClassMethods: getClassMethods,
                  getClasses: getClasses};
