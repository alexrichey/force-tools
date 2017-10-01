var classSymbolTable = require('../resources/symbol_tables/symbol_table.json'),
    CompletionEngine = require('../../app/autocomplete/autocomplete.js'),
    _ = require('underscore');

describe("Class completion", function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 400;
  var engine = CompletionEngine({classSymbolTable: classSymbolTable});

  it('should grab all classes for a wildcard search', function(done) {
    var queryParams = {searchTerm: ''};

    engine.run(queryParams, function (errors, queryResults) {
      var classNames = queryResults.map(function (symTable) {
        return symTable.Name;
      }).sort();
      expect(classNames).toEqual(['MockClass', 'MockClassOther'].sort());
      done();
    });
  });

  it('should find a specific class', function(done) {
    var queryParams = {searchTerm: 'MockClassO'};

    engine.run(queryParams, function (errors, queryResults) {
      var classNames = queryResults.map(function (symTable) {
        return symTable.Name;
      });
      expect(classNames).toEqual(['MockClassOther']);
      done();
    });
  });

  it('should find a class member', function(done) {
    engine.run({searchTerm: 'MockClass.G'}, function (errors, queryResults) {
      var result = queryResults[0];
      expect(result.name).toEqual('GREETING');
      done();
    });
  });

  it('should find class members', function(done) {
    engine.run({searchTerm: 'MockClass.t'}, function (errors, queryResults) {
      var queryResultNames = _.pluck(queryResults, 'name').sort();
      expect(queryResultNames).toEqual(['trueOrFalse', 'testLead', 'testContact'].sort());
      done();
    });
  });

  it('should find all class members with a wildcard search', function(done) {
    engine.run({searchTerm: 'MockClass.'}, function (errors, queryResults) {
      var queryResultNames = _.pluck(queryResults, 'name').sort();
      expect(queryResultNames).toEqual(['trueOrFalse', 'testLead', 'testContact', 'GREETING', 'setMe', 'MockClass', 'MockClass'].sort());
      done();
    });
  });
});
