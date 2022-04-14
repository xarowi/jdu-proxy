/**
 * Open-source Just Dance Unlimited proxy
 */

require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const res = require("express/lib/response");

const app = express();
const port = process.env.PORT || "80";

// JSON body limited to 2 kibibyte
app.use(express.json({ limit: 2048 }));

/**
 * Application configuration endpoint
 */
app.get("/v1/applications/:applicationId/configuration", async function (request, response) {
  const { applicationId } = request.params;

  let configurationCheck = fs.existsSync(`./configurations/${applicationId}.json`);
  if (configurationCheck) {
    const configuration = require(`./configurations/${applicationId}.json`);
    return response.json(configuration);
  }

  response.sendStatus(404);
});

app.listen(port, function () {
  console.log("Listening at port", port);
});
