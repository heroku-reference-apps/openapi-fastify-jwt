import { directorySchema, errorSchema } from "../schemas/index.js";

export default async function (fastify, _opts) {
  fastify.addSchema({
    $id: "directory",
    ...directorySchema,
  });

  fastify.addSchema({
    $id: "error",
    ...errorSchema,
  });

  fastify.get(
    "/directory",
    {
      schema: {
        description: "Get alphabetized directory of usernames",
        tags: ["user"],
        response: {
          200: {
            description: "All usernames",
            content: {
              "application/json": {
                schema: {
                  $ref: "directory#",
                },
              },
            },
          },
          500: {
            description: "Internal Server Error",
            $ref: "error#",
          },
        },
      },
    },
    async (_request, reply) => {
      const { db } = fastify;
      const rows = await db.query(
        "SELECT username FROM users ORDER by username",
      );
      const records = rows.map((r) => ({ username: r.username }));
      reply.code(200).type("application/json").send(records);
    },
  );
}
