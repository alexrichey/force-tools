var jsonfile = require('jsonfile'),
    jsforce = require('jsforce'),
    path = require('path'),
    conn = new jsforce.Connection();

function SymbolTable(authConfig, resourceDirectory) {
  this.username = authConfig.username;
  this.pw = authConfig.pw;
  this.token = authConfig.token;

  this.resourceDirectory = resourceDirectory;
  this.classSymbolTableFileName = 'class_symbol_table.json';
}

SymbolTable.prototype.fetch = function(cb) {
  var response = {},
      that = this;
  conn.login(that.username, that.pw + that.token, function(err, res) {
    if (err) { return console.log(err); }
    conn.tooling.query("Select Id, Name, SymbolTable From ApexClass", function(err, result) {
      if (err) { return console.log(err); }
      var filePath = path.resolve(that.resourceDirectory, that.classSymbolTableFileName);
      jsonfile.writeFile(filePath, result, function (err) {
        cb(err, filePath);
      });
    });
  });
};

module.exports = SymbolTable;
