var jsonfile = require('jsonfile');
var jsforce = require('jsforce');
var conn = new jsforce.Connection();

function setSymbolTable(cb) {
  var response = {};
  
  conn.login('alexr@richey-dev2.com', '3ced4vrfDn2UOVQ23vR8nftECBYXNgAv', function(err, res) {
    if (err) { return console.error(err); }
    conn.tooling.query("Select Id,Name,SymbolTable From ApexClass", function(err, result) {
      if (err) { return console.error(err); }

      console.log("fetched");
      jsonfile.writeFile('./resources/symbol_table.json', result, function (err) {
        console.log('writing to the jsonfile');
        this.response = result;
      });
    }); 
  });
  cb('hi there');
}

module.exports = setSymbolTable;
