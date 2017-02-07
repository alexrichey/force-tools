var symbolTable = require('../resources/symbol_tables/symbol_table.json'),
    completionEngine = require('../../app/completion.js'),
    _ = require('underscore'),
    engine = new completionEngine({classSymbolTable : symbolTable});

describe("Class completion", function() {
  it('should be able to complete basic class lookups from the symbol table', function() {
    expect(engine.complete({query: "Mock"}).sort()).toEqual(['MockClass', 'MockClassOther'].sort());
    expect(engine.complete({query: "MockClassO"}).sort()).toEqual(['MockClassOther']);
  });

  // it('should be able to lookup attributes from the classes', function() {
  //   expectedVars = ['MockClass.GREEINGS', 'MockClass.trueOrFalse', 'MockClass.testLead', ''].sort();
  //   expect(engine.complete({query : "MockClass."})).toEqual(expectedVars);

  //   // expect(engine.findMatchingRules('MockClass.trueOrF')).toEqual({name: 'MockCLass.trueOrFalse'});
  //   // expect(engine.findMatchingRules('StandardObject.Thing')).toEqual([]);
  //   // expect(engine.findMatchingRules('CustomObj__r.Thi')).toEqual([]);
  //   // expect(engine.findMatchingRules('CustomObj__c.Thi')).toEqual([]);
  //   // expect(engine.findMatchingRules('CustomObj__c.Thing__r.Othe')).toEqual([]);
  // });
});

describe("Querys", function() {
  it('should be classfiable', function() {
    // expect(engine.findMatchingRules('MockClass.trueOrF')[0].path).toEqual([['class', 'member'], ['object', 'member']]);
  });
});
