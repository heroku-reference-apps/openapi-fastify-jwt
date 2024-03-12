import "dotenv/config";
import path from "path";
import AutoLoad from "@fastify/autoload";
import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const options = {};

export default async (fastify, _opts) => {
  fastify.register(Swagger, {
    openapi: {
      info: {
        title: "User Directory and Profile",
        description:
          "Demonstrates Fastify with authenticated route using RSA256 JWT",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            description:
              "RSA256 JWT signed by private key, with username in payload",
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      fastifys: [
        {
          url: "http://localhost:8080",
        },
      ],
      tags: [
        {
          name: "user",
          description: "User-related endpoints",
        },
      ],
    },
    refResolver: {
      buildLocalReference: (json, _baseUri, _fragment, _i) => {
        return json.$id || `def-{i}`;
      },
    },
  });

  fastify.register(SwaggerUI, {
    routePrefix: "/api-docs",
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}),
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}),
  });
};
