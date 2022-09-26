"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
require("dotenv/config");
var routes_1 = require("./routes");
var PORT = process.env.PORT;
var app = express();
app.use(routes_1.routes);
app.use(bodyParser.json());
app.listen(PORT, function () {
    console.log(">_ Webhook started, listening on port: " + PORT);
});
