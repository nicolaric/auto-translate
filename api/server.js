import { build } from "./app.js";
import { DatabaseSync } from "node:sqlite";
import cors from "@fastify/cors";

const app = build({ logger: true });
app.register(cors);

app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});
