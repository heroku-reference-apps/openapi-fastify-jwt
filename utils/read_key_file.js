import fs from "fs";

const readToBuffer = (filePath) => {
  const key = fs.readFileSync(filePath);
  return Buffer.from(key);
};

const ascii = (filePath) => {
  return readToBuffer(filePath).toString("ascii");
};

const base64 = (filePath) => {
  return readToBuffer(filePath).toString("base64");
};

export { ascii, base64 };
