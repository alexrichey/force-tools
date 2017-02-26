var symbolTable = require('../resources/symbol_tables/symbol_table.json'),
    CompletionEngine = require('../../app/completion.js'),
    _ = require('underscore'),
    totalAssertions = 0,
    engine = new CompletionEngine({classSymbolTable : symbolTable});

describe("Class completion", function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

  var getOrderedCompletions = function(searchTerm, fn) {
    engine.complete(searchTerm, function(errors, query) {
      engine.getOrderedFormattedQueryResults(query, function (errors, output) {
        fn(null, output);
      });
    });
  };

  it('should grab all classes for a wildcard search', function(done) {
    getOrderedCompletions({query: ''}, function(errors, output) {
      console.log('got here');
      expect(output).toEqual(['MockClass', 'MockClassOther' ]);
      done();
    });
  });

  it('should correctly filter class searches', function(done) {
    getOrderedCompletions({query: 'MockClass'}, function(errors, output) {
      expect(output).toEqual(['MockClass', 'MockClassOther']);
      done();
    });
  });

  it('should correctly filter class searches', function(done) {
    getOrderedCompletions({query: 'MockClassO'}, function(errors, output) {
      expect(output).toEqual(['MockClassOther' ]);
      done();
    });
  });

  it('should do class member lookups', function(done) {
    getOrderedCompletions({query: 'MockClassOther.'}, function(errors, output) {
      expect(output).toEqual(['MockClassOther.MockClassOther' ]);
      done();
    });
  });


});
