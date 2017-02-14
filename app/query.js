function Query(matchingRule) {
  this.results = [];
  this.status = 'new';
  this.timeOut = 1000; //ms
}

module.exports = Query;
