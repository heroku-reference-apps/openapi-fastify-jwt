import { createSigner } from "fast-jwt";
import { ascii } from "./read_key_file.js";

const USAGE = `Usage: npm run generate:jwt path/to/private_key.rsa '{"payload":"as_json"}'`;

if (process.argv.length < 4) {
  console.log(USAGE);
  process.exit();
}

let key;

try {
  key = ascii(process.argv[2]);
} catch (err) {
  console.error(`Could not find private key file: ${process.argv[2]}`);
  console.log(USAGE);
  process.exit();
}

try {
  const payload = JSON.parse(
    process.argv[3] || "--payload-empty-or-invalid-json--",
  );
  const signSync = createSigner({
    algorithm: "RS256",
    key,
  });

  const token = signSync(payload);
  console.log(`Token: ${token}`);
} catch (err) {
  console.error(err);
  console.error(`Payload must be valid JSON.`);
  console.log(USAGE);
  process.exit();
}
