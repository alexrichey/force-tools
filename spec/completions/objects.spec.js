var completionEngine = require('../../app/completion.js'),
    objectsTable = require('../resources/symbol_tables/objects.json');


describe("Completions", function() {
  // var engine = new completionEngine({objectsSymbolTable : objectsTable});

  it('Should be able to complete basic object lookups', function() {
    // expect(engine.completeObjects({context : "Lead."})).toEqual(['email', 'first_name']);
    // expect(engine.completeObjects({context : "Lead.em"})).toEqual(['email']);
    // expect(engine.completeOkbjects({context : "Lead.emails"})).toEqual([]);
  });
});
