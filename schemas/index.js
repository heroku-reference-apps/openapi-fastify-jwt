export const directorySchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      username: { type: "string" },
    },
  },
  example: [
    { username: "alice01" },
    { username: "bob02" },
    { username: "carol03" },
  ],
};

export const profileSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
    },
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    email: {
      type: "string",
    },
  },
};

export const errorSchema = {
  type: "object",
  properties: {
    statusCode: { type: "number" },
    error: { type: "string" },
    message: { type: "string" },
  },
  required: ["statusCode", "error", "message"],
};
