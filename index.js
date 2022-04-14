/**
 * Open-source Just Dance Unlimited proxy
 */

require("dotenv").config();

const express = require("express");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || "8080";

// JSON body limited to 2 kibibyte
app.use(express.json({ limit: 2048 }));

// Test endpoint
app.get("/", function (request, response) {
  response.send("");
});

app.listen(port, function () {
  console.log("Listening at port", port);
});
