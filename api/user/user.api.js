import { config } from "../config/config.js";
import { verifyGoogleToken, verifyInternalToken } from "../utils/auth/auth.js";
import { getUserByEmail, insertUser } from "../utils/db/user.db.js";
import jwt from "jsonwebtoken";
import { randomBytes, createHash } from "crypto";
import { createTokenSchema } from "./user-request.model.js";
import {
  insertToken,
  getTokens,
  deleteToken,
} from "../utils/db/api-token.db.js";

export const userApi = (fastify, _, done) => {
  fastify.get("/authenticate", async (request, reply) => {
    const verifiedUser = await verifyGoogleToken(request.headers.authorization);
    if (!verifiedUser) {
      reply.type("application/json").code(401).send({ error: "Unauthorized" });
      return;
    }

    const email = verifiedUser.email;

    let user = await getUserByEmail(email);

    try {
      if (!user) {
        user = insertUser(email);
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        config("JWT_SIGNING_KEY"),
        {
          expiresIn: "2 days",
        },
      );
      return { token };
    } catch (error) {
      console.error("error", error);
      reply
        .type("application/json")
        .code(500)
        .send({ error: "Internal Server Error" });
    }
  });

  fastify.post("/api-token", async (request, reply) => {
    const user = await verifyInternalToken(request.headers.authorization);

    try {
      createTokenSchema.parse(request.body);
    } catch (error) {
      console.error(error);
      reply.type("application/json").code(400);
      return { error: error.errors };
    }

    const token = randomBytes(32).toString("hex");

    const hashedToken = createHash("SHA256").update(token).digest("hex");

    const savedToken = await insertToken(
      user.id,
      request.body.name,
      hashedToken,
    );

    reply.type("application/json").code(200);
    return { ...savedToken, token: `sk-${token}` };
  });

  fastify.get("/api-token", async (request, reply) => {
    const user = await verifyInternalToken(request.headers.authorization);

    if (!user) {
      reply.type("application/json").code(401).send({ error: "Unauthorized" });
      return;
    }

    const tokens = await getTokens(user.id);

    reply.type("application/json").code(200);
    return tokens;
  });

  fastify.delete("/api-token/:id", async (request, reply) => {
    const user = await verifyInternalToken(request.headers.authorization);

    if (!user) {
      reply.type("application/json").code(401).send({ error: "Unauthorized" });
      return;
    }

    await deleteToken(request.params.id);

    reply.type("application/json").code(200);
  });

  done();
};
