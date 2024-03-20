import { afterAll, beforeEach, describe, expect, test, vi } from "vitest";
import { ascii, base64 } from "../utils/read_key_file.js";
import { createSigner } from "fast-jwt";
import Fastify from "fastify";
import build from "../app.js";

const EXAMPLE_PRIVATE_KEY = "utils/keys/private_key.example.rsa";
const EXAMPLE_PUBLIC_KEY = "utils/keys/public_key.example.rsa";
const signSync = createSigner({
  algorithm: "RS256",
  key: ascii(EXAMPLE_PRIVATE_KEY),
});
process.env.RSA_PUBLIC_KEY_BASE_64 = base64(EXAMPLE_PUBLIC_KEY);

const USERNAME = "john.doe";

const generateToken = (username = USERNAME) => {
  return signSync({ username });
};

const app = Fastify();
await build(app);

describe("/profile route", async () => {
  await app.listen();
  await app.ready();

  app.db.query = vi.fn();

  describe("unauthenticated", async () => {
    test("status code is 401", async () => {
      await app
        .inject({
          method: "GET",
          url: "/profile",
        })
        .then((res) => {
          expect(res.statusCode).toBe(401);
        });
    });
  });

  describe("authenticated", async () => {
    beforeEach(() => {
      app.db.query.mockReset();
    });

    describe("when username in token payload not in database", async () => {
      describe("response", async () => {
        test("status code is 404", async () => {
          app.db.query.mockImplementationOnce(() => []);

          await app
            .inject({
              method: "GET",
              url: "/profile",
              headers: {
                Authorization: `Bearer ${generateToken("not-in-database")}`,
              },
            })
            .then((res) => {
              expect(res.statusCode).toBe(404);
            });
        });
      });
    });

    describe("when username in token payload is in database", async () => {
      beforeEach(() => {
        app.db.query.mockImplementationOnce(() => [MOCK_USER]);
      });

      const MOCK_USER = {
        username: "john.doe",
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
      };

      describe("response", async () => {
        test("status code is 200", async () => {
          await app
            .inject({
              method: "GET",
              url: "/profile",
              headers: {
                Authorization: `Bearer ${generateToken(USERNAME)}`,
              },
            })
            .then((res) => {
              expect(res.statusCode).toBe(200);
            });
        });
      });

      test("data should be user info", async () => {
        await app
          .inject({
            method: "GET",
            url: "/profile",
            headers: {
              Authorization: `Bearer ${generateToken(USERNAME)}`,
            },
          })
          .then((res) => {
            const body = JSON.parse(res.body);
            expect(body).toStrictEqual(MOCK_USER);
          });
      });
    });
  });
});

afterAll(async () => {
  await app.close();
});
