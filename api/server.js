import { build } from "./app.js";
import cors from "@fastify/cors";

const app = build({ logger: true, keepAliveTimeout: 600000 });
app.register(cors);

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
});
