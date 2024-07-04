import { DIRS } from "@src/helper";
import Ajv2020 from "ajv/dist/2020.js";
import fs from 'fs';
import path from 'path';

const lottieSchemaPath = path.join(DIRS.JSON_SCHEMAS, "lottie.json")
const lottieSchema = JSON.parse(fs.readFileSync(lottieSchemaPath, 'utf8'))

const ajv = new Ajv2020({
  strict: false,
});

export const lottie = ajv.compile(lottieSchema);