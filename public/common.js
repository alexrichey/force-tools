var app = app || {};

app.refreshSymbolTable = function () {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      alert(xmlHttp.responseText);
  };
  xmlHttp.open("GET", '/refresh-symbol-table', true); // true for asynchronous
  xmlHttp.send(null);
};

app.handleSearchEvent = function (searchValue) {
  window.location.replace("/complete?filter="+searchValue);
  // console.log('handling search');
  // var xmlHttp = new XMLHttpRequest();
  // xmlHttp.open("GET", '/complete?filter='+searchValue, true); // true for asynchronous
  // xmlHttp.send(null);
};

app.addEventHandlers = function () {
  var searchBoxes = $('.classSearch');
  // searchParams = searchBox.val;
  searchBoxes.keypress(function(e) {
    if (e.which == 13) {
      app.handleSearchEvent(e.target.value);
    }
  });
};

window.onload = function () {
  app.addEventHandlers();
};
