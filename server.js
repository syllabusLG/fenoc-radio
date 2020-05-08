const express = require("express");
const app = express();
const path = require("path");
const request = require("request");

app.use(express.static(__dirname + "/dist/fenoc-radio"));

app.listen(process.env.PORT || 8080);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/fenoc-radio/index.html"));
});

console.log("App is listenning");
