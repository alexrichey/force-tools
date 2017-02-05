var symbolTable = require('../resources/symbol_tables/symbol_table.json'),
    completionEngine = require('../../app/completion.js'),
    engine = new completionEngine({classSymbolTable : symbolTable});

describe("Class completion", function() {
  it('should be able to complete basic class lookups from the symbol table', function() {
    var classes = engine.complete({context: "Mock"}).sort();
    expect(classes).toEqual(['MockClass', 'MockClassOther'].sort());

    classes = engine.complete({filter: "MockClassO"}).sort();
    expect(classes).toEqual(['MockClassOther']);
  });

  it('should be able to lookup attributes from the classes', function() {
    expect(engine.findMatchingRules('MockClass.trueOrF')[0].path).toEqual([['class', 'attr'], ['object', 'attr']]);
    // expectedVars = ['MockClass.GREEINGS', 'MockClass.trueOrFalse', 'MockClass.testLead', ''].sort();
    // expect(engine.complete({filter : "MockClass."})).toEqual(expectedVars);
  });
});

describe("Filters", function() {
  it('should be classfiable', function() {
    // expect(engine.findMatchingRules('MockClass.trueOrF')).toEqual({name: 'MockCLass.trueOrFalse'});
    // expect(engine.findMatchingRules('StandardObject.Thing')).toEqual([]);
    // expect(engine.findMatchingRules('CustomObj__r.Thi')).toEqual([]);
    // expect(engine.findMatchingRules('CustomObj__c.Thi')).toEqual([]);
    // expect(engine.findMatchingRules('CustomObj__c.Thing__r.Othe')).toEqual([]);
  });
});
