var classSymbolTable = require('../resources/symbol_tables/symbol_table.json'),
    Query = require('../../app/query.js');

fdescribe('Queries', function() {
  q = new Query({classSymbolTable:classSymbolTable});

  fit('should find classes', function(done) {
    q.tester();
  });

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

  it('should find two MockClass constructors', function(done) {
    q.findClassesMembers({className:"MockClass", memberFilter: {name:"MockClass"}},
      function(errors, response) {
        var categories = response.map(function(member) {
          return member.category;
        });

        expect(categories).toEqual(['constructors','constructors']);
        done();
    });
  });

  it('should find attributes', function(done) {
    q.findClassesMembers({className:"MockClass", memberFilter: {name:"t"}},
      function(errors, response) {
        var names = response.map(function(member) {
          return member.name;
        });

        expect(names).toEqual(['trueOrFalse','testLead','testContact']);
        done();
    });
  });
});
