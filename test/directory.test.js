import { afterAll, describe, expect, test, vi } from "vitest";
import Fastify from "fastify";
import { base64 } from "../utils/read_key_file.js";
import build from "../app.js";

const EXAMPLE_PUBLIC_KEY = "utils/keys/public_key.example.rsa";
process.env.RSA_PUBLIC_KEY_BASE_64 = base64(EXAMPLE_PUBLIC_KEY);

const MOCK_DATA = [
  { username: "test01" },
  { username: "test02" },
  { username: "test03" },
];

const app = Fastify();
await build(app);

describe("/directory route", async () => {
  await app.listen();
  await app.ready();

  app.db.query = vi.fn(() => MOCK_DATA);

  test("status code is 200", async () => {
    await app
      .inject({
        method: "GET",
        url: "/directory",
      })
      .then((res) => {
        expect(res.statusCode).toBe(200);
      });
  });

  describe("response", async () => {
    test("is an object (array)", async () => {
      await app
        .inject({
          method: "GET",
          url: "/directory",
        })
        .then((res) => {
          const body = JSON.parse(res.body);
          expect(body).toBeTypeOf("object");
          expect(body).toHaveLength(MOCK_DATA.length);
          expect(body).toMatchObject(MOCK_DATA);
        });
    });
  });

  test("it calls db query", async () => {
    const spy = vi.spyOn(app.db, "query");
    await app
      .inject({
        method: "GET",
        url: "/directory",
      })
      .then((_res) => {
        expect(spy.mock.calls).toHaveLength(1);
      });
  });
});

afterAll(async () => {
  await app.close();
});
