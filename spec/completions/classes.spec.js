var classSymbolTable = require('../resources/symbol_tables/symbol_table.json'),
    CompletionEngine = require('../../app/completion.js'),
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

// describe("Class Completion with members", function() {
//   it('should find members', function(done) {
//     var queryParams = {searchTerm: 'MockClass.G', classSymbolTable: classSymbolTable,
//                        sorted: true, memberAttr: 'name'},
//         engine = Engine(queryParams, function(errors, data) {
//           expect(data).toEqual(['GREETING']);
//           done();
//         });
//     engine.run();
//   });
//
//   it('should find members', function(done) {
//     var queryParams = {searchTerm: 'MockClass.t', classSymbolTable: classSymbolTable,
//                        sorted: true, memberAttr: 'name'},
//     engine = Engine(queryParams, function(errors, data) {
//       expect(data).toEqual([ 'trueOrFalse', 'testLead', 'testContact' ]);
//       done();
//     });
//     engine.run();
//   });
//
//   it('do wild card searches with blank member', function(done) {
//     var queryParams = {searchTerm: 'MockClass.', classSymbolTable: classSymbolTable,
//                        sorted: true, memberAttr: 'name'},
//     engine = Engine(queryParams, function(errors, data) {
//       expect(data).toEqual(
//         [ 'trueOrFalse', 'testLead', 'testContact', 'GREETING', 'setMe', 'MockClass', 'MockClass' ]
//       );
//       done();
//     });
//     engine.run();
//   });
});
