var classSymbolTable = require('../resources/symbol_tables/symbol_table.json'),
    Engine = require('../../app/completion.js'),
    _ = require('underscore');

describe("Class completion", function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 400;

  it('should grab all classes for a wildcard search', function(done) {
    var queryParams = {searchTerm: '', classSymbolTable: classSymbolTable,
                       sorted: true, namesOnly: true},

        engine = Engine(queryParams, function(data) {
          expect(data).toEqual(['MockClass', 'MockClassOther']);
          done();
        });

    engine.run();
  });

  it('should find one class', function(done) {
    var queryParams = {searchTerm: 'MockClassO', classSymbolTable: classSymbolTable,
                       sorted: true, namesOnly: true},

        engine = Engine(queryParams, function(data) {
          expect(data).toEqual(['MockClassOther']);
          done();
        });

    engine.run();
  });

  it('should find classes', function(done) {
    var queryParams = {searchTerm: 'MockClass', classSymbolTable: classSymbolTable,
                       sorted: true, namesOnly: true},

        engine = Engine(queryParams, function(data) {
          expect(data).toEqual(['MockClass', 'MockClassOther']);
          done();
        });

    engine.run();
  });
});

describe("Class Completion with members", function() {
  it('should find members', function(done) {
    var queryParams = {searchTerm: 'MockClass.G', classSymbolTable: classSymbolTable,
                       sorted: true, memberAttr: 'name'},
        engine = Engine(queryParams, function(data) {
          expect(data).toEqual(['GREETING']);
          done();
        });
    engine.run();
  });

  it('should find members', function(done) {
    var queryParams = {searchTerm: 'MockClass.t', classSymbolTable: classSymbolTable,
                       sorted: true, memberAttr: 'name'},
    engine = Engine(queryParams, function(data) {
      expect(data).toEqual([ 'trueOrFalse', 'testLead', 'testContact' ]);
      done();
    });
    engine.run();
  });

  it('do wild card searches with blank member', function(done) {
    var queryParams = {searchTerm: 'MockClass.', classSymbolTable: classSymbolTable,
                       sorted: true, memberAttr: 'name'},
    engine = Engine(queryParams, function(data) {
      expect(data).toEqual(
        [ 'trueOrFalse', 'testLead', 'testContact', 'GREETING', 'setMe', 'MockClass', 'MockClass' ]
      );
      done();
    });
    engine.run();
  });
});
