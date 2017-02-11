var symbolTable = require('../resources/symbol_tables/symbol_table.json'),
    completionEngine = require('../../app/completion.js'),
    _ = require('underscore'),
    engine = new completionEngine({classSymbolTable : symbolTable});


describe("Class completion", function() {

  var givenQueryWeExpect = function(query, expected) {
    engine.complete(query, function(errors, output) {
      console.log('asserting...');
      expected.sort();
      actualResults = output.sort();
      expect(output).toEqual(expected);
    });
  };

  it('should be able to complete class and attr lookups from the symbol table', function() {
    var testCases = [
      // basic class lookups
      [{query: ""          }, ['MockClass', 'MockClassOther' ]],
      [{query: "Mock"      }, ['MockClass', 'MockClassOther' ]],
      [{query: "MockClassO"}, ['MockClassOther'              ]],

      // classes and attributes
      // [{query: "MockClassOther."}, ['MockClassOther.MockClassOther']]



    ];

    for(var i = 0; i < testCases.length; i++) {
      givenQueryWeExpect(testCases[i][0], testCases[i][1]);
    }


    // class and attributes
    // givenQueryWeExpect({query: "MockClassOther."}, ['MockClassOther.MockClassOther']);
  });
});
