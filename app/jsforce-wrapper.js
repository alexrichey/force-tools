var jsonfile = require('jsonfile'),
    jsforce = require('jsforce'),
    conn = new jsforce.Connection();

function setSymbolTable(username, pw, token, cb) {
  console.log('attempting login with ');
  console.log('username: ' + username);
  console.log("token = ", token);
  console.log("cb = ", cb);

  var response = {};
  conn.login(username, pw + token, function(err, res) {
    if (err) { return console.error(err); }
    conn.tooling.query("Select Id, Name, SymbolTable From ApexClass", function(err, result) {
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
