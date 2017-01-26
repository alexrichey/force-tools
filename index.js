var symbolTable = require('./app/symbol-table');

var testMethod = symbolTable.getClassMethods('TestJIRAMapper')[1];

var formatted = symbolTable.formatClassMethod(testMethod);

var a = {"annotations":[{"name":"IsTest"}],
         "location":{"column":28,"line":10},
         "modifiers":["private" ,"static" ,"testMethod"]
         ,"name":"mappedFields_validType"
         ,"parameters":[]
         ,"references":[]
         ,"returnType":"void"
         ,"type":null};

console.log(formatted);
