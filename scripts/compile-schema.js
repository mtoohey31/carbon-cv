import fs from "fs";
import YAML from "js-yaml";
import { compile } from "json-schema-to-typescript";

const schema = YAML.load(String(fs.readFileSync("schema.yaml")));

fs.writeFileSync(
  "types/generated/schema-type.ts",
  await compile(schema, "Recipe")
);
