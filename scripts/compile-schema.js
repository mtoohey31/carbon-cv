import fs from "fs";
import YAML from "js-yaml";
import { compile } from "json-schema-to-typescript";

const schema = YAML.load(String(fs.readFileSync("schema.yaml")));

try {
  fs.accessSync("types/generated");
} catch {
  try {
    fs.accessSync("types");
  } catch {
    fs.mkdirSync("types");
  }
  fs.mkdirSync("types/generated");
}

fs.writeFileSync(
  "types/generated/schema-type.ts",
  await compile(schema, "Recipe")
);
