var PORT = process.env.PORT || 3344;
var express = require("express");

var app = express();
app.use(express.static(__dirname));

app.listen(PORT, function() {
  console.log('Node app is running on port', PORT);
});
