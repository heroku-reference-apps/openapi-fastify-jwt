import fp from "fastify-plugin";
import pg from "pg";

const { Pool } = pg;

export default fp(async (fastify) => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  fastify.decorate("db", {
    query: async (text, params) => {
      const result = await pool.query(text, params);
      return result.rows;
    },
  });
});
