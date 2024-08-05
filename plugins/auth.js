import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import auth from "@fastify/auth";

export default fp(async (fastify) => {
  if (!process.env.RSA_PUBLIC_KEY_BASE_64) {
    throw new Error(
      "Environment variable `RSA_PUBLIC_KEY_BASE_64` is required",
    );
  }

  const publicKey = Buffer.from(
    process.env.RSA_PUBLIC_KEY_BASE_64,
    "base64",
  ).toString("ascii");
  if (!publicKey) {
    fastify.log.error(
      "Public key not found. Make sure env var `RSA_PUBLIC_KEY_BASE_64` is set.",
    );
  }

  fastify.register(jwt, {
    secret: {
      public: publicKey,
    },
  });
  fastify.register(auth);

  fastify.decorate("verifyJWT", async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
