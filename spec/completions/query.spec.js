var classSymbolTable = require('../resources/symbol_tables/symbol_table.json'),
    Query = require('../../app/query.js');

fdescribe("Class Query", function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
  var baseQueryArgs = {sorted: true, namesOnly: true, classSymbolTable: classSymbolTable};

  it('should find all with a wildcard search', function(done) {
    baseQueryArgs.className = '';
    var q = Query(baseQueryArgs);
    q.onFinish = function(data) {
      var expected = ['MockClass', 'MockClassOther'];
      expect(data).toEqual(expected);
      done();
    };
    q.run();
  });

  it('should find classes', function(done) {
    baseQueryArgs.className = 'MockClass';
    var q = Query(baseQueryArgs);
    q.onFinish = function(data) {
      var expected = ['MockClass', 'MockClassOther'];
      expect(data).toEqual(expected);
      done();
    };
    q.run();
  });

  it('should find members', function(done) {
    baseQueryArgs.className = 'MockClass';
    baseQueryArgs.memberName = 'T';
    var q = Query(baseQueryArgs);

    q.onFinish = function(data) {
      var expected = ['MockClass', 'MockClassOther'];
      expect(data).toEqual(expected);
      done();
    };

    q.run();
  });
});
