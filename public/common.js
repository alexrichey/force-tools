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
