import { config } from "../config/config.js";
import { verifyGoogleToken } from "../utils/auth/auth.js";
import { getUserByEmail, insertUser } from "../utils/db/user.db.js";
import jwt from "jsonwebtoken";

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
            console.error(error);
            reply
                .type("application/json")
                .code(500)
                .send({ error: "Internal Server Error" });
        }
    });

    done();
};
