var classSymbolTable = require('../resources/symbol_tables/symbol_table.json'),
    Query = require('../../app/query.js');

describe("Class Query", function() {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
  var baseQueryArgs;

  beforeEach(function() {
    baseQueryArgs = {sorted: true, namesOnly: true, classSymbolTable: classSymbolTable};
  });

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

  it('with exact match should find one classes', function(done) {
    baseQueryArgs.className = 'MockClass';
    baseQueryArgs.exactMatch = true;
    var q = Query(baseQueryArgs);
    q.onFinish = function(data) {
      var expected = ['MockClass'];
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

  it('should find stuff that starts with t', function(done) {
    baseQueryArgs.className = 'MockClass';
    baseQueryArgs.memberName = 't';
    baseQueryArgs.memberAttr = 'name';

    var q = Query(baseQueryArgs);

    q.onFinish = function(data) {
      var expected = ['trueOrFalse', 'testLead', 'testContact'];
      expect(data).toEqual(expected);
      done();
    };

    q.run();
  });

  it('should find GREETING', function(done) {
    baseQueryArgs.className = 'MockClass';
    baseQueryArgs.memberName = 'G';
    baseQueryArgs.memberAttr = 'name';

    var q = Query(baseQueryArgs);

    q.onFinish = function(data) {
      var expected = ['GREETING'];
      expect(data).toEqual(expected);
      done();
    };

    q.run();
  });
});
