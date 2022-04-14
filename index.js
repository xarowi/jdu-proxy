/**
 * Open-source Just Dance Unlimited proxy
 */

require("dotenv").config();

const express = require("express");
const crypto = require("crypto");
const fs = require("fs");

const app = express();

const port = process.env.PORT || "80";
const baseUrl = `http://localhost:${port}`;

// JSON body limited to 2 kibibyte
app.use(express.json({ limit: 2048 }));

/**
 * Application configuration endpoint
 */
app.get(
  "/v1/applications/:applicationId/configuration",
  async function (request, response) {
    const { applicationId } = request.params;

    let configurationCheck = fs.existsSync(
      `./configurations/${applicationId}.json`
    );
    if (configurationCheck) {
      const configuration = require(`./configurations/${applicationId}.json`);

      configuration.gatewayResources.map(function (gatewayResource) {
        const { name, url } = gatewayResource;

        if (name === "spaces/entities") {
          let newUrl = url.replace(
            "https://{env}public-ubiservices.ubi.com",
            baseUrl
          );
          gatewayResource.url = newUrl;
        }

        return gatewayResource;
      });

      return response.json({ configuration });
    }

    response.sendStatus(404);
  }
);

/**
 * Entities endpoint
 */
app.get("/v2/spaces/:spaceId/entities", async function (request, response) {
  const { spaceId } = request.params;

  let entitiesCheck = fs.existsSync(`./entities/${spaceId}.json`);
  if (entitiesCheck) {
    const entities = require(`./entities/${spaceId}.json`);

    entities.map(function (entity) {
      let { obj } = entity;

      if (!obj.url) {
        entity.obj.url = baseUrl;
      }

      return entity;
    });

    return response.json({ entities });
  }

  response.sendStatus(404);
});

app.listen(port, function () {
  console.log("Listening at port", port);
});
