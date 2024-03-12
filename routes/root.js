export default async function (fastify, _opts) {
  fastify.get(
    "/",
    { schema: { hide: true } },
    async function (_request, reply) {
      reply.redirect("/api-docs");
    },
  );
}
