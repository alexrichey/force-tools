var classSymbolTable = require('../resources/symbol_tables/symbol_table.json'),
    Query = require('../../app/query.js');

describe('Queries', function() {
  q = new Query({classSymbolTable:classSymbolTable});

  it('should find classes', function(done) {
    q.findClassNames("Mock", function(errors, response) {
      var expected = ['MockClass', 'MockClassOther' ].sort();
      expect(response.sort()).toEqual(expected);
      done();
    });
  });

  it('should find testLead on MockClass', function(done) {
    q.findClassesMembers({className:"MockClass", memberFilter: {name:"testL"}},
      function(errors, response) {
        expect(response[0].name).toEqual('testLead');
        done();
    });
  });
});
