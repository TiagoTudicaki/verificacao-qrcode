const express = require("express");
const path = require("path");
const app = express();
const pickupRoute = require("./src/back/routes/pickupRoute");

app.use(express.json());

app.use(express.static(path.join(__dirname, "src/front/public")));

app.use(pickupRoute);
module.exports = app;

