import { profileSchema, errorSchema } from "../schemas/index.js";

export default async function (fastify, _opts) {
  fastify.addSchema({
    $id: "profile",
    ...profileSchema,
  });

  fastify.addSchema({
    $id: "error",
    ...errorSchema,
  });

  fastify.get(
    "/profile",
    {
      schema: {
        description:
          "Get user's own profile with additional account attributes",
        tags: ["user"],
        security: [
          {
            BearerAuth: [],
          },
        ],
        response: {
          200: {
            description: "User profile",
            $ref: "profile#",
          },
          404: {
            description: "Not Found",
            $ref: "error#",
          },
          500: {
            description: "Internal Server Error",
            $ref: "error#",
          },
        },
      },
      onRequest: [fastify.auth([fastify.verifyJWT])],
    },
    async (request, reply) => {
      const { db } = fastify;
      const { username } = request.user;
      const sql =
        'SELECT username, first_name as "firstName", last_name as "lastName", email FROM users WHERE username=$1';
      const rows = await db.query(sql, [username]);
      if (rows.length) {
        reply.code(200).type("application/json").send(rows[0]);
      } else {
        reply.code(404).type("application/json").send({
          error: "Not found",
          message: "Profile not found",
          statusCode: 404,
        });
      }
    },
  );
}
