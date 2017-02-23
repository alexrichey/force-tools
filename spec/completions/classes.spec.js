var symbolTable = require('../resources/symbol_tables/symbol_table.json'),
    completionEngine = require('../../app/completion.js'),
    _ = require('underscore'),
    engine = new completionEngine({classSymbolTable : symbolTable});


describe("Class completion", function() {

  it('should complete', function(done) {
    engine.complete('MockClassO', function(errors, output) {
      var expected = ['MockClass', 'MockClassOther' ];
      var actualResults = output.sort();
      expect(actualResults).toEqual(expected);
      done();
    });
  });

  it('should complete', function(done) {
    engine.complete('', function(errors, output) {
      var expected = ['MockClass', 'MockClassOther' ];
      var actualResults = output.sort();
      expect(actualResults).toEqual(expected);
      done();
    });
  });

  it('testing.......', function(done) {
    console.log('here we go!');
    engine.runQueries([1,2,3], 0, console.log);
  });
});
