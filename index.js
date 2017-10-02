var API = {
  ClassSymbolTable: require('./app/autocomplete/class_symbol_table.js'),
  AutoComplete: require('./app/autocomplete/autocomplete.js')
};


function App(config) {
  this.auth = {username: config.username, pw: config.pw, token: config.token};
  this.resourceDirectory = config.resourceDirectory;
  this.queryResources = {};
}

App.prototype.ClassSymbolTable = function () {
  return new API.ClassSymbolTable(this.auth, this.resourceDirectory);
};

App.prototype.AutoComplete = function () {
  return new API.AutoComplete(this.queryResources);
};

module.exports = App;

// var app = new App({username: 'alexr@richey-dev.com', pw: '4vrf5btg', token: 'Y1bTDOg1RJJX4qFNr9ASaj9u',
//                    resourceDirectory: '/Users/alex/Dev/test'});
