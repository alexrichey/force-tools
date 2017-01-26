var completionEngine = require('../../app/completion.js'),
    resources = require('./completions.resources.json'),
    jasmine = require('jasmine');


describe("Completions", function() {
  var engine = new completionEngine({symbolTable : resources});

  it('Should be able to complete basic object lookups', function() {
    expect(engine.complete({context : "Lead."})).toEqual(['email', 'first_name']);
    expect(engine.complete({context : "Lead.em"})).toEqual(['email']);
    expect(engine.complete({context : "Lead.emails"})).toEqual(['email']);
  });
});
