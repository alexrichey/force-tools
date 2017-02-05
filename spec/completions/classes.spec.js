var symbolTable = require('../resources/symbol_tables/symbol_table.json'),
    completionEngine = require('../../app/completion.js'),
    engine = new completionEngine({classSymbolTable : symbolTable});

var lookupScheme = {
  'class' : {'attr' : {},
             'method' : {}}
};

describe("Class completion", function() {
  it('should be able to complete basic class lookups from the symbol table', function() {
    var classes = engine.complete({context: "Mock"}).sort();
    expect(classes).toEqual(['MockClass', 'MockClassOther'].sort());

    classes = engine.complete({filter: "MockClassO"}).sort();
    expect(classes).toEqual(['MockClassOther']);
  });

  it('should be able to lookup attributes from the classes', function() {
    expect(engine.processFilter('MockClass.trueOrF')).toEqual([['class', 'attr'], ['object', 'attr']]);
    // expectedVars = ['MockClass.GREEINGS', 'MockClass.trueOrFalse', 'MockClass.testLead', ''].sort();
    // expect(engine.complete({filter : "MockClass."})).toEqual(expectedVars);
  });
});

describe("Filters", function() {
  it('should be classfiable', function() {
    // expect(engine.processFilter('MockClass.trueOrF')).toEqual({name: 'MockCLass.trueOrFalse'});
    // expect(engine.processFilter('StandardObject.Thing')).toEqual([]);
    // expect(engine.processFilter('CustomObj__r.Thi')).toEqual([]);
    // expect(engine.processFilter('CustomObj__c.Thi')).toEqual([]);
    // expect(engine.processFilter('CustomObj__c.Thing__r.Othe')).toEqual([]);
  });
});
