var symbolTable = require('../resources/symbol_tables/symbol_table.json'),
    completionEngine = require('../../app/completion.js'),
    engine = new completionEngine({classSymbolTable : symbolTable});

describe("Class completion", function() {
  it('should be able to complete basic class lookups from the symbol table', function() {
    var classes = engine.completeClasses({context: "Mock"}).sort();
    expect(classes).toEqual(['MockClass', 'MockClassOther'].sort());

    classes = engine.completeClasses({filter: "MockClassO"}).sort();
    expect(classes).toEqual(['MockClassOther']);
  });

  it('should be able to lookup methods from the classes', function() {
    // expectedVars = ['GREEINGS', 'trueOrFalse', 'testLead', ''].sort();
    // expect(engine.completeClasses({context : "MockClass."})).toEqual(expectedVars);
  });
});
