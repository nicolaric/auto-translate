import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
    path: `${__dirname}/.env.local`,
});

export function config(key) {
    console.log(process.env[key]);
    return process.env[key];
}
